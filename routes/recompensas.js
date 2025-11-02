// routes/recompensas.js - VERSIÓN MONGODB NATIVE CORREGIDA
const express = require('express');
const router = express.Router();
const { getDB } = require('../database/db');
const { ObjectId } = require('mongodb');

// GET - Obtener todas las recompensas
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const recompensas = await db.collection('recompensas')
            .find({ activa: true })
            .sort({ puntos_requeridos: 1 })
            .toArray();
        
        res.json({
            success: true,
            recompensas: recompensas.map(r => ({
                _id: r._id,
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
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST - Canjear recompensa
router.post('/:id/canjear', async (req, res) => {
    try {
        const db = getDB();
        const recompensaId = req.params.id;

        // Obtener recompensa
        const recompensa = await db.collection('recompensas').findOne({ 
            _id: new ObjectId(recompensaId) 
        });

        if (!recompensa) {
            return res.status(404).json({ success: false, error: 'Recompensa no encontrada' });
        }

        if (!recompensa.activa) {
            return res.status(400).json({ success: false, error: 'Esta recompensa no está disponible' });
        }

        // Calcular puntos actuales
        const tareas = await db.collection('tareas').find({ completada: true }).toArray();
        const puntosTotales = tareas.reduce((total, tarea) => total + (tarea.puntos || 10), 0);
        
        const recompensasCanjeadas = await db.collection('recompensas_canjeadas').find({}).toArray();
        const puntosGastados = recompensasCanjeadas.reduce((total, r) => total + r.puntos_gastados, 0);
        
        const puntosActuales = puntosTotales - puntosGastados;

        if (puntosActuales < recompensa.puntos_requeridos) {
            return res.status(400).json({ success: false, error: 'No tienes suficientes puntos' });
        }

        // Verificar stock (si aplica)
        if (!recompensa.canjeable_multiple) {
            const canjeExistente = await db.collection('recompensas_canjeadas').findOne({
                recompensa_id: new ObjectId(recompensaId)
            });
            
            if (canjeExistente) {
                return res.status(400).json({ success: false, error: 'Ya has canjeado esta recompensa' });
            }
        }

        // Crear registro de canje
        const canjeData = {
            recompensa_id: new ObjectId(recompensaId),
            recompensa_nombre: recompensa.nombre,
            puntos_gastados: recompensa.puntos_requeridos,
            fecha_canje: new Date(),
            estado: 'canjeado'
        };

        await db.collection('recompensas_canjeadas').insertOne(canjeData);

        // Calcular nuevos puntos restantes
        const nuevosPuntosGastados = puntosGastados + recompensa.puntos_requeridos;
        const puntosRestantes = puntosTotales - nuevosPuntosGastados;

        res.json({
            success: true,
            message: `🎉 ¡Recompensa canjeada! Has gastado ${recompensa.puntos_requeridos} puntos`,
            puntos_restantes: puntosRestantes,
            canje_id: canjeData._id
        });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// GET - Historial de canjes
router.get('/historial', async (req, res) => {
    try {
        const db = getDB();
        const canjes = await db.collection('recompensas_canjeadas')
            .find({})
            .sort({ fecha_canje: -1 })
            .limit(10)
            .toArray();

        res.json({
            success: true,
            historial: canjes.map(c => ({
                recompensa: c.recompensa_nombre,
                puntos: c.puntos_gastados,
                fecha: c.fecha_canje,
                estado: c.estado
            }))
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;