((express, server, bodyParser, fs)=>{

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(express.static("pub"));

  server.get('/', (req, res)=>{

    fs.readFile("./templates/home.html", (err, results)=>{
      res.send(results.toString());
    });
  });

  server.get('/success/:orderID', (req, res)=>{
    var orderID = req.params.orderID;
  });

  server.get('/cancel/:orderID', (req, res)=>{
    var orderID = req.params.orderID;
  });

  server.get('/orderdetails/:orderID', (req, res)=>{
    var orderID = req.params.orderID;
  });

  server.get('/refund/:orderID', (req, res)=>{
    var orderID = req.params.orderID;
  });

  server.get('/recurring_succes/:planID', (req, res)=>{
    var planID = req.params.planID;
  });

  server.get('/recurring_cancel/:planID', (req, res)=>{
    var planID = req.params.planID;
  });

  server.get('/recurring_orderdetails/:agreementID', (req, res)=>{

  });

  server.post('/buysingle', (req, res)=>{

  });

  server.post('/buyrecurring', (req, res)=>{

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
