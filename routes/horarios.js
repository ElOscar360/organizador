// routes/horarios.js - VERSIÓN MONGODB
const express = require('express');
const router = express.Router();
const Horario = require('../database/models/Horario');

// GET - Obtener horario completo
router.get('/', async (req, res) => {
    try {
        const horarios = await Horario.find()
            .populate('materia_id', 'nombre color')
            .sort({ 
                dia: 1,
                hora_inicio: 1 
            });

        res.json({
            success: true,
            horarios: horarios.map(h => ({
                id: h._id,
                materia_id: h.materia_id?._id,
                materia_nombre: h.materia_id?.nombre,
                materia_color: h.materia_id?.color,
                dia: h.dia,
                hora_inicio: h.hora_inicio,
                hora_fin: h.hora_fin,
                aula: h.aula,
                profesor: h.profesor
            }))
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST - Agregar clase al horario
router.post('/', async (req, res) => {
    try {
        const { materia_id, dia, hora_inicio, hora_fin, aula, profesor } = req.body;

        const horario = new Horario({
            materia_id,
            dia,
            hora_inicio,
            hora_fin,
            aula,
            profesor
        });

        await horario.save();

        res.json({
            success: true,
            id: horario._id,
            message: 'Clase agregada al horario 🕐'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Eliminar horario
router.delete('/:id', async (req, res) => {
    try {
        await Horario.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Clase eliminada del horario 🗑️'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;