const Alumno = require('../models/alumnos');

const validarAccionesAlumno = async (req, res, next) => {
    try {
        const { id } = req.params;
        const alumnoAutenticado = req.alumno;

        const alumno = await Alumno.findById(id);

        if (!alumno) {
            return res.status(404).json({
                msg: 'Alumno no encontrado',
            });
        }

        // Verificar si el alumno autenticado coincide con el alumno que se va a actualizar o eliminar
        if (alumnoAutenticado._id.toString() !== alumno._id.toString()) {
            return res.status(403).json({
                msg: 'El alumno autenticado no puede eliminar o actualizar a otro alumno',
            });
        }

        req.alumnoAccion = alumno; // Pasamos el alumno al objeto de solicitud para que esté disponible en el controlador
        next(); // Llamamos a next para pasar al siguiente middleware o al controlador
    } catch (error) {
        res.status(500).json({
            msg: 'Error al validar las acciones del alumno',
            error: error.message,
        });
    }
};

module.exports ={
    validarAccionesAlumno
} 