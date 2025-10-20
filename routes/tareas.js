// routes/tareas.js - VERSIÓN MONGODB
const express = require('express');
const router = express.Router();
const Tarea = require('../database/models/Tarea');
const Progreso = require('../database/models/Progreso');
const Recompensa = require('../database/models/Recompensa');

// GET - Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const tareas = await Tarea.find()
            .populate('materia_id', 'nombre color')
            .sort({ 
                completada: 1,
                prioridad: -1,
                fecha_entrega: 1 
            });

        res.json({
            success: true,
            tareas: tareas.map(t => ({
                id: t._id,
                titulo: t.titulo,
                descripcion: t.descripcion,
                tipo: t.tipo,
                materia_id: t.materia_id?._id,
                materia_nombre: t.materia_id?.nombre,
                materia_color: t.materia_id?.color,
                fecha_entrega: t.fecha_entrega,
                prioridad: t.prioridad,
                completada: t.completada,
                puntos: t.puntos,
                fecha_creacion: t.createdAt
            })),
            total: tareas.length,
            pendientes: tareas.filter(t => !t.completada).length
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST - Crear nueva tarea
router.post('/', async (req, res) => {
    try {
        const { titulo, descripcion, tipo, materia_id, fecha_entrega, prioridad } = req.body;

        const tarea = new Tarea({
            titulo,
            descripcion,
            tipo: tipo || 'tarea',
            materia_id: materia_id || null,
            fecha_entrega,
            prioridad: prioridad || 3
        });

        await tarea.save();

        res.json({
            success: true,
            id: tarea._id,
            message: 'Tarea creada exitosamente 📝',
            puntos_ganados: tarea.puntos
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST - Marcar tarea como completada
router.post('/:id/completar', async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        
        if (!tarea) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        if (tarea.completada) {
            return res.status(400).json({ error: 'La tarea ya estaba completada' });
        }

        tarea.completada = true;
        tarea.fecha_completada = new Date();
        await tarea.save();

        // Actualizar progreso
        await actualizarProgreso(tarea.puntos);

        res.json({
            success: true,
            message: '¡Tarea completada! ✅',
            puntos_ganados: tarea.puntos,
            mensaje_especial: generarMensajeMotivacional()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Eliminar tarea
router.delete('/:id', async (req, res) => {
    try {
        await Tarea.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Tarea eliminada correctamente 🗑️'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Funciones auxiliares
async function actualizarProgreso(puntos) {
    const progreso = await Progreso.getProgreso();
    
    progreso.puntos_totales += puntos;
    progreso.tareas_completadas += 1;
    progreso.racha_actual += 1;
    progreso.mejor_racha = Math.max(progreso.mejor_racha, progreso.racha_actual);
    
    await progreso.save();

    // Verificar recompensas
    await verificarRecompensas(progreso.puntos_totales);
}

async function verificarRecompensas(puntosTotales) {
    await Recompensa.updateMany(
        { 
            puntos_requeridos: { $lte: puntosTotales },
            desbloqueada: false 
        },
        { 
            desbloqueada: true,
            fecha_desbloqueo: new Date()
        }
    );
}

function generarMensajeMotivacional() {
    const mensajes = [
        "¡Eres increíble amorcito! Sigue así 💪",
        "Cada tarea completada te acerca a tus metas 🎯",
        "Tu dedicación me inspira todos los días ❤️",
        "¡Lo estás haciendo fenomenal, mi amor! 🌟",
        "Mente brillante en acción 🧠",
        "Estoy muy orgulloso de ti 🥰",
        "Tu esfuerzo hoy es tu éxito mañana 🚀"
    ];
    return mensajes[Math.floor(Math.random() * mensajes.length)];
}

module.exports = router;