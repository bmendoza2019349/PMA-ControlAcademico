const validarProfesor = (req, res, next) => {
    try {
        const { profesor } = req;

        if (!profesor) {
            return res.status(403).json({
                msg: 'Acceso no autorizado. Solo profesores pueden realizar esta acción.',
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error en la validación de profesores',
            error: error.message,
        });
    }
};

module.exports = validarProfesor;