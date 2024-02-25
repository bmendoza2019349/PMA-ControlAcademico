const Alumno = require('../models/alumnos');
const Profesor = require('../models/profesor');
const Curso = require('../models/curso');


const existeCursosNombre = async (nombre = '') => {
    const nombreNormalizado = nombre.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    const existeNombre = await Curso.findOne({ nombre: nombreNormalizado });
    
    if (existeNombre) {
        throw new Error(`El curso ${nombre} ya fue registrado`);
    }
}

const existenteAlumnoEmail = async (correo = '') => {
    const existeEmail = await Alumno.findOne({correo});
    if(existeEmail){
        throw new Error(`El email ${ correo } ya fue registrado`)
    }
}

const existenteProfesorEmail = async (correo = '') => {
    const existeEmail = await Profesor.findOne({correo});
    if(existeEmail){
        throw new Error(`El email ${ correo } ya fue registrado`)
    }
}

const existeAlumnoById = async ( id = '') => {
    const existeUsuario = await Alumno.findOne({id});
    if(!existeUsuario){
        throw new Error(`El usuario con el ${ id } no existe`);
    }
}
const existeProfesorById = async ( id = '') => {
    const existeUsuario = await Profesor.findOne({id});
    if(!existeUsuario){
        throw new Error(`El usuario con el ${ id } no existe`);
    }
}

const existeCursoById = async ( id = '') => {
    const existeUsuario = await Curso.findOne({id});
    if(!existeUsuario){
        throw new Error(`El curso con el ${ id } no existe`);
    }
}

const existeCursoByCorreo = async ( correo = '') => {
    const existeUsuario = await Curso.findOne({correo});
    if(!existeUsuario){
        throw new Error(`El curso con el ${ correo } no existe`);
    }
}

const validarCursosRepetidos = (cursos) => {
    const set = new Set(cursos);
    if (set.size !== cursos.length) {
        const cursosRepetidos = [...set].filter(curso => cursos.indexOf(curso) !== cursos.lastIndexOf(curso));
        throw new Error(`No se puede agregar el curso varias veces ${cursosRepetidos}`);
    }
}

const validarNumCursos = (cursos) => {
    if(cursos.length > 3){
        throw new Error('Excede el numero máximo de cursos (3 Permitidos)');
    }else if(cursos.length < 1){
        throw new Error('Debes Colocar minimo 1 curso')
    }
}

const validarExistenciaCursos = async (cursos) => {
    const cursosEncontrados = await Curso.find({nombre: {$in: cursos}});
    if(cursos.length !== cursosEncontrados.length){
        const cursosNoEncontrados = cursos.filter(curso => !cursosEncontrados.some(c => c.nombre === curso));
        throw new Error('No se encontraron los cursos');
    }
}

const validarExistenciaProfesor = async (correo) => {
    const existeProfesor = await Profesor.findOne({ correo });

    if (!existeProfesor) {
        throw new Error(`No se encontró o no es profesor con el correo ${correo}`);
    }
}

module.exports = {
    existeCursoById,
    existeProfesorById,
    existenteAlumnoEmail,
    existeCursoByCorreo,
    existeAlumnoById,
    existeCursosNombre,
    validarCursosRepetidos,
    validarNumCursos,
    validarExistenciaCursos,
    validarExistenciaProfesor,
    existenteProfesorEmail
}

