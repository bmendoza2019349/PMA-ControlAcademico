const Curso = require('../models/curso');
const Alumno = require('../models/alumnos');
const jwt = require('jsonwebtoken');

const validarCursos = async (req, res, next) => {
    try {

        const { nombreMateria } = req.body;
        const token = req.header("x-token")

        if (!token) {
            return res.status(401).json({
                error: 'No hay token',
            });
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const alumno = await Alumno.findById(uid);

        if (!alumno) {
            return res.status(404).json({
                error: 'El alumno no existe',
            });
        }

        const curso = await Curso.findOne({ nombre: nombreMateria });
        if (!curso) {
            return res.status(404).json({
                error: 'El curso no existe',
            });
        }

        if (alumno.cursos.includes(curso._id)) {
            return res.status(400).json({
                error: 'El alumno ya está inscrito en este curso',
            });
        }

        if (alumno.cursos.length >= 3) {
            return res.status(400).json({
                error: 'El alumno ya está inscrito en el máximo de cursos permitidos',
            });
        }

        req.curso = curso;
        req.alumno = alumno;

        next();
    } catch (error) {
        res.status(500).json({
            msg: 'Error al validar el curso',
            error: error.message,
        });
    }
};

module.exports = {validarCursos};