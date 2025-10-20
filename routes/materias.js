// routes/materias.js - VERSIÓN MONGODB
const express = require('express');
const router = express.Router();
const Materia = require('../database/models/Materia');

// GET - Obtener todas las materias
router.get('/', async (req, res) => {
    try {
        const materias = await Materia.find().sort({ nombre: 1 });

        res.json({
            success: true,
            materias: materias.map(m => ({
                id: m._id,
                nombre: m.nombre,
                codigo: m.codigo,
                creditos: m.creditos,
                color: m.color
            }))
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST - Crear nueva materia
router.post('/', async (req, res) => {
    try {
        const { nombre, codigo, creditos, color } = req.body;

        const materia = new Materia({
            nombre,
            codigo,
            creditos,
            color: color || '#EC4899'
        });

        await materia.save();

        res.json({
            success: true,
            id: materia._id,
            message: 'Materia creada exitosamente 📚'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;