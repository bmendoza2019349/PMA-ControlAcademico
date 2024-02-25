const { Schema, model } = require('mongoose');

const CursoSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    detalle: {
        type: String,
        required: [true, 'El detalle es obligatorio']
    },
    acceso: {
        type: String,
        required: [true, 'El codigo de acceso es obligatorio']
    },
    profesor: {
        type: Schema.Types.ObjectId,
        ref: 'Profesor', 
        required: [true, 'El profesor es obligatorio']
    },
    estado: {
        type: String,
        default: "Habilitado"
    }
});

module.exports = model('Curso', CursoSchema);