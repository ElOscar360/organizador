// routes/progreso.js - VERSIÓN MONGODB
const express = require('express');
const router = express.Router();
const Progreso = require('../database/models/Progreso');
const Recompensa = require('../database/models/Recompensa');

// GET - Obtener progreso y recompensas
router.get('/', async (req, res) => {
    try {
        const [progreso, recompensas] = await Promise.all([
            Progreso.getProgreso(),
            Recompensa.find().sort({ puntos_requeridos: 1 })
        ]);

        res.json({
            success: true,
            progreso: {
                puntos_totales: progreso.puntos_totales,
                tareas_completadas: progreso.tareas_completadas,
                tiempo_estudio_total: progreso.tiempo_estudio_total,
                racha_actual: progreso.racha_actual,
                mejor_racha: progreso.mejor_racha
            },
            recompensas: recompensas.map(r => ({
                id: r._id,
                nombre: r.nombre,
                descripcion: r.descripcion,
                puntos_requeridos: r.puntos_requeridos,
                desbloqueada: r.desbloqueada,
                fecha_desbloqueo: r.fecha_desbloqueo
            }))
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;