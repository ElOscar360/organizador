// database/models/Progreso.js - VERSIÓN MEJORADA
const mongoose = require('mongoose');

const progresoSchema = new mongoose.Schema({
    puntos_totales: {
        type: Number,
        default: 0,
        min: 0
    },
    puntos_gastados: {
        type: Number,
        default: 0,
        min: 0
    },
    puntos_actuales: {
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
    },
    recompensas_canjeadas: {
        type: Number,
        default: 0,
        min: 0
    },
    nivel: {
        type: Number,
        default: 1,
        min: 1
    }
}, {
    timestamps: true
});

// Calcular puntos actuales automáticamente
progresoSchema.pre('save', function(next) {
    this.puntos_actuales = this.puntos_totales - this.puntos_gastados;
    // Calcular nivel basado en puntos totales
    this.nivel = Math.floor(this.puntos_totales / 100) + 1;
    next();
});

// Método para gastar puntos
progresoSchema.methods.gastarPuntos = async function(puntos) {
    if (this.puntos_actuales < puntos) {
        throw new Error('Puntos insuficientes');
    }
    this.puntos_gastados += puntos;
    this.recompensas_canjeadas += 1;
    await this.save();
    return this.puntos_actuales;
};

// Método para agregar puntos
progresoSchema.methods.agregarPuntos = async function(puntos) {
    this.puntos_totales += puntos;
    this.tareas_completadas += 1;
    await this.save();
    return this.puntos_actuales;
};

// Solo debe haber un documento de progreso
progresoSchema.statics.getProgreso = async function() {
    let progreso = await this.findOne();
    if (!progreso) {
        progreso = await this.create({});
    }
    return progreso;
};

module.exports = mongoose.model('Progreso', progresoSchema);