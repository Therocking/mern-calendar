require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { dbConnection } = require('./database/config');


// Crear el servidor de express
const app = express(); 

// Base de Datos
dbConnection();

// CORS
app.use(cors())

// Directorio Publico
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() ) ;

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// 
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// Escuchar peticiones 
app.listen( process.env.PORT, () => {
    console.log(`Hola en el puerto ${process.env.PORT}`);
});