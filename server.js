((express, server, bodyParser, fs)=>{

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(express.static("pub"));

  server.get('/', (req, res)=>{

    fs.readFile("./templates/home.html", (err, results)=>{
      res.send(results.toString());
    });
  });

  server.get('/success/:orderID', (req, res)=>{
    // console.log("req: " + JSON.stringify(req.params));
 var orderID = req.params.orderID;
 // console.log("orderID, server.get(), l14: " + orderID);
 var payerID = req.query.PayerID;
 // console.log("payerID, server.get(), l16: " + payerID);
 squatchPurchaseRepo.ExecuteOrder(payerID, orderID, (err, successID) => {
     if (err) {
         res.json(err);
     } else {
         res.send('<h1>Order Placed</h1>Please save your order confirmation number:<h3>' + successID + '</h3>')
     }
 });
  });

  server.get('/cancel/:orderID', (req, res)=>{
    var orderID = req.params.orderID;
      squatchPurchaseRepo.CancelOrder(orderID, (err, results) => {
          if (err) {
              res.send("There was an error removing this order");
          } else {
              res.redirect("/");
          }
      });
  });

  server.get('/orderdetails/:orderID', (req, res)=>{
    var orderID = req.params.orderID;
 squatchPurchaseRepo.GetOrder(orderID, (err, results) => {
     if (err) {
         res.json(err);
     } else {
         res.json(results);
     }
 });
  });

  server.get('/refund/:orderID', (req, res)=>{
    var orderID = req.params.orderID;

     squatchPurchaseRepo.RefundOrder(orderID, (err, refund) => {
         if (err) {
             res.json(err);
         } else {
             res.json(refund);
         }
     });
  });

  server.get('/recurring_succes/:planID', (req, res)=>{
    var orderID = req.params.orderID;

  squatchPurchaseRepo.RefundOrder(orderID, (err, refund) => {
      if (err) {
          res.json(err);
      } else {
          res.json(refund);
      }
  });
  });

  server.get('/recurring_cancel/:planID', (req, res)=>{
    var planID = req.params.planID;
  });

  server.get('/recurring_orderdetails/:agreementID', (req, res)=>{
    var agreementID = req.params.agreementID;
  });

  server.post('/buysingle', (req, res)=>{
    var quantity = req.body.Quantity;
 var purchaseName = "Single Squatch Habitat";
 var purchasePrice = 10.00;
 var taxPrice = 0;
 var shipppingPrice = 0;
 var description = "Single Habitat Sasuqtch Starter Kit";

 squatchPurchaseRepo.BuySingle(purchaseName, purchasePrice, taxPrice, shipppingPrice, quantity, description, (err, url) => {
     if (err) {
         // ToDo: do NOT show errors in details in production environment
         res.json(err);
     } else {
         res.redirect(url);
     }
 });
  });

  server.post('/buyrecurring', (req, res)=>{
    squatchPurchaseRepo.BuyRecurring(
        "Squatch Plan",
        "Recurring Squatch Plan",
        0,
        (err, plan) => {
            if (err) {
                res.json(err);
            } else {
                res.redirect(plan);
            }
        }
    );
  });

  server.get('/recurring_success/:planID', (req, res) => {
    var planID = req.params.planID;
    var token = req.query.token;

    squatchPurchaseRepo.ExecuteRecurring(token, (err, results) => {
        if (err) {
            res.json(err);
        } else {
            res.json(results);
        }
    });
});

server.get('/recurring_cancel/:planID', (req, res) => {
    var planID = req.params.planID;
    // todo: remove the record from mongoDB
});

server.get('/recurring_orderdetails/:agreementID', (req, res) => {
    var agreementID = req.params.agreementID;

    squatchPurchaseRepo.GetRecurringDetails(agreementID, (err, recurring_orderdetails) => {
        if (err) {
            res.json(err);
        } else {
            res.json(recurring_orderdetails);
        }
    });
});

  server.listen(8080, "localhost", (err)=>{
    console.log(err || "server Online");
  });

})
(
  require('express'),
  require('express')(),
  require('body-parser'),
  require('fs')
);
