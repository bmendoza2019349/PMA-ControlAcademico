const { response, json } = require('express');
const Curso = require('../models/curso');
const Profesor = require('../models/profesor');
const Alumno = require('../models/alumnos');
const { existeCursosNombre, validarExistenciaProfesor } = require('../helpers/db-validators');

const cursosPost = async (req, res) => {
    try {
        const { nombre, detalle, acceso } = req.body;
        const profesor = req.profesor._id;

        const curso = new Curso({ nombre, detalle, acceso, profesor });

        await curso.save();

        res.status(200).json({
            msg: "Curso Agregado Con éxito",
            curso
        });
    } catch (error) {
        res.status(409).json({
            error: error.message,
        });
    }
};

const cursosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: "Habilitado" };
    const [total, cursos] = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
            .populate('profesor', 'nombre correo')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        cursos
    });
}

const cursosPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { profesor: profesorAutenticado } = req;
        const { _id, acceso, profesor, ...resto } = req.body;

        // Obtiene el curso por ID
        const curso = await Curso.findById(id);

        // Verifica si el profesor autenticado es el propietario del curso
        if (!curso || String(curso.profesor) !== String(profesorAutenticado._id)) {
            return res.status(403).json({
                msg: 'Acceso no autorizado. Solo el profesor propietario puede actualizar este curso.',
            });
        }

        // Actualizar el curso
        const cursoActualizado = await Curso.findByIdAndUpdate(id, resto, { new: true });

        // Actualizar los cursos en los alumnos
        await Alumno.updateMany(
            { cursos: { $in: [cursoActualizado._id] } },
            { $set: { "cursos.$": cursoActualizado._id } }
        );

        res.status(200).json({
            msg: 'Curso actualizado exitosamente',
            curso: cursoActualizado
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al actualizar el curso",
            error: error.message
        });
    }
};

const cursosDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const { profesor } = req;

        const curso = await Curso.findById(id);

        // Verifica si el profesor que intenta eliminar el curso es el mismo que lo creó
        if (!curso || curso.profesor.toString() !== profesor._id.toString()) {
            return res.status(403).json({
                msg: 'Acceso no autorizado. Solo el profesor propietario puede actualizar este curso.',
            });
        }

        // Actualizar alumnos eliminando el curso
        await Alumno.updateMany(
            { cursos: curso._id },
            { $pull: { cursos: curso._id } }
        );

        // Después de actualizar los alumnos, puedes eliminar el curso
        await Curso.findByIdAndUpdate(id, { estado: false });

        res.status(200).json({
            msg: 'Curso eliminado exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al eliminar el curso',
            error: error.message,
        });
    }
};


const cursosProfesorGet = async (req, res) => {
    try {
        // Obtener el ID del profesor desde el token
        const profesorId = req.profesor._id;

        // Obtener cursos asociados al profesor
        const cursos = await Curso.find({ profesor: profesorId });

        res.status(200).json({
            total: cursos.length,
            cursos
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener cursos del profesor",
            error: error.message
        });
    }
}

module.exports = {
    cursosDelete,
    cursosGet,
    cursosPost,
    cursosPut,
    cursosProfesorGet
}