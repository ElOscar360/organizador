// database/db.js
const { MongoClient } = require('mongodb');

let db = null;

async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db('organizador_universitario');
    console.log('✅ Conectado a MongoDB');
    
    // Crear índices
    await db.collection('tareas').createIndex({ materia_id: 1 });
    await db.collection('horarios').createIndex({ materia_id: 1 });
    await db.collection('recompensas_canjeadas').createIndex({ fecha: -1 });
    
    return db;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}

function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

async function inicializarDatos() {
    try {
        const Recompensa = require('./models/Recompensa');

        console.log('🔄 Actualizando estructura de recompensas...');

        // ACTUALIZAR: Remover el campo 'desbloqueada' de todas las recompensas existentes
        await Recompensa.updateMany(
            {}, 
            { $unset: { desbloqueada: "" } }
        );
        console.log('✅ Campo "desbloqueada" removido de recompensas existentes');

        // ELIMINAR todas las recompensas existentes
        await Recompensa.deleteMany({});
        console.log('🗑️ Recompensas antiguas eliminadas');

        // INSERTAR nuevas recompensas SIN el campo desbloqueada
        console.log('🎁 Insertando recompensas nuevas...');
        await Recompensa.insertMany([
            { 
                nombre: '📱 15 minutos de redes sociales', 
                puntos_requeridos: 50,
                categoria: 'digital',
                descripcion: 'Tómate un descanso de 15 minutos en redes',
                imagen: '📱',
                color: '#3B82F6',
                canjeable_multiple: true
            },
            { 
                nombre: '🍫 Chocolate favorito', 
                puntos_requeridos: 100,
                categoria: 'comida',
                descripcion: 'Un delicioso chocolate como recompensa',
                imagen: '🍫',
                color: '#8B5CF6',
                canjeable_multiple: true
            },
            { 
                nombre: '🎬 Noche de película', 
                puntos_requeridos: 200,
                categoria: 'experiencia',
                descripcion: 'Elige la película para nuestra noche de cine',
                imagen: '🎬',
                color: '#EC4899',
                canjeable_multiple: true
            },
            { 
                nombre: '☕ Café sorpresa', 
                puntos_requeridos: 150,
                categoria: 'comida',
                descripcion: 'Te llevaré por un café a tu lugar favorito',
                imagen: '☕',
                color: '#F59E0B',
                canjeable_multiple: true
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
        console.log('✅ Recompensas nuevas insertadas exitosamente');
    } catch (error) {
        console.error('❌ Error actualizando recompensas:', error);
    }
}


module.exports = { connectDB, mongoose };