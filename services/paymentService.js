((paymentService, paypal, mongoService, ObjectID) => {
    require('./config.js').SetConfig(paypal);

    paymentService.CreateItemObj = (name, price, quantity) => {

        var itemObj = {
            name: name,
            price: price,
            currency: "USD",
            quantity: quantity
        };
        return itemObj;
    };

    // --------------------------------------------------------------------------------------
    // Single Purchase
    paymentService.CreateWithPayPal = (transactionsArray, returnUrl, cancelUrl, cb) => {

        var dbObj = {
            OrderID: "",
            CreateTime: "",
            Transactions: ""
        };

        mongoService.Create('paypal_orders', dbObj, (result) => {
            var paymentObj = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": returnUrl + "/" + result.insertedId,
                    "cancel_url": cancelUrl + "/" + result.insertedId
                },
                "transactions": transactionsArray
            };

            paypal.payment.create(paymentObj, (err, response) => {
                if (err) {
                    return cb(err);
                } else {
                    // console.log("response, paymentService.CreateWithPaypal: " + JSON.stringify(response));
                    dbObj = {
                        OrderID: response.id,
                        CreateTime: response.create_time,
                        Transactions: response.transactions
                    };
                    // console.log("dbObj.OrderID, paymentService.CreateWithPayPal: " + dbObj.OrderID);
                    // console.log("dbObj.Transactions, paymentService.CreateWithPayPal: " + JSON.stringify(dbObj.Transactions));
                    // console.log("result, paymentService.CreateWithPayPal: " + JSON.stringify(result));
                    // console.log("dbObj.Transactions, paymentService.CreateWithPaypal: " + JSON.stringify(dbObj.Transactions));
                    mongoService.UpdateOne('paypal_orders', { _id: result.insertedId }, dbObj, (err, result) => {
                        for (var i = 0; i < response.links.length; i++) {
                            if (response.links[i].rel == "approval_url") {
                                return cb(null, response.links[i].href);
                            }
                        }
                    });
                }
            });
        });
    };

    paymentService.CreateTransactionObj = (tax, shipping, description, itemList) => {
        var total = 0.0;
        for (var i = 0; i < itemList.length; i++) {
            var newQuant = itemList[i].quantity;
            if (newQuant >= 1) {
                total += itemList[i].price;
            } else {
                total = itemList[i].price;
            }
        }
        var transactionObj = {
            "amount": {
                "total": total,
                "currency": "USD",
                "details": {
                    "tax": tax,
                    "shipping": shipping
                }
            },
            "description": description,
            "item_list": { "items": itemList }
        }
        return transactionObj;
    };

    paymentService.GetPayment = (paymentID, cb) => {
        paypal.payment.get(paymentID, (err, payment) => {
            if (err) {
                console.log(err);
                return cb(err);
            } else {
                return cb(null, payment);
            }
        });
    };

    paymentService.ExecutePayment = (payerID, orderID, cb) => {
        var payerObj = { payer_id: payerID };

        mongoService.Read('paypal_orders', { _id: new ObjectID(orderID) }, (err, results) => {
            console.log("orderID, paymentService.ExecutePayment: " + orderID);
            if (results) {
                console.log("results, paymentService.ExecutePayment: " + JSON.stringify(results));
                paypal.payment.execute(results[0].OrderID, payerObj, {}, (err, response) => {
                    if (err) {
                        return cb(err);
                    }
                    if (response) {
                        var updateObj = {
                            OrderDetails: response
                        };
                        mongoService.UpdateOne('paypal_orders', { _id: new ObjectID(orderID) }, updateObj, (err, update_results) => {
                            return cb(null, orderID);
                        });
                    }
                });
            } else {
                return cb("no order found for this ID");
            }
        });
    };

    paymentService.RefundPayment = (saleID, amount, cb) => {
        var data = {
            "amount": {
                "currency": "USD",
                "total": amount
            }
        };

        paypal.sale.refund(saleID, data, (err, refund) => {
            if (err) {
                return cb(err);
            } else {
                return cb(null, refund);
            }
        });
    };
})
    (
    module.exports,
    require('paypal-rest-sdk'),
    require('./mongoService.js'),
    require('mongodb').ObjectId
    );
