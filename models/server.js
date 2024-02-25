const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.alumnosPath = '/api/alumnos';
        this.profesoresPath = '/api/profesores';
        this.cursosPath = '/api/cursos';
        this.authPath = '/api/auth';
        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.alumnosPath, require('../routes/alumnos.routes'));
        this.app.use(this.profesoresPath, require('../routes/profesor.routes'));
        this.app.use(this.cursosPath, require('../routes/curso.routes'));
        this.app.use(this.authPath, require('../routes/auth.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor ejecutandose y escuchando el puerto', this.port);
        });
    }
}

module.exports = Server;