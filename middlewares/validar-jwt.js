const jwt = require('jsonwebtoken');
const Profesor = require('../models/profesor');
const Alumno = require('../models/alumnos');

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token'
        })
    }

    try {

        //verificación de token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //leer el usuario que corresponde al uid
        const profesor = await Profesor.findById(uid); // se debe colocar para recibir id
        const alumno = await Alumno.findById(uid); // se debe colocar para recibir id
        //verificar que el usuario exista.

        if(profesor){
            if (!profesor) {
                return res.status(400).json({
                    msg: 'El profesor no existe'
                });
            }
            //verificar si el uid está habilidato.
            if (!profesor.estado) {
                return res.status(401).json({
                    msg: 'Token valido, profesor con estado false'
                })
            }
    
    
            if (profesor) {
                req.profesor = profesor;
                req.correo = profesor.correo;
            }
        }else{
            if (!alumno) {
                return res.status(400).json({
                    msg: 'El alumno no existe'
                });
            }
            //verificar si el uid está habilidato.
            if (!alumno.estado) {
                return res.status(401).json({
                    msg: 'Token valido, profesor con estado false'
                })
            }
    
    
            if (alumno) {
                req.alumno = alumno;
            }
        }
        
        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            msg: 'Token no valido'
        })

    }
}

module.exports = {
    validarJWT
}