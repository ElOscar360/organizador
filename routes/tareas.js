// routes/tareas.js - VERSIÓN MONGODB NATIVE CORREGIDA
const express = require('express');
const router = express.Router();
const { getDB } = require('../database/db');
const { ObjectId } = require('mongodb');

// GET - Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const tareas = await db.collection('tareas').find({})
            .sort({ 
                completada: 1,
                prioridad: -1,
                fecha_entrega: 1 
            })
            .toArray();

        // Populate materia information
        const tareasConMateria = await Promise.all(tareas.map(async (tarea) => {
            if (tarea.materia_id) {
                const materia = await db.collection('materias').findOne({ 
                    _id: new ObjectId(tarea.materia_id) 
                });
                if (materia) {
                    tarea.materia_nombre = materia.nombre;
                    tarea.materia_color = materia.color;
                }
            }
            return tarea;
        }));

        res.json({
            success: true,
            tareas: tareasConMateria,
            total: tareas.length,
            pendientes: tareas.filter(t => !t.completada).length
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST - Crear nueva tarea
router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const { titulo, descripcion, tipo, materia_id, fecha_entrega, prioridad } = req.body;

        const tareaData = {
            titulo,
            descripcion: descripcion || '',
            tipo: tipo || 'tarea',
            materia_id: materia_id || null,
            fecha_entrega: fecha_entrega || null,
            prioridad: prioridad || 3,
            completada: false,
            puntos: 10,
            fecha_creacion: new Date(),
            fecha_completada: null
        };

        const result = await db.collection('tareas').insertOne(tareaData);

        res.json({
            success: true,
            id: result.insertedId,
            message: 'Tarea creada exitosamente 📝',
            puntos_ganados: 10
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST - Marcar tarea como completada
router.post('/:id/completar', async (req, res) => {
    try {
        const db = getDB();
        const tareaId = req.params.id;

        const tarea = await db.collection('tareas').findOne({ 
            _id: new ObjectId(tareaId) 
        });
        
        if (!tarea) {
            return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
        }

        if (tarea.completada) {
            return res.status(400).json({ success: false, error: 'La tarea ya estaba completada' });
        }

        // Actualizar tarea
        await db.collection('tareas').updateOne(
            { _id: new ObjectId(tareaId) },
            { 
                $set: { 
                    completada: true,
                    fecha_completada: new Date()
                } 
            }
        );

        // Actualizar progreso
        await actualizarProgreso(tarea.puntos || 10);

        res.json({
            success: true,
            message: '¡Tarea completada! ✅',
            puntos_ganados: tarea.puntos || 10,
            mensaje_especial: generarMensajeMotivacional()
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE - Eliminar tarea
router.delete('/:id', async (req, res) => {
    try {
        const db = getDB();
        
        const result = await db.collection('tareas').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
        }
        
        res.json({
            success: true,
            message: 'Tarea eliminada correctamente 🗑️'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Funciones auxiliares
async function actualizarProgreso(puntos) {
    const db = getDB();
    
    // En MongoDB Native, no necesitamos un modelo de Progreso
    // Podemos calcular el progreso en tiempo real o crear una colección separada
    
    // Por ahora, solo actualizamos las recompensas si es necesario
    await verificarRecompensas();
}

async function verificarRecompensas() {
    const db = getDB();
    
    // Calcular puntos totales
    const tareas = await db.collection('tareas').find({ completada: true }).toArray();
    const puntosTotales = tareas.reduce((total, tarea) => total + (tarea.puntos || 10), 0);
    
    // Actualizar recompensas desbloqueadas
    await db.collection('recompensas').updateMany(
        { 
            puntos_requeridos: { $lte: puntosTotales }
        },
        { 
            $set: { 
                desbloqueada: true,
                fecha_desbloqueo: new Date()
            } 
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