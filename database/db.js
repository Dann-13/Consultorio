//const { compareSync } = require('bcryptjs');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});
//que nos muestre un mensaje en caso de que la conecxion este bien si no el error
connection.connect((error) => {
    if(error){
        console.log('el error de conecxion es ' + error);
    }
    console.log('Conexion con db es exitosa');
});
module.exports = connection;