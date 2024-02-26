const { response } = require('express');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const Profesor = require('../models/profesor');
const { existenteProfesorEmail } = require('../helpers/db-validators');


const profesoresPost = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;
        await existenteProfesorEmail(correo);
        const hashedPassword = await bcrypt.hash(password, 10);
        const profesor = new Profesor({ nombre, correo, password: hashedPassword});

        await profesor.save();
        res.status(200).json({
            msg: "Profesor Agregado Con éxito",
            profesor
        });
    } catch (error) {
        res.status(409).json({
            error: error.message,
        });
    }
}



module.exports = {
    profesoresPost,
}