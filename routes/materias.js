// routes/materias.js - VERSIÓN MONGODB NATIVE CORREGIDA
const express = require('express');
const router = express.Router();
const { getDB } = require('../database/db');
const { ObjectId } = require('mongodb');

// GET - Obtener todas las materias
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const materias = await db.collection('materias')
            .find({})
            .sort({ nombre: 1 })
            .toArray();

        res.json({
            success: true,
            materias: materias.map(m => ({
                _id: m._id,
                nombre: m.nombre,
                codigo: m.codigo,
                creditos: m.creditos,
                color: m.color
            }))
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST - Crear nueva materia
router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const { nombre, codigo, creditos, color } = req.body;

        const materiaData = {
            nombre,
            codigo: codigo || '',
            creditos: creditos || 3,
            color: color || '#EC4899',
            fecha_creacion: new Date()
        };

        const result = await db.collection('materias').insertOne(materiaData);

        res.json({
            success: true,
            id: result.insertedId,
            message: 'Materia creada exitosamente 📚'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;