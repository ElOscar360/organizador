// database/models/RecompensaCanjeada.js
const mongoose = require('mongoose');

const recompensaCanjeadaSchema = new mongoose.Schema({
    usuario_id: {
        type: String,
        default: 'novia',
        required: true
    },
    recompensa_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recompensa',
        required: true
    },
    puntos_gastados: {
        type: Number,
        required: true
    },
    fecha_canje: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'entregada', 'rechazada'],
        default: 'pendiente'
    },
    notificacion_enviada: {
        type: Boolean,
        default: false
    },
    mensaje_personal: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RecompensaCanjeada', recompensaCanjeadaSchema);