// database/db.js - VERSIÓN MONGODB
require('dotenv').config();

const mongoose = require('mongoose');

console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Definida' : '❌ No definida');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI no está definida en las variables de entorno');
    process.exit(1);
}

const connectDB = async () => {
    try {
        console.log('🔗 Intentando conectar a MongoDB Atlas...');
        
        // Agrega opciones de conexión para evitar problemas DNS
        const options = {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4 // Fuerza IPv4
        };

        await mongoose.connect(MONGODB_URI, options);
        console.log('✅ Conectado a MongoDB Atlas');
        await inicializarDatos();
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        console.log('💡 Intenta conectar a otra red (hotspot del celular)');
        process.exit(1);
    }
};



// Inicializar datos si no existen
async function inicializarDatos() {
    try {
        const Materia = require('./models/Materia');
        const Recompensa = require('./models/Recompensa');
        const Progreso = require('./models/Progreso');

        // Verificar si ya hay datos
        const materiasCount = await Materia.countDocuments();
        const progresoCount = await Progreso.countDocuments();

        if (materiasCount === 0) {
            console.log('📝 Insertando datos iniciales...');
            
            // Insertar materias de ejemplo
            const materias = await Materia.insertMany([
                { nombre: 'Matemáticas', color: '#EC4899' },
                { nombre: 'Literatura', color: '#8B5CF6' },
                { nombre: 'Ciencias', color: '#10B981' },
                { nombre: 'Historia', color: '#F59E0B' },
                { nombre: 'Inglés', color: '#3B82F6' }
            ]);

            // Insertar recompensas
            await Recompensa.insertMany([
                { nombre: '📱 15 minutos de redes sociales', puntos_requeridos: 50 },
                { nombre: '🍫 Chocolate favorito', puntos_requeridos: 100 },
                { nombre: '🎬 Noche de película', puntos_requeridos: 200 },
                { nombre: '☕ Café en tu lugar favorito', puntos_requeridos: 150 },
                { nombre: '📚 Libro que querías', puntos_requeridos: 300 }
            ]);

            // Insertar progreso inicial
            await Progreso.create({
                puntos_totales: 0,
                tareas_completadas: 0,
                tiempo_estudio_total: 0,
                racha_actual: 0,
                mejor_racha: 0
            });

            console.log('🎉 Datos iniciales insertados correctamente');
        }
    } catch (error) {
        console.error('❌ Error inicializando datos:', error);
    }
}

module.exports = { connectDB, mongoose };