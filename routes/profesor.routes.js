const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { existenteProfesorEmail, existeProfesorById} = require('../helpers/db-validators');

const {profesoresPost} = require('../controllers/profesor.controller');

const router = Router();

router.post(
    "/",
    [
        check("nombre","El nombre es obligatorio").not().isEmpty(),
        check("password","El password debe ser mayor a 6 caracteres").isLength({min: 6,}),
        check("correo","Este no es un correo válido").isEmail(),
        check("correo").custom(existenteProfesorEmail),
        check("role", "El rol solo puede ser actualizado no ingresado"),
        validarCampos,
    ], profesoresPost);

module.exports = router;