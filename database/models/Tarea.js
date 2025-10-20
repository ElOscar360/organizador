// database/models/Tarea.js
const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    tipo: {
        type: String,
        enum: ['tarea', 'quiz', 'parcial', 'trabajo', 'proyecto'],
        default: 'tarea'
    },
    materia_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia'
    },
    fecha_entrega: {
        type: Date
    },
    fecha_completada: {
        type: Date
    },
    prioridad: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    completada: {
        type: Boolean,
        default: false
    },
    puntos: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calcular puntos antes de guardar
tareaSchema.pre('save', function(next) {
    if (this.isModified('prioridad') || this.isModified('tipo')) {
        this.puntos = calcularPuntos(this.prioridad, this.tipo);
    }
    next();
});

function calcularPuntos(prioridad, tipo) {
    let puntosBase = (prioridad || 3) * 5;
    let multiplicador = 1;

    switch(tipo) {
        case 'parcial': multiplicador = 3; break;
        case 'trabajo': multiplicador = 2.5; break;
        case 'proyecto': multiplicador = 2; break;
        case 'quiz': multiplicador = 1.5; break;
        default: multiplicador = 1;
    }

    return Math.round(puntosBase * multiplicador);
}

module.exports = mongoose.model('Tarea', tareaSchema);