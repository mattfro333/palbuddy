((mongoService, mongodb) => {

    const url = "mongodb://localhost:27017";
    const dbName = "paypaltesting";

    var Connect = (cb) => {
        mongodb.connect(url, { useNewUrlParser: true }, (err, client) => {
            return cb(err, client.db(dbName), () => {
                client.close();
            });
        });
    };

    mongoService.Create = (colName, createObj, cb) => {
        Connect((err, db, close) => {
            db.collection(colName)
                .insertOne(createObj)
                .then(result => {
                    // console.log("result, mongoService.Create: " + JSON.stringify(result));
                    // const { insertedId } = result;
                    // console.log(`Inserted document with _id: ${insertedId}`);
                    // console.log("InsertedId: " + result.insertedId);
                    cb(result);
                    return close();
                })
                .catch(err => console.error(err.message));
        });
    };

    mongoService.Read = (colName, readObj, cb) => {
        Connect((err, db, close) => {
            db.collection(colName).find(readObj).toArray((err, results) => {
                cb(err, results);
                return close();
            });
        });
    };

    mongoService.UpdateOne = (colName, findObj, updateObj, cb) => {
        Connect((err, db, close) => {
            console.log("findObj, mongoService.UpdateOne: " + JSON.stringify(findObj));
            // console.log("updateObj, mongoService.Update: " + JSON.stringify(updateObj));
            db.collection(colName).updateOne(findObj, { $set: updateObj })
                .then(results => {
                    console.log("results, mongoService.UpdateOne: " + JSON.stringify(results));
                    cb(results);
                    return close();
                })
                .catch(err => { console.error(err.meesage) });
        });
    };

    mongoService.Delete = (colName, findObj, cb) => {
        Connect((err, db, close) => {
            db.collection(colName).remove(findObj, (err) => {
                cb(err);
                return close();
            });
        });
    };
})
    (
    module.exports,
    require('mongodb')
    )
