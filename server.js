((express, server, bodyParser, fs)=>{

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(express.static("pub"));

  server.get('/', (req, res)=>{

    fs.readFile("./templates/home.html", (err, results)=>{
      res.send(results.toString());
    })

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
