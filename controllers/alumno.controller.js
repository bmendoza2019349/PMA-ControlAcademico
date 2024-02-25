const { response, json } = require('express');
const bcrypt = require('bcrypt');
const Alumno = require('../models/alumnos');
const { existenteAlumnoEmail } = require('../helpers/db-validators');
const validarCursos = require('../middlewares/validar-cursos');
const Curso = require('../models/curso');

const alumnosPost = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;
        await existenteAlumnoEmail(correo);
        const hashedPassword = await bcrypt.hash(password, 10);
        const alumno = new Alumno({ nombre, correo, password: hashedPassword });
        await alumno.save();
        res.status(200).json({
            msg: 'Alumno Agregado Exitosamente',
            alumno
        });
    } catch (error) {
        res.status(409).json({
            error: error.message,
        });
    }
}

const alumnosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, google, correo, office, ...resto } = req.body;

    await Alumno.findByIdAndUpdate(id, resto);

    const alumno = await Alumno.findOne({ _id: id });

    res.status(200).json({
        msg: 'Alumno actualizado exitosamente',
        alumno
    });
}



const alumnosDelete = async (req, res) => {
    try {
        
        const { id } = req.params;
        
        const alumno = await Alumno.findByIdAndUpdate(id, { estado: false });
        res.status(200).json({
            msg: 'Alumno eliminado',
            alumno
        });
    } catch (error) {
        res.status(500).json({
            msg: "Alumno no se elimino"
        });
    }
}


const agregarCursoAlumno = async (req, res = response) => {
    try {
        const { curso } = req;
        const alumno = req.alumno;

        alumno.cursos.push(curso._id);
        await alumno.save();

        res.status(200).json({
            msg: 'Curso agregado exitosamente al alumno',
            alumno,
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Error al agregar el curso al alumno',
            error: error.message,
        });
    }
};


const getCursosAlumnoByToken = async (req, res) => {
    try {
        const alumno = req.alumno;

        // Modificación: Obtener los cursos y el nombre del curso
        const cursos = await Curso.find({ _id: { $in: alumno.cursos } });
        const cursosConNombre = cursos.map(curso => ({
            _id: curso._id,
            nombre: curso.nombre,
            detalle: curso.detalle,
            profesor: curso.profesor
        }));

        res.status(200).json({
            cursos: cursosConNombre
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los cursos del alumno',
            error: error.message,
        });
    }
};

module.exports = {
    alumnosPost,
    alumnosDelete,
    alumnosPut,
    agregarCursoAlumno,
    getCursosAlumnoByToken
}