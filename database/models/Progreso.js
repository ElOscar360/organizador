// database/models/Progreso.js
const mongoose = require('mongoose');

const progresoSchema = new mongoose.Schema({
    puntos_totales: {
        type: Number,
        default: 0,
        min: 0
    },
    tareas_completadas: {
        type: Number,
        default: 0,
        min: 0
    },
    tiempo_estudio_total: {
        type: Number,
        default: 0,
        min: 0
    },
    racha_actual: {
        type: Number,
        default: 0,
        min: 0
    },
    mejor_racha: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Solo debe haber un documento de progreso
progresoSchema.statics.getProgreso = async function() {
    let progreso = await this.findOne();
    if (!progreso) {
        progreso = await this.create({});
    }
    return progreso;
};

module.exports = mongoose.model('Progreso', progresoSchema);