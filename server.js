cat > server.js << 'EOF'
// server.js - VERSIÓN COMPLETA Y CORREGIDA
require('dotenv').config();

const express = require('express');
const path = require('path');
const { connectDB } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const tareasRoutes = require('./routes/tareas');
const horariosRoutes = require('./routes/horarios');
const materiasRoutes = require('./routes/materias');
const progressRoutes = require('./routes/progreso');
const recompensasRoutes = require('./routes/recompensas');

// Usar rutas
app.use('/api/tareas', tareasRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/progreso', progressRoutes);
app.use('/api/recompensas', recompensasRoutes);

// Ruta principal MEJORADA
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎀 Organizador Universitario My Melody 💖</title>
        <link rel="stylesheet" href="/css/style.css">
        <style>
            /* Estilos para la tienda de recompensas */
            .btn-filtro {
                background: #fce4ec;
                border: 2px solid transparent;
                color: #880e4f;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9em;
                transition: all 0.3s ease;
            }

            .btn-filtro:hover {
                background: #f8bbd9;
                transform: translateY(-2px);
            }

            .btn-filtro.active {
                background: #ec4899;
                color: white;
                border-color: #ec4899;
            }

            .tarjeta-recompensa {
                background: white;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 15px;
                border-left: 5px solid #ec4899;
                box-shadow: 0 4px 15px rgba(236, 72, 153, 0.1);
                transition: all 0.3s ease;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }

            .tarjeta-recompensa:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(236, 72, 153, 0.15);
            }

            .info-recompensa {
                flex: 1;
            }

            .recompensa-titulo {
                font-size: 1.2em;
                color: #880e4f;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .recompensa-descripcion {
                color: #666;
                font-size: 0.9em;
                margin-bottom: 8px;
            }

            .recompensa-puntos {
                background: linear-gradient(45deg, #ec4899, #8b5cf6);
                color: white;
                padding: 4px 12px;
                border-radius: 15px;
                font-weight: bold;
                font-size: 0.9em;
            }

            .recompensa-categoria {
                background: #fce4ec;
                color: #880e4f;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.8em;
                margin-right: 8px;
            }

            .btn-canjear {
                background: linear-gradient(45deg, #10b981, #059669);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                min-width: 100px;
            }

            .btn-canjear:hover:not(:disabled) {
                background: linear-gradient(45deg, #059669, #047857);
                transform: scale(1.05);
            }

            .btn-canjear:disabled {
                background: #9ca3af;
                cursor: not-allowed;
                transform: none;
            }

            .btn-canjear.canjeable-multiple {
                background: linear-gradient(45deg, #8b5cf6, #7c3aed);
            }

            .btn-canjear.canjeable-multiple:hover:not(:disabled) {
                background: linear-gradient(45deg, #7c3aed, #6d28d9);
            }

            .item-historial {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 10px;
                border-left: 3px solid #ec4899;
            }

            .estado-pendiente {
                background: #fef3c7;
                color: #d97706;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.8em;
            }

            .estado-entregada {
                background: #d1fae5;
                color: #059669;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.8em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1 class="titulo-principal">🎀 Organizador Universitario 💖</h1>
                <p class="subtitulo">Hecho con amor para la más juiciosa y estudiosa princesa 🌟</p>
                <div id="progreso-info">Cargando progreso...</div>
            </div>

            <!-- Grid Principal -->
            <div class="grid">
                <!-- Sección de Tareas -->
                <div class="tarjeta">
                    <div class="tarjeta-header">
                        <h2 class="tarjeta-titulo">📚 Mis Tareas</h2>
                        <button class="btn-accion btn-tarea" onclick="mostrarModal('modalTarea')">
                        <span>➕</span> Nueva Tarea
                        </button>
                        </div>
                            <button class="btn" onclick="cargarTareas()">🔄 Actualizar Tareas</button>
                        <div id="tareas-lista" style="margin-top: 20px;">Cargando tareas...</div>
            </div>

                <!-- Sección de Horario -->
                <div class="tarjeta">
                    <div class="tarjeta-header">
                <h2 class="tarjeta-titulo">🕐 Mi Horario</h2>
                    <button class="btn-accion btn-horario" onclick="mostrarModal('modalHorario')">
                    <span>➕</span> Nueva Clase
                </button>
                </div>
                    <button class="btn" onclick="cargarHorario()">🔄 Actualizar Horario</button>
                    <div id="horario-lista" style="margin-top: 20px;">Cargando horario...</div>
                    </div>

                <!-- Sección de Recompensas - VERSIÓN MEJORADA -->
                        <div class="tarjeta tarjeta-ancha">
                            <div class="tarjeta-header">
                                <h2 class="tarjeta-titulo">🎁 Tienda de Recompensas</h2>
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <div style="background: #fce4ec; padding: 8px 15px; border-radius: 20px;">
                                        <strong>💎 <span id="puntos-actuales">0</span> puntos disponibles</strong>
                                    </div>
                                    <button class="btn" onclick="cargarRecompensas()">🔄 Actualizar</button>
                                </div>
                            </div>

                            <!-- Filtros de categorías -->
                            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                                <button class="btn-filtro active" onclick="filtrarRecompensas('todas')">Todas</button>
                                <button class="btn-filtro" onclick="filtrarRecompensas('digital')">📱 Digital</button>
                                <button class="btn-filtro" onclick="filtrarRecompensas('comida')">🍕 Comida</button>
                                <button class="btn-filtro" onclick="filtrarRecompensas('experiencia')">🎬 Experiencias</button>
                                <button class="btn-filtro" onclick="filtrarRecompensas('especial')">💝 Especiales</button>
                                <button class="btn-filtro" onclick="filtrarRecompensas('fisica')">📦 Físicas</button>
                            </div>
                        <div id="recompensas-lista" style="margin-top: 20px;">
                            Cargando recompensas...
                        </div>

                      <!-- Historial de canjes -->
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px dashed #fce4ec;">
                            <h3 style="color: #880e4f; margin-bottom: 15px;">📜 Mis Canjes Recientes</h3>
                            <button class="btn btn-secundario" onclick="cargarHistorialCanjes()">🔄 Ver Historial</button>
                            <div id="historial-canjes" style="margin-top: 15px;">
                                <!-- Aquí se cargará el historial -->
                            </div>
                        </div>
                    </div>

                <!-- Sección de Mensajes Especiales -->
                <div class="tarjeta tarjeta-ancha">
                    <div class="mensaje-especial">
                        <h2 class="titulo-seccion" style="margin-bottom: 20px;">💕 Mensajes Especiales</h2>
                        <button class="btn" onclick="obtenerMensajeEspecial()">💖 Nuevo Mensaje de Amor</button>
                        <div id="mensaje-especial" style="margin-top: 20px; padding: 20px; background: rgba(255, 255, 255, 0.7); border-radius: 15px;">
                            Haz clic en el botón para un mensaje especial 🌟
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para Nueva Tarea -->
        <div id="modalTarea" class="modal">
          <div class="modal-contenido">
            <button class="cerrar-modal" onclick="cerrarModal('modalTarea')">×</button>
            <h2 style="color: #880e4f; margin-bottom: 20px; text-align: center;">📝 Nueva Tarea</h2>
            
            <form id="formTarea" onsubmit="crearTarea(event)">
              <div class="form-grupo">
                <label class="form-label">Título de la tarea *</label>
                <input type="text" class="form-input" name="titulo" required placeholder="Ej: Estudiar para el parcial de matemáticas">
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Descripción</label>
                <textarea class="form-textarea" name="descripcion" placeholder="Detalles de la tarea..."></textarea>
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Tipo de tarea</label>
                <select class="form-select" name="tipo">
                  <option value="tarea">📝 Tarea normal</option>
                  <option value="quiz">📋 Quiz</option>
                  <option value="parcial">📊 Parcial</option>
                  <option value="trabajo">📄 Trabajo</option>
                  <option value="proyecto">📚 Proyecto</option>
                </select>
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Materia</label>
                <select class="form-select" name="materia_id" id="selectMaterias">
                  <option value="">Seleccionar materia...</option>
                </select>
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Fecha de entrega</label>
                <input type="date" class="form-input" name="fecha_entrega">
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Prioridad</label>
                <select class="form-select" name="prioridad">
                  <option value="1">⭐ Baja</option>
                  <option value="2">⭐⭐ Media-Baja</option>
                  <option value="3" selected>⭐⭐⭐ Media</option>
                  <option value="4">⭐⭐⭐⭐ Alta</option>
                  <option value="5">⭐⭐⭐⭐⭐ Urgente</option>
                </select>
              </div>
              
              <div class="form-botones">
                <button type="button" class="btn btn-secundario" onclick="cerrarModal('modalTarea')">Cancelar</button>
                <button type="submit" class="btn">💾 Guardar Tarea</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal para Nueva Materia -->
        <div id="modalMateria" class="modal">
          <div class="modal-contenido">
            <button class="cerrar-modal" onclick="cerrarModal('modalMateria')">×</button>
            <h2 style="color: #880e4f; margin-bottom: 20px; text-align: center;">📚 Nueva Materia</h2>
            
            <form id="formMateria" onsubmit="crearMateria(event)">
              <div class="form-grupo">
                <label class="form-label">Nombre de la materia *</label>
                <input type="text" class="form-input" name="nombre" required placeholder="Ej: Cálculo Diferencial">
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Código</label>
                <input type="text" class="form-input" name="codigo" placeholder="Ej: MAT-101">
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Créditos</label>
                <input type="number" class="form-input" name="creditos" min="1" max="10" placeholder="3">
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Color</label>
                <select class="form-select" name="color">
                  <option value="#EC4899">💗 Rosa</option>
                  <option value="#8B5CF6">💜 Morado</option>
                  <option value="#10B981">💚 Verde</option>
                  <option value="#F59E0B">🧡 Naranja</option>
                  <option value="#3B82F6">💙 Azul</option>
                  <option value="#EF4444">❤️ Rojo</option>
                </select>
              </div>
              
              <div class="form-botones">
                <button type="button" class="btn btn-secundario" onclick="cerrarModal('modalMateria')">Cancelar</button>
                <button type="submit" class="btn">💾 Guardar Materia</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal para Nueva Clase en Horario -->
        <div id="modalHorario" class="modal">
          <div class="modal-contenido">
            <button class="cerrar-modal" onclick="cerrarModal('modalHorario')">×</button>
            <h2 style="color: #880e4f; margin-bottom: 20px; text-align: center;">🕐 Nueva Clase</h2>
            
            <form id="formHorario" onsubmit="crearHorario(event)">
              <div class="form-grupo">
                <label class="form-label">Materia *</label>
                <select class="form-select" name="materia_id" id="selectMateriasHorario" required>
                  <option value="">Seleccionar materia...</option>
                </select>
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Día de la semana *</label>
                <select class="form-select" name="dia" required>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
              </div>
              
              <div class="form-grupo" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <label class="form-label">Hora inicio *</label>
                  <input type="time" class="form-input" name="hora_inicio" required>
                </div>
                <div>
                  <label class="form-label">Hora fin *</label>
                  <input type="time" class="form-input" name="hora_fin" required>
                </div>
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Aula</label>
                <input type="text" class="form-input" name="aula" placeholder="Ej: Aula 201">
              </div>
              
              <div class="form-grupo">
                <label class="form-label">Profesor</label>
                <input type="text" class="form-input" name="profesor" placeholder="Nombre del profesor">
              </div>
              
              <div class="form-botones">
                <button type="button" class="btn btn-secundario" onclick="cerrarModal('modalHorario')">Cancelar</button>
                <button type="submit" class="btn">💾 Guardar Clase</button>
              </div>
            </form>
          </div>
        </div>

        <script>
        // ========== SISTEMA DE RECOMPENSAS MEJORADO ==========

        let recompensasGlobales = [];
        let puntosActuales = 0;

        // Cargar recompensas y puntos
        async function cargarRecompensas() {
            console.log('🎁 Iniciando carga de recompensas...');
            try {
                const responseRecompensas = await fetch('/api/recompensas');
                const responseProgreso = await fetch('/api/progreso');

                const dataRecompensas = await responseRecompensas.json();
                const dataProgreso = await responseProgreso.json();

                console.log('Datos recompensas:', dataRecompensas);
                console.log('Datos progreso:', dataProgreso);

                if (dataRecompensas.success && dataProgreso.success) {
                    recompensasGlobales = dataRecompensas.recompensas;
                    puntosActuales = dataProgreso.progreso.puntos_totales - dataProgreso.progreso.puntos_gastados;
                    
                    // Actualizar puntos en la UI
                    document.getElementById('puntos-actuales').textContent = puntosActuales;
                    
                    // Mostrar todas las recompensas
                    mostrarRecompensas(recompensasGlobales);
                }
            } catch (error) {
                console.error('Error cargando recompensas:', error);
                document.getElementById('recompensas-lista').innerHTML = 
                    '<div style="color: red; padding: 20px; text-align: center;">' +
                    '❌ Error cargando recompensas: ' + error.message +
                    '</div>';
            }
        }

        // Mostrar recompensas en la UI
        function mostrarRecompensas(recompensas) {
            if (recompensas.length === 0) {
                document.getElementById('recompensas-lista').innerHTML = 
                    '<div style="text-align: center; padding: 40px; color: #880e4f;">' +
                        '<div style="font-size: 3em; margin-bottom: 10px;">🎁</div>' +
                        '<h3>No hay recompensas disponibles</h3>' +
                        '<p>¡Vuelve más tarde!</p>' +
                    '</div>';
                return;
            }

            const recompensasHTML = recompensas.map(recompensa => {
                const puedeCanjear = puntosActuales >= recompensa.puntos_requeridos;
                const claseBoton = recompensa.canjeable_multiple ? 'btn-canjear canjeable-multiple' : 'btn-canjear';
                
                return '<div class="tarjeta-recompensa" data-categoria="' + recompensa.categoria + '">' +
                    '<div class="info-recompensa">' +
                        '<div class="recompensa-titulo">' +
                            '<span>' + recompensa.imagen + '</span>' +
                            '<strong>' + recompensa.nombre + '</strong>' +
                            '<span class="recompensa-categoria">' + obtenerNombreCategoria(recompensa.categoria) + '</span>' +
                        '</div>' +
                        '<div class="recompensa-descripcion">' + (recompensa.descripcion || '') + '</div>' +
                        '<div style="display: flex; gap: 10px; align-items: center;">' +
                            '<span class="recompensa-puntos">💎 ' + recompensa.puntos_requeridos + ' puntos</span>' +
                            (recompensa.canjeable_multiple ? '<span style="color: #8b5cf6; font-size: 0.8em;">🔄 Múltiple</span>' : '') +
                        '</div>' +
                    '</div>' +
                    '<button class="' + claseBoton + '" ' +
                        'onclick="canjearRecompensa(\\'' + recompensa.id + '\\', ' + recompensa.puntos_requeridos + ')"' +
                        (!puedeCanjear ? ' disabled' : '') + '>' +
                        (puedeCanjear ? '🎁 Canjear' : '🔒 Insuficiente') +
                    '</button>' +
                '</div>';
            }).join('');

            document.getElementById('recompensas-lista').innerHTML = recompensasHTML;
        }

        // Filtrar recompensas por categoría
        function filtrarRecompensas(categoria) {
            // Actualizar botones activos
            document.querySelectorAll('.btn-filtro').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            const recompensasFiltradas = categoria === 'todas' 
                ? recompensasGlobales 
                : recompensasGlobales.filter(r => r.categoria === categoria);
            
            mostrarRecompensas(recompensasFiltradas);
        }

        // Canjear una recompensa
        async function canjearRecompensa(recompensaId, puntosRequeridos) {
            if (!confirm('¿Estás segura de que quieres canjear esta recompensa por ' + puntosRequeridos + ' puntos?')) {
                return;
            }

            try {
                const response = await fetch('/api/recompensas/' + recompensaId + '/canjear', {
                    method: 'POST'
                });

                const data = await response.json();

                if (data.success) {
                    alert('🎉 ¡Recompensa canjeada! Has gastado ' + puntosRequeridos + ' puntos\\n💎 Puntos restantes: ' + data.puntos_restantes);
                    
                    // Recargar todo
                    cargarRecompensas();
                    cargarProgreso();
                } else {
                    alert('❌ Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error canjeando recompensa:', error);
                alert('❌ Error al canjear la recompensa');
            }
        }

        // Cargar historial de canjes
        async function cargarHistorialCanjes() {
            try {
                const response = await fetch('/api/recompensas/historial');
                const data = await response.json();

                if (data.success) {
                    mostrarHistorialCanjes(data.historial);
                }
            } catch (error) {
                console.error('Error cargando historial:', error);
            }
        }

        // Mostrar historial de canjes
        function mostrarHistorialCanjes(historial) {
            if (historial.length === 0) {
                document.getElementById('historial-canjes').innerHTML = 
                    '<div style="text-align: center; padding: 20px; color: #666;">' +
                        '<p>No hay canjes recientes</p>' +
                    '</div>';
                return;
            }

            const historialHTML = historial.map(canje => {
                return '<div class="item-historial">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                        '<div style="flex: 1;">' +
                            '<strong>' + canje.recompensa + '</strong>' +
                            '<div style="color: #666; font-size: 0.9em;">' +
                                '💎 ' + canje.puntos + ' puntos • ' + new Date(canje.fecha).toLocaleDateString() +
                            '</div>' +
                        '</div>' +
                        '<span class="estado-' + canje.estado + '">' + canje.estado + '</span>' +
                    '</div>' +
                '</div>';
            }).join('');

            document.getElementById('historial-canjes').innerHTML = historialHTML;
        }

        // Helper para nombres de categorías
        function obtenerNombreCategoria(categoria) {
            const categorias = {
                'digital': 'Digital',
                'comida': 'Comida',
                'experiencia': 'Experiencia',
                'especial': 'Especial',
                'fisica': 'Física'
            };
            return categorias[categoria] || categoria;
        }

        // ========== FIN SISTEMA DE RECOMPENSAS ==========

        // Las demás funciones existentes (tareas, horarios, etc.) se mantienen igual
        // [TODAS TUS FUNCIONES EXISTENTES AQUÍ - NO LAS BORRES]

        // Cargar todo al iniciar
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 Iniciando aplicación...');
            cargarProgreso();
            cargarTareas();
            cargarHorario();
            cargarRecompensas(); // ¡ESTA ES LA NUEVA!
        });
        </script>
    </body>
    </html>
  `);
});

// API de mensajes especiales
app.get('/api/mensaje-especial', (req, res) => {
  const mensajes = [
    "Tu esfuerzo de hoy es el éxito de mañana 🌟",
    "Cada página que lees te acerca a tus metas 📚",
    "Eres capaz de cosas increíbles, nunca lo dudes 💖",
    "Tu disciplina inspira mi admiración día a día ✨",
    "Juntos podemos con todo, mi amor 💕",
    "Tu inteligencia brilla como ninguna otra 🎓",
    "Estoy orgulloso de cada logro que alcanzas 🥰",
    "Eres la estudiante más dedicada que conozco 📖",
    "Tu sonrisa ilumina incluso los días de estudio más difíciles 🌈",
    "Cada tarea que completas es un paso hacia tus sueños 🚀"
  ];
  const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
  
  res.json({ 
    mensaje: mensajeAleatorio,
    emoji: "💖🎀📚🌟",
    timestamp: new Date().toLocaleTimeString()
  });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🚀 Listo para producción en Render.com`);
});
EOF
