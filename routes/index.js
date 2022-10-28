const { render } = require('ejs');
const { application } = require('express');
//const bcryptjs = require('bcryptjs');
const bodyParser = require('body-parser');
const urlcodeParser = bodyParser.urlencoded({ extended: false })
const express = require('express');
const connection = require('../database/db');
const router = express.Router();


// variables de session
const session = require('express-session');
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/cita', (req, res) => {
    res.render('cita')
})
router.get('/registro', (req, res) => {
    res.render('registro');
});
router.get('/consulta',(req, res)=>{
    res.render('consulta');
})
//Registro POST
router.post('/registro', (req, res, next) => {
    //capturamos los tres campos
    const name = req.body.name;
    const num_ident = req.body.num_ident;
    const email = req.body.email;
    //encriptamos la contraseña
    //let passwordencry = await bcryptjs.hash(pass,8); por si algo jaja y necesitamos
    connection.query("INSERT INTO pacientes SET ?", { id: num_ident, nombre: name, email: email }, async (error, results) => {
        if (error) {
            console.log(error);
            res.render('registro', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Incorrecto",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        } else {
            res.render('registro', {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "Registro Exitoso",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        };
    });
});
router.post('/auth', (req, res) => {
    const email = req.body.email;
    const identificacion = req.body.password;
    if (email && identificacion) {
        connection.query('SELECT * FROM pacientes WHERE email = ?', [email], async (error, result) => {
            if (result.length == 0 || identificacion != result[0].id) {
                console.log("Esta es la de la base de datos" + result[0].id + "Esta es la de ingreso" + identificacion);
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Email y/o Identificacion Incorrectas",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                });
            } else {
                req.session.loggedin = true;
                req.session.nombre = result[0].nombre;
                req.session.id = result[0].id;
                console.log(result[0].name)
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexión Exitosa",
                    alertMessage: "Login Correcto",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                })
            }
            res.end();
        })
    } else {
        res.send('Ingrese un su email y identificacion');
    }
});
//Método para controlar que está auth en todas las páginas
router.get('/session', (req, res) => {
    if (req.session.loggedin) {
        res.render('session', {
            login: true,
            nombre: req.session.nombre
        });
    } else {
        res.render('session', {
            login: false,
            name: 'De click para Iniciar Sesion!',
        });
    }
    res.end();
});
router.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
    })
});

//registro cita
router.post('/session', urlcodeParser, (req, res, next) => {
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    //Numero de id de paciente
    const identificacion = req.body.password;
    //predifinido

    connection.query('SELECT * FROM medicos LIMIT 1', async (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //obtenos la id del medico predeterminado para guarar en una variable
            const idMedico = result[0].id;
            //Conexion para agendamiento
            connection.query("INSERT INTO citas SET ?", { numero_identificacion: identificacion, hora: hora, fecha: fecha, id_medico: idMedico, id_paciente: identificacion }, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Ser registro Correctamente")
                    const x = ""
                    // SELECT * FROM citas WHERE numero_identificacion = ${identificacion}`
                    const consulta = `SELECT * FROM citas ORDER BY id DESC LIMIT 1 `
                    connection.query(consulta, [req.body], (err, result, rows) => {
                        if (err) {
                            { res.send(err) }
                        } else {
                            //res.status(200).send({ result })
                            console.log(result)
                            res.render('cita', {
                                idcita: result[0].id,
                                numIden: result[0].numero_identificacion,
                                hora: result[0].hora,
                                fecha: result[0].fecha,
                            })
                        }
                    })
                }
            });
        }
    });
});
router.post('/consulta', urlcodeParser, function (req, res){
    const idbusqueda = req.body.idbusqueda;
    console.log(idbusqueda)
    //Me enseñara el ultimo registro de un determinado usuario
    connection.query('SELECT * FROM citas WHERE numero_identificacion = ? ORDER BY id DESC LIMIT 1', [idbusqueda], async (err, result, rowst) =>{
        if(err){
            console.log(err)
        }else{
            console.log(result);
            res.render('mostrar', {
                idcita: result[0].id,
                numIden: result[0].numero_identificacion,
                hora: result[0].hora,
                fecha: result[0].fecha,
            })
        }
    });
})
//mostrar registros
router.post('/mostrar', urlcodeParser, function (req, res) {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        const x = ""
        const consulta = `SELECT * FROM medicos LIMIT 1`
        conn.query(consulta, [req.body], (err, result, rows) => {
            if (err) {
                { res.send(err) }
            } else {
                res.status(200).send({ result })
                idMedico = result[0].id;
                console.log(idMedico)
            }
        })
    })
});
module.exports = router;