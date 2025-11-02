// routes/recompensas.js
const express = require('express');
const router = express.Router();
const Recompensa = require('../database/models/Recompensa');

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

module.exports = router;