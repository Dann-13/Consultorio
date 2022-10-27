//importamos express para utlizarlo
const express = require('express');
const myconn = require('express-myconnection');
const mysql = require('mysql');
const app = express();
//Hacemos set para la captura de datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());
// invocamops a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});
// el directorio publico
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
//utilizamos el motor de platillas
app.set('view engine', 'ejs');
//encriptar contraseñas modulo
//const bcryptjs =  require('bcryptjs');
//invocamos la conexxion de la DB
const connection = require('./database/db');
const conexion_2 = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
}
app.use(myconn(mysql,conexion_2,'single'));
//rutas
app.use('/', require('./routes/index'))
require('./routes/index');

app.set('port', process.env.PORT ||  3000);
app.listen(app.get('port'),(req, res) => {
    console.log('servidor en ejecucion' + app.get('port'));
})