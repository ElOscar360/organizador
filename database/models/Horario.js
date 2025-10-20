// database/models/Horario.js
const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
    materia_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia',
        required: true
    },
    dia: {
        type: String,
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        required: true
    },
    hora_inicio: {
        type: String,
        required: true
    },
    hora_fin: {
        type: String,
        required: true
    },
    aula: {
        type: String,
        trim: true
    },
    profesor: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Horario', horarioSchema);