// database/models/Materia.js
const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    codigo: {
        type: String,
        trim: true
    },
    creditos: {
        type: Number,
        min: 1,
        max: 10
    },
    color: {
        type: String,
        default: '#EC4899'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Materia', materiaSchema);