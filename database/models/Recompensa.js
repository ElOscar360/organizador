// database/models/Recompensa.js
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
    desbloqueada: {
        type: Boolean,
        default: false
    },
    fecha_desbloqueo: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Recompensa', recompensaSchema);