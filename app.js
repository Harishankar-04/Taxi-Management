const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs=require('ejs');
const { dirname } = require("path");
const { nextTick } = require("process");
var mysql = require('mysql');
const app = express();
var userid,dloc,ploc,cab;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hari123",
  database: "db1"
});
var pool = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  user: "root",
  password: "hari123",
  database: "db1"
});
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "INSERT INTO suma values(1)";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });
var usernamec;

app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static(__dirname));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
 
});
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
 
});
app.get("/signups", (req, res) => {
  res.sendFile(path.join(__dirname, 'index2.html'));
 
});
app.get("/transaction", (req, res) => {
  res.sendFile(path.join(__dirname, 'index4.html'));
 
});
app.get("/trip", (req, res) => {
  res.sendFile(path.join(__dirname, 'index3.html'));
 
});
app.get("/bookstrip", (req, res) => {
  res.sendFile(path.join(__dirname, 'bill.html'));
 
});
app.get("/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, 'feedback.html'));
 
});


app.get("/data",(req,res)=>{
  con.connect(function(err) {
    if (err) console.log(err);
    //Select all customers and return the result object:
    con.query("SELECT * FROM user_", function (err, result, fields) {
      if (err) throw err;
      res.send(result)
    });
  });
  

});
app.get("/data1",(req,res)=>{
  
  var obj = new Object();
   obj.userid = userid;
   obj.d  = dloc;
   obj.p = ploc;
   obj.price=100;
   if(cab=="Mini"){
     obj.price+=100;
   }
   if(cab=="Sedan"){
    obj.price+=190;
   }
   else{
    obj.price+=300;
   }
   if(obj.d=="Marudamalai" || obj.d=="Perur"){
     obj.pric1+=300;
   }
   else if(obj.d=="Ukkadam" || obj.d=="Pollachi"){
    obj.price+=350;
   }
   else{
    obj.price+=1000;
   }
   var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
obj.billid=Math.ceil(Math.random()*(999999999)+1000);
today = mm + '/' + dd + '/' + yyyy;
   con.query('INSERT INTO BILL_DETAILS VALUES (?,?,?,?,?)', [obj.billid,obj.price-57,57,today,obj.userid], function(err,result) {
    if(err) console.log(err)
    console.log("Inserted successfully");
  });
   
  res.send(obj);
});

app.post("/signup", (req, res) => {
  const data = req.body;
  var x = parseInt(data.Phno, 10);
  
  con.query('INSERT INTO user_ VALUES (?,?,?,?,?,?,?)', [data.username,data.fsname,data.lsname,data.Gender,data.Address,data.Phno,data.password], function(err,result) {
    if(err) console.log(err)
    console.log("Inserted successfully");
  });
    
   res.redirect("/");
  

});


app.post("/getfeedback", (req, res) => {
  const data = req.body;
  
  
  con.query('INSERT INTO FEEDBACK VALUES (NULL,?,?,?)', [data.message,data.email,data.name], function(err,result) {
    if(err) console.log(err)
    console.log("Inserted successfully");
  });
    
   res.redirect("/");
  

});






app.post("/booktrip", (req, res) => {
  const data = req.body;
  console.log(data.drop);
  console.log(data.pickup);
  console.log(data.drop);
  console.log(data.cabtype);
  console.log(data.tripdate);
  console.log(data.user_id);
  userid=data.user_id;
  dloc=data.drop;
  ploc=data.pickup;
  cab=data.cabtype;
  con.query('INSERT INTO TRIP_DETAILS VALUES (NULL,?,?,?,?,?,?,?)', [data.user_id,"10000",data.pickup,data.drop,data.time,data.tripdate,data.cabtype], function(err,result) {
    if(err) console.log(err)
    console.log("Inserted successfully");
    
    res.redirect("/bookstrip")
  });
  
   
  

});





app.listen(5001, () => {
  console.log(`Server is running on port 5000.`);
  
});


