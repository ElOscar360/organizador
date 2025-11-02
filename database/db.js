// database/db.js - VERSIÓN MONGODB NATIVE CORREGIDA
require('dotenv').config();

const { MongoClient } = require('mongodb');

console.log('🔍 Verificando MONGODB_URI...');
console.log('URI definida:', process.env.MONGODB_URI ? '✅ SÍ' : '❌ NO');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/organizador-universitario';

let db = null;
let client = null;

const connectDB = async () => {
    try {
        console.log('🔗 Intentando conectar a MongoDB...');
        console.log('URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
        
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        db = client.db();
        console.log('✅ Conectado a MongoDB Atlas');
        
        // Verificar conexión
        console.log('📊 Base de datos conectada:', db.databaseName);
        
        await inicializarDatos();
        return db;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        console.error('🔍 Detalles del error:', error);
        process.exit(1);
    }
};

async function inicializarDatos() {
    try {
        console.log('🔄 Actualizando estructura de recompensas...');

        // ACTUALIZAR: Remover el campo 'desbloqueada' de todas las recompensas existentes
        await db.collection('recompensas').updateMany(
            {}, 
            { $unset: { desbloqueada: "" } }
        );
        console.log('✅ Campo "desbloqueada" removido de recompensas existentes');

        // ELIMINAR todas las recompensas existentes
        await db.collection('recompensas').deleteMany({});
        console.log('🗑️ Recompensas antiguas eliminadas');

        // INSERTAR nuevas recompensas SIN el campo desbloqueada
        console.log('🎁 Insertando recompensas nuevas...');
        await db.collection('recompensas').insertMany([
            { 
                nombre: '📱 15 minutos de redes sociales', 
                puntos_requeridos: 50,
                categoria: 'digital',
                descripcion: 'Tómate un descanso de 15 minutos en redes',
                imagen: '📱',
                color: '#3B82F6',
                canjeable_multiple: true,
                fecha_creacion: new Date()
            },
            { 
                nombre: '🍫 Chocolate favorito', 
                puntos_requeridos: 100,
                categoria: 'comida',
                descripcion: 'Un delicioso chocolate como recompensa',
                imagen: '🍫',
                color: '#8B5CF6',
                canjeable_multiple: true,
                fecha_creacion: new Date()
            },
            { 
                nombre: '🎬 Noche de película', 
                puntos_requeridos: 200,
                categoria: 'experiencia',
                descripcion: 'Elige la película para nuestra noche de cine',
                imagen: '🎬',
                color: '#EC4899',
                canjeable_multiple: true,
                fecha_creacion: new Date()
            },
            { 
                nombre: '☕ Café sorpresa', 
                puntos_requeridos: 150,
                categoria: 'comida',
                descripcion: 'Te llevaré por un café a tu lugar favorito',
                imagen: '☕',
                color: '#F59E0B',
                canjeable_multiple: true,
                fecha_creacion: new Date()
            },
            { 
                nombre: '💝 Abrazo especial', 
                puntos_requeridos: 30,
                categoria: 'especial',
                descripcion: 'Un abrazo bien merecido',
                imagen: '💝',
                color: '#EF4444',
                canjeable_multiple: true,
                fecha_creacion: new Date()
            },
            { 
                nombre: '📚 Libro que querías', 
                puntos_requeridos: 300,
                categoria: 'fisica',
                descripcion: 'El libro que tienes en tu lista de deseos',
                imagen: '📚',
                color: '#10B981',
                fecha_creacion: new Date()
            },
            { 
                nombre: '🎵 Playlist personalizada', 
                puntos_requeridos: 80,
                categoria: 'digital',
                descripcion: 'Una playlist hecha especialmente para ti',
                imagen: '🎵',
                color: '#8B5CF6',
                fecha_creacion: new Date()
            },
            { 
                nombre: '🍦 Helado de postre', 
                puntos_requeridos: 120,
                categoria: 'comida',
                descripcion: 'Un helado del sabor que tú elijas',
                imagen: '🍦',
                color: '#F59E0B',
                fecha_creacion: new Date()
            }
        ]);
        console.log('✅ Recompensas nuevas insertadas exitosamente');
    } catch (error) {
        console.error('❌ Error actualizando recompensas:', error);
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
}

async function closeDB() {
    if (client) {
        await client.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
}

module.exports = { connectDB, getDB, closeDB };