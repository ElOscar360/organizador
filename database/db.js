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
        const recompensasCount = await Recompensa.countDocuments();
        const progresoCount = await Progreso.countDocuments();

        if (recompensasCount === 0) {
            console.log('🎁 Insertando recompensas estilo Twitch...');
            
            // Insertar recompensas MEJORADAS
            await Recompensa.insertMany([
                { 
                    nombre: '📱 15 minutos de redes sociales', 
                    puntos_requeridos: 50,
                    categoria: 'digital',
                    descripcion: 'Tómate un descanso de 15 minutos en redes',
                    imagen: '📱',
                    color: '#3B82F6'
                },
                { 
                    nombre: '🍫 Chocolate favorito', 
                    puntos_requeridos: 100,
                    categoria: 'comida',
                    descripcion: 'Un delicioso chocolate como recompensa',
                    imagen: '🍫',
                    color: '#8B5CF6'
                },
                { 
                    nombre: '🎬 Noche de película', 
                    puntos_requeridos: 200,
                    categoria: 'experiencia',
                    descripcion: 'Elige la película para nuestra noche de cine',
                    imagen: '🎬',
                    color: '#EC4899'
                },
                { 
                    nombre: '☕ Café sorpresa', 
                    puntos_requeridos: 150,
                    categoria: 'comida',
                    descripcion: 'Te llevaré por un café a tu lugar favorito',
                    imagen: '☕',
                    color: '#F59E0B'
                },
                { 
                    nombre: '💝 Abrazo especial', 
                    puntos_requeridos: 30,
                    categoria: 'especial',
                    descripcion: 'Un abrazo bien merecido',
                    imagen: '💝',
                    color: '#EF4444',
                    canjeable_multiple: true
                },
                { 
                    nombre: '📚 Libro que querías', 
                    puntos_requeridos: 300,
                    categoria: 'fisica',
                    descripcion: 'El libro que tienes en tu lista de deseos',
                    imagen: '📚',
                    color: '#10B981'
                },
                { 
                    nombre: '🎵 Playlist personalizada', 
                    puntos_requeridos: 80,
                    categoria: 'digital',
                    descripcion: 'Una playlist hecha especialmente para ti',
                    imagen: '🎵',
                    color: '#8B5CF6'
                },
                { 
                    nombre: '🍦 Helado de postre', 
                    puntos_requeridos: 120,
                    categoria: 'comida',
                    descripcion: 'Un helado del sabor que tú elijas',
                    imagen: '🍦',
                    color: '#F59E0B'
                }
            ]);

            console.log('🎉 Recompensas estilo Twitch insertadas correctamente');
        }
    } catch (error) {
        console.error('❌ Error inicializando datos:', error);
    }
}

module.exports = { connectDB, mongoose };