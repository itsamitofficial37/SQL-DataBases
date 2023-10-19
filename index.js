const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");

const app = express();
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let port = 3000;

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "instagram",
  password: "Amit@123",
});

const createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Home Routes

app.get("/", (req, res) => {
  try {
    let query = `SELECT count(*) FROM user`;

    connection.query(query, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
      // console.log(result);
    });
  } catch (err) {
    console.log(err);
    res.send("Error Occurs");
  }
});

// user route

app.get("/user", (req, res) => {
  try {
    let query = "SELECT * FROM user";
    connection.query(query, (err, user) => {
      if (err) throw err;

      res.render("user.ejs", { user });
    });
  } catch (err) {
    res.send(err);
  }
});

// edit routes

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let query = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      let user = result[0];

      res.render("edit.ejs", { user });
    });
  } catch (err) {
    res.send(err);
  }
});

// UPDATE ROUTES

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUserName } = req.body;
  let query = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Password Entered");
      } else {
        let query2 = `UPDATE user SET username='${newUserName}' WHERE id='${id}'`;
        connection.query(query2, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// DElete Routes

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      
      res.render("delete.ejs",{user});
    });
  } catch (err) {
    res.send("Some error in Databases");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

// app.get("/user/:id/edits", (req, res) => {
//   let {id} = req.params;
//   let query = `SELECT * FROM user WHERE id = '${id}'`;
//   try {

//     connection.query(query, (err, result) => {
//       if (err) throw err;
//       console.log(result);

//       res.render("edit.ejs");
//     });
//   } catch (err) {}
// });

//   let data = [];

//   for(let i = 1 ; i<= 100 ; i++ ) {
//     data.push(createRandomUser());
//   }

//  let users = [
//   ["abc2","random_user2 ","randaomgmail.com2",321],
//   ["abc3","random_user3 ","randaomgmail.com23",421]

// ];

app.listen(port, () => console.log("Server is start on PORT  3000"));
