// database/models/Recompensa.js - VERSIÓN MEJORADA
const mongoose = require('mongoose');

const recompensaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    puntos_requeridos: {
        type: Number,
        required: true,
        min: 0
    },
    canjeable_multiple: {
        type: Boolean,
        default: true  // Puede canjearse múltiples veces
    },
    activa: {
        type: Boolean,
        default: true
    },
    categoria: {
        type: String,
        enum: ['digital', 'fisica', 'experiencia', 'comida', 'especial'],
        default: 'digital'
    },
    stock_ilimitado: {
        type: Boolean,
        default: true
    },
    stock_actual: {
        type: Number,
        default: -1  // -1 = ilimitado
    },
    imagen: {
        type: String,
        default: '🎁'  // Emoji por defecto
    },
    color: {
        type: String,
        default: '#EC4899'  // Color rosa por defecto
    },
    prioridad: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    tiempo_entrega: {
        type: String,
        default: 'Inmediato'
    }
}, {
    timestamps: true
});

// Método para verificar si puede canjearse
recompensaSchema.methods.puedeCanjearse = function() {
    return this.activa &&
           (this.stock_ilimitado || this.stock_actual > 0);
}

// Método para canjear (reducir stock)
recompensaSchema.methods.canjear = async function() {
    if (!this.stock_ilimitado) {
        if (this.stock_actual <= 0) {
            throw new Error('Recompensa agotada');
        }
        this.stock_actual -= 1;
        await this.save();
    }
    return true;
};

module.exports = mongoose.model('Recompensa', recompensaSchema);