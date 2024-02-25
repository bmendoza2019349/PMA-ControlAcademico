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

const getProfesorByid = async (req, res) => {
    const { id } = req.params;
    const profesor = await Profesor.findOne({ _id: id });

    res.status(200).json({
        msg: "Profesor Encontrado",
        profesor
    });
}

const profesoresGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, profesores] = await Promise.all([
        Profesor.countDocuments(query),
        Profesor.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        profesores
    });
}

const profesoresPut = async (req, res) => {

    const { id } = req.params;
    const { _id, password, google, office, correo, ...resto } = req.body;

        await Profesor.findByIdAndUpdate(id, resto);
        const profesor = await Profesor.findOne({ _id: id });

        res.status(200).json({
            msg: "Profesor actualizado Exitosamente",
            profesor
        }); 
}

const profesoresDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const profesor = await Profesor.findByIdAndUpdate(id, { estado: false });
        const profesorAutenticado = req.profesor;
        res.status(200).json({
            msg: "Profesor a eliminar",
            profesor,
            profesorAutenticado
        });
    } catch (error) {
        res.status(500).json({
            msg: "Profesor no se elimino"
        });
    }

}

module.exports = {
    profesoresDelete,
    profesoresGet,
    profesoresPost,
    profesoresPut,
    getProfesorByid
}