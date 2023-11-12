const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));

const mongouri = 'mongodb+srv://davidsantyr:Bosso010529@cluster0.cwmgfpb.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });
app.post('/register',(req, res)=>{
    const {username, password} = req.body;
    bcrypt.hash(password, 10)
    .then(hash => {
        return User.create({
            username,
            password: hash
        });
    })
    .then(user => {
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            id: user._id
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: 'Error al crear el usuario'
        });
    });
})
app.post('/autenticate', (req, res)=>{
    const {username, password} = req.body;
    let _user;
    User.findOne({username})
    .then(user => {
        if (!user) {
            return Promise.reject('Usuario y/o contraseña incorrectos');
        }
        _user = user;
        return bcrypt.compare(password, user.password);
    })
    .then(samePassword => {
        if (!samePassword) {
            return Promise.reject('Usuario y/o contraseña incorrectos');
        }
        res.status(200).json({
            message: 'Autenticación exitosa',
            id: _user._id
        });
    })
    .catch(err => {
        console.error(err);
        res.status(401).json({
            message: 'Autenticación fallida'
        });
    });
})
app.get('/', (req, res) => {
    res.send('¡Bienvenido al sistema de inicio de sesión!');
  });

app.listen(3000, () => {
    console.log(`Servidor en http://localhost:${3000}`);
});

module.exports = app;