// routes/horarios.js - VERSIÓN MONGODB NATIVE CORREGIDA
const express = require('express');
const router = express.Router();
const { getDB } = require('../database/db');
const { ObjectId } = require('mongodb');

// GET - Obtener horario completo
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const horarios = await db.collection('horarios')
            .find({})
            .sort({ 
                dia: 1,
                hora_inicio: 1 
            })
            .toArray();

        // Populate materia information manualmente
        const horariosConMateria = await Promise.all(horarios.map(async (horario) => {
            if (horario.materia_id) {
                const materia = await db.collection('materias').findOne({ 
                    _id: new ObjectId(horario.materia_id) 
                });
                if (materia) {
                    horario.materia_nombre = materia.nombre;
                    horario.materia_color = materia.color;
                }
            }
            return horario;
        }));

        res.json({
            success: true,
            horarios: horariosConMateria
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST - Agregar clase al horario
router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const { materia_id, dia, hora_inicio, hora_fin, aula, profesor } = req.body;

        const horarioData = {
            materia_id: materia_id ? new ObjectId(materia_id) : null,
            dia,
            hora_inicio,
            hora_fin,
            aula: aula || '',
            profesor: profesor || '',
            fecha_creacion: new Date()
        };

        const result = await db.collection('horarios').insertOne(horarioData);

        res.json({
            success: true,
            id: result.insertedId,
            message: 'Clase agregada al horario 🕐'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE - Eliminar horario
router.delete('/:id', async (req, res) => {
    try {
        const db = getDB();
        
        const result = await db.collection('horarios').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Clase no encontrada' });
        }
        
        res.json({
            success: true,
            message: 'Clase eliminada del horario 🗑️'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;