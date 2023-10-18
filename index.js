const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'instagram',
    password : "Amit@123"
  });
  
  const createRandomUser = () =>  {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ]
    };
    
    let data = [];

    for(let i = 1 ; i<= 100 ; i++ ) {
      data.push(createRandomUser());
    }
   let query = "INSERT INTO user (id , username, email, password) VALUES ?";

  //  let users = [
  //   ["abc2","random_user2 ","randaomgmail.com2",321],
  //   ["abc3","random_user3 ","randaomgmail.com23",421]

  // ];


  try {

    connection.query(query, [data] , (err,result ) => {
        if(err) throw err;
        console.log(result);
      })
  }

  catch(err){
    console.log(err);
  }
 
