

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database : "retrogaming"
});

con.connect(function(err) {
  if (err) throw err;
});

const sql = "SELECT * from jeux";

con.connect(function(err) {
    console.log("Connecté à la base de données MySQL!");
    con.query("SELECT * from jeux", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});
