// routes/recompensas.js - VERSIÓN COMPLETA
const express = require('express');
const router = express.Router();
const Recompensa = require('../database/models/Recompensa');
const RecompensaCanjeada = require('../database/models/RecompensaCanjeada');
const Progreso = require('../database/models/Progreso');

// GET - Obtener todas las recompensas
router.get('/', async (req, res) => {
    try {
        const recompensas = await Recompensa.find({ activa: true }).sort({ puntos_requeridos: 1 });
        
        res.json({
            success: true,
            recompensas: recompensas.map(r => ({
                id: r._id,
                nombre: r.nombre,
                descripcion: r.descripcion,
                puntos_requeridos: r.puntos_requeridos,
                categoria: r.categoria,
                imagen: r.imagen,
                color: r.color,
                canjeable_multiple: r.canjeable_multiple
            }))
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST - Canjear recompensa
router.post('/:id/canjear', async (req, res) => {
    try {
        const recompensa = await Recompensa.findById(req.params.id);
        const progreso = await Progreso.getProgreso();

        if (!recompensa) {
            return res.status(404).json({ error: 'Recompensa no encontrada' });
        }

        if (!recompensa.activa) {
            return res.status(400).json({ error: 'Esta recompensa no está disponible' });
        }

        // Calcular puntos actuales
        const puntosActuales = progreso.puntos_totales - progreso.puntos_gastados;

        if (puntosActuales < recompensa.puntos_requeridos) {
            return res.status(400).json({ error: 'No tienes suficientes puntos' });
        }

        if (!recompensa.stock_ilimitado && recompensa.stock_actual <= 0) {
            return res.status(400).json({ error: 'Recompensa agotada' });
        }

        // Crear registro de canje
        const canje = new RecompensaCanjeada({
            recompensa_id: recompensa._id,
            puntos_gastados: recompensa.puntos_requeridos
        });

        await canje.save();

        // Restar puntos del progreso
        await progreso.gastarPuntos(recompensa.puntos_requeridos);

        // Actualizar stock si no es ilimitado
        if (!recompensa.stock_ilimitado) {
            recompensa.stock_actual -= 1;
            await recompensa.save();
        }

        // Obtener progreso actualizado para calcular puntos restantes
        const progresoActualizado = await Progreso.getProgreso();
        const puntosRestantes = progresoActualizado.puntos_totales - progresoActualizado.puntos_gastados;

        res.json({
            success: true,
            message: `🎉 ¡Recompensa canjeada! Has gastado ${recompensa.puntos_requeridos} puntos`,
            puntos_restantes: puntosRestantes,
            canje_id: canje._id
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET - Historial de canjes
router.get('/historial', async (req, res) => {
    try {
        const canjes = await RecompensaCanjeada.find()
            .populate('recompensa_id', 'nombre puntos_requeridos')
            .sort({ fecha_canje: -1 })
            .limit(10);

        res.json({
            success: true,
            historial: canjes.map(c => ({
                recompensa: c.recompensa_id?.nombre || 'Recompensa eliminada',
                puntos: c.puntos_gastados,
                fecha: c.fecha_canje,
                estado: c.estado
            }))
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;