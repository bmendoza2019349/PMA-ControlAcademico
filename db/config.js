const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN,{});
        console.log('Base de datos conectada exitosamente');
    } catch (errores) {
        throw new console.error('Error al conectar a la base de datos'+ errores);        
    }
}

module.exports = {
    dbConnection
}