const { generarJWT } = require("../helpers/generar-jwt");
const Profesor = require('../models/profesor');
const Alumno = require('../models/alumnos');
const bcryptjs = require('bcryptjs');

const login = async (req, res) => {
    const { correo, password } = req.body;
    const alumno = await Alumno.findOne({ correo });
    const profesor = await Profesor.findOne({ correo });

    //toma las variables de ambos para realizar verificacion
    let user, userType;
    if (alumno) {
        user = alumno;
        userType = 'alumno'
    } else {
        user = profesor;
        userType = 'profesor';
    }
    
    try {

        if (!user) {
            return res.status(400).json({
                msg: 'El correo No esta Registrado'
            })
        }
        // verificar que el usuarip esta activo
        if (!user.estado) {
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }

        //verificar que la contraseña  sea la correcta
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Constraseña incorrecta'
            })
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: 'Acceso concedido',
            user,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Comuniquese con el admin'
        })
    }

}

module.exports = {
    login,
}