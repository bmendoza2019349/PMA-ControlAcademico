const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { existenteAlumnoEmail, existeAlumnoById } = require('../helpers/db-validators');
const { validarAccionesAlumno } = require('../middlewares/validar-alumnos');
const { alumnosPost, alumnosPut, alumnosDelete, agregarCursoAlumno, getCursosAlumnoByToken } = require('../controllers/alumno.controller');
const { validarCursos } = require('../middlewares/validar-cursos');

const router = Router();

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe ser mayor a 6 caracteres").isLength({ min: 6, }),
        check("correo", "Este no es un correo válido").isEmail(),
        check("correo").custom(existenteAlumnoEmail),
        validarCampos,
    ], alumnosPost);


router.put(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos,
        validarJWT,
        validarAccionesAlumno,
    ], alumnosPut);

router.delete(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos,
        validarJWT,
        validarAccionesAlumno,
    ], alumnosDelete);


    router.post(
        "/cursos",
        [
            validarJWT,
            check("nombreMateria", "El nombre de la materia es obligatorio").not().isEmpty(),
            validarCampos,
            validarCursos,
        ],
        agregarCursoAlumno
    );

    router.get(
        "/cursos",
        [
            validarJWT,
            check("id", "El id no es un formato válido de MongoDB").isMongoId(),
            check("id").custom(existeAlumnoById),
            validarCampos,
        ],
        getCursosAlumnoByToken
    );

module.exports = router;
