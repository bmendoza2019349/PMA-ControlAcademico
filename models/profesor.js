const { Schema, model} = require('mongoose');

const ProfesorSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img:{
        type: String
    },
    role:{
        type: String,
        enum: ["TEACHER_ROLE", "STUDENT_ROLE"],
        default: "TEACHER_ROLE"
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    },
    office:{
        type: Boolean,
        default: false
    }
});

ProfesorSchema.methods.toJSON = function(){
    const { __v, password,_id, ...profesor} = this.toObject();
    profesor.uid = _id;
    return profesor;
    
}

module.exports = model('Profesor',ProfesorSchema);