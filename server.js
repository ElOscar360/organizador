// server.js - VERSIÓN COMPLETA CORREGIDA
require('dotenv').config();

const express = require('express');
const path = require('path');
const { connectDB, getDB } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 10000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const tareasRoutes = require('./routes/tareas');
const horariosRoutes = require('./routes/horarios');
const materiasRoutes = require('./routes/materias');
const recompensasRoutes = require('./routes/recompensas');

// Usar rutas
app.use('/api/tareas', tareasRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/materias', materiasRoutes);
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
                <select class="form-select" name="materi.id" id="selectMaterias">
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
                <select class="form-select" name="materi.id" id="selectMateriasHorario" required>
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
        // ========== NUEVAS FUNCIONES PARA FORMULARIOS ==========
        
        // Funciones para los modales
        function mostrarModal(idModal) {
          document.getElementById(idModal).style.display = 'block';
          // Cargar materias en los selects
          if (idModal === 'modalTarea' || idModal === 'modalHorario') {
            cargarMateriasParaSelect();
          }
        }

        function cerrarModal(idModal) {
          document.getElementById(idModal).style.display = 'none';
        }

        // Cerrar modal al hacer clic fuera del contenido
        window.onclick = function(event) {
          if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
          }
        }

        // Cargar materias para los selects - VERSIÓN CORRECTA PARA MONGODB
        async function cargarMateriasParaSelect() {
          try {
            console.log('Cargando materias para select...');
            const response = await fetch('/api/materias');
            const data = await response.json();
            console.log('Materias cargadas:', data);

            if (data.success) {
              const selectTarea = document.getElementById('selectMaterias');
              const selectHorario = document.getElementById('selectMateriasHorario');

              // Limpiar selects
              selectTarea.innerHTML = '<option value="">Seleccionar materia...</option>';
              selectHorario.innerHTML = '<option value="">Seleccionar materia...</option>';

              // Agregar materias - CORREGIDO PARA MONGODB .id)
              data.materias.forEach(function(materia) {
                const optionHTML = '<option value="' + materia.id + '">' + materia.nombre + '</option>';
                selectTarea.innerHTML += optionHTML;
                selectHorario.innerHTML += optionHTML;
              });
            }
          } catch (error) {
            console.error('Error cargando materias:', error);
          }
        }

        // Crear nueva tarea
        async function crearTarea(event) {
          event.preventDefault();
          const formData = new FormData(event.target);
          const tareaData = {
            titulo: formData.get('titulo'),
            descripcion: formData.get('descripcion'),
            tipo: formData.get('tipo'),
            materi.id: formData.get('materi.id') || null,
            fecha_entrega: formData.get('fecha_entrega'),
            prioridad: parseInt(formData.get('prioridad'))
          };
          
          try {
            const response = await fetch('/api/tareas', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(tareaData)
            });
            
            const data = await response.json();
            
            if (data.success) {
              alert('✅ Tarea creada exitosamente! Ganaste ' + data.puntos_ganados + ' puntos potenciales!');
              cerrarModal('modalTarea');
              event.target.reset();
              cargarTareas();
              cargarProgreso();
            } else {
              alert('❌ Error: ' + data.error);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al crear la tarea');
          }
        }

        // Crear nueva materia
        async function crearMateria(event) {
          event.preventDefault();
          const formData = new FormData(event.target);
          const materiaData = {
            nombre: formData.get('nombre'),
            codigo: formData.get('codigo'),
            creditos: formData.get('creditos') ? parseInt(formData.get('creditos')) : null,
            color: formData.get('color')
          };
          
          try {
            const response = await fetch('/api/materias', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(materiaData)
            });
            
            const data = await response.json();
            
            if (data.success) {
              alert('✅ Materia creada exitosamente!');
              cerrarModal('modalMateria');
              event.target.reset();
              cargarMateriasParaSelect();
            } else {
              alert('❌ Error: ' + data.error);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al crear la materia');
          }
        }

        // Crear nuevo horario
        async function crearHorario(event) {
          event.preventDefault();
          const formData = new FormData(event.target);
          const horarioData = {
            materi.id: formData.get('materi.id'),
            dia: formData.get('dia'),
            hora_inicio: formData.get('hora_inicio'),
            hora_fin: formData.get('hora_fin'),
            aula: formData.get('aula'),
            profesor: formData.get('profesor')
          };
          
          try {
            const response = await fetch('/api/horarios', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(horarioData)
            });
            
            const data = await response.json();
            
            if (data.success) {
              alert('✅ Clase agregada al horario!');
              cerrarModal('modalHorario');
              event.target.reset();
              cargarHorario();
            } else {
              alert('❌ Error: ' + data.error);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al crear el horario');
          }
        }

        // ========== FUNCIONES PARA ELIMINAR ==========
        
        // Función para eliminar tareas - CORREGIDA PARA MONGODB
        async function eliminarTarea(id) {
          if (confirm('¿Estás segura de que quieres eliminar esta tarea?')) {
            try {
              const response = await fetch(\`/api/tareas/\${id}\`, { 
                method: 'DELETE' 
              });
              const data = await response.json();
              
              if (data.success) {
                alert('✅ Tarea eliminada correctamente');
                cargarTareas(); // Recargar la lista
              }
            } catch (error) {
              console.error('Error:', error);
              alert('❌ Error al eliminar la tarea');
            }
          }
        }

        // Función para eliminar horarios - CORREGIDA PARA MONGODB
        async function eliminarHorario(id) {
          if (confirm('¿Estás segura de que quieres eliminar esta clase del horario?')) {
            try {
              const response = await fetch(\`/api/horarios/\${id}\`, { 
                method: 'DELETE' 
              });
              const data = await response.json();
              
              if (data.success) {
                alert('✅ Clase eliminada del horario');
                cargarHorario(); // Recargar el horario
              }
            } catch (error) {
              console.error('Error:', error);
              alert('❌ Error al eliminar la clase');
            }
          }
        }

        // ========== SISTEMA DE RECOMPENSAS MEJORADO ==========

        let recompensasGlobales = [];
        let puntosActuales = 0;

        // Cargar recompensas y puntos
        async function cargarRecompensas() {
            try {
                console.log('Cargando recompensas...');
                const response = await fetch('/api/recompensas');
                const data = await response.json();
                console.log('Recompensas cargadas:', data);

                if (data.success) {
                    recompensasGlobales = data.recompensas;
                    // Actualizar puntos
                    await actualizarPuntos();
                    // Mostrar todas las recompensas
                    mostrarRecompensas(recompensasGlobales);
                }
            } catch (error) {
                console.error('Error cargando recompensas:', error);
                document.getElementById('recompensas-lista').innerHTML = 
                    '<div style="color: red; text-align: center; padding: 20px;">Error cargando recompensas</div>';
            }
        }

        // Actualizar puntos disponibles
        async function actualizarPuntos() {
            try {
                const response = await fetch('/api/progreso');
                const data = await response.json();
                
                if (data.success) {
                    puntosActuales = data.progreso.puntos_totales - data.progreso.puntos_gastados;
                    document.getElementById('puntos-actuales').textContent = puntosActuales;
                }
            } catch (error) {
                console.error('Error actualizando puntos:', error);
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
                                    '<span>' + (recompensa.imagen || '🎁') + '</span>' +
                                    '<strong>' + recompensa.nombre + '</strong>' +
                                    '<span class="recompensa-categoria">' + obtenerNombreCategoria(recompensa.categoria) + '</span>' +
                                '</div>' +
                                '<div class="recompensa-descripcion">' + recompensa.descripcion + '</div>' +
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
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (data.success) {
                    alert('🎉 ¡Recompensa canjeada! Has gastado ' + puntosRequeridos + ' puntos\\n💎 Puntos restantes: ' + data.puntos_restantes);
                    
                    // Recargar todo
                    cargarRecompensas();
                    cargarProgreso();
                    cargarHistorialCanjes();
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
                            '<div style="display: flex; justify-content: between; align-items: center;">' +
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
        
        // Funciones globales simples para los botones
        async function cargarTareas() {
            try {
                console.log('Cargando tareas...');
                const response = await fetch('/api/tareas');
                const data = await response.json();
                console.log('Tareas cargadas:', data);
                mostrarTareas(data.tareas);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function cargarHorario() {
            try {
                console.log('Cargando horario...');
                const response = await fetch('/api/horarios');
                const data = await response.json();
                console.log('Horario cargado:', data);
                mostrarHorario(data.horarios);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function obtenerMensajeEspecial() {
            try {
                const response = await fetch('/api/mensaje-especial');
                const data = await response.json();
                document.getElementById('mensaje-especial').innerHTML = \`
                    <strong>💕 \${data.mensaje}</strong>
                    <br><small>🕒 \${data.timestamp}</small>
                \`;
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // FUNCIÓN COMPLETAR TAREA - CORREGIDA PARA MONGODB
        async function completarTarea(id) {
            try {
                const response = await fetch(\`/api/tareas/\${id}/completar\`, { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                    alert(data.message + '\\\\n' + data.mensaje_especial);
                    cargarTareas();
                    cargarProgreso();
                    cargarRecompensas();
                } else {
                    alert('❌ Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Error al completar la tarea');
            }
        }

        async function cargarProgreso() {
            try {
                console.log('Cargando progreso...');
                const response = await fetch('/api/progreso');
                const data = await response.json();
                console.log('Progreso cargado:', data);
                mostrarProgreso(data.progreso);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function mostrarProgreso(progreso) {
            document.getElementById('progreso-info').innerHTML = \`
                <div style="text-align: center;">
                    <h3 style="color: #880e4f; margin-bottom: 15px;">⭐ Mi Progreso 🌟</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div style="background: #fce4ec; padding: 15px; border-radius: 15px;">
                            <div style="font-size: 2em; color: #ec4899;">\${progreso.puntos_totales}</div>
                            <div style="color: #880e4f;">🎯 Puntos</div>
                        </div>
                        <div style="background: #fce4ec; padding: 15px; border-radius: 15px;">
                            <div style="font-size: 2em; color: #ec4899;">\${progreso.tareas_completadas}</div>
                            <div style="color: #880e4f;">✅ Tareas</div>
                        </div>
                    </div>
                </div>
            \`;
        }

        // FUNCIÓN MOSTRAR TAREAS - COMPLETAMENTE CORREGIDA PARA MONGODB
        function mostrarTareas(tareas) {
          if (!tareas || tareas.length === 0) {
            document.getElementById('tareas-lista').innerHTML = \`
              <div style="text-align: center; padding: 30px; color: #880e4f;">
                <div style="font-size: 3em; margin-bottom: 10px;">🎀</div>
                <h3>¡No hay tareas pendientes!</h3>
                <p>¡Eres una estudiante ejemplar! 💖</p>
              </div>
            \`;
            return;
          }

          const tareasHTML = tareas.map(tarea => {
            const tareaId = tarea.id;
            const fechaEntrega = tarea.fecha_entrega ? new Date(tarea.fecha_entrega).toLocaleDateString() : '';
            
            return \`
            <div class="item-tarea \${tarea.completada ? 'tarea-completada' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span class="color-materia" style="background-color: \${tarea.materia_color || '#EC4899'};"></span>
                    <strong style="color: #880e4f;">\${tarea.materia_nombre || 'General'}</strong>
                    <span style="margin-left: auto; background: #ff9eb5; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em;">
                      \${obtenerEmojiTipo(tarea.tipo)} \${tarea.tipo}
                    </span>
                  </div>
                  <div style="color: #880e4f; font-size: 1.1em; margin-bottom: 5px;">\${tarea.titulo}</div>
                  \${tarea.descripcion ? \`<div style="color: #666; margin-bottom: 8px; font-size: 0.9em;">\${tarea.descripcion}</div>\` : ''}
                  <div style="display: flex; gap: 15px; font-size: 0.85em; color: #888;">
                    \${fechaEntrega ? \`<span>📅 \${fechaEntrega}</span>\` : ''}
                    <span>⭐ Prioridad: \${'★'.repeat(tarea.prioridad)}\${'☆'.repeat(5-tarea.prioridad)}</span>
                    <span>🎯 \${tarea.puntos || 10} puntos</span>
                  </div>
                </div>
                <div style="display: flex; gap: 8px; flex-direction: column; min-width: 120px;">
                  \${!tarea.completada ? \`
                    <button class="btn btn-pequeno" onclick="completarTarea('\${tareaId}')" 
                            style="background: #10b981;">
                      ✅ Completar
                    </button>
                  \` : \`
                    <span style="color: #10b981; font-weight: bold; text-align: center;">
                      ✅ Completada
                    </span>
                  \`}
                  <button class="btn btn-pequeno" onclick="eliminarTarea('\${tareaId}')" 
                          style="background: #ef4444;">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
            \`;
          }).join('');
          
          document.getElementById('tareas-lista').innerHTML = tareasHTML;
        }

        // FUNCIÓN MOSTRAR HORARIO - CORREGIDA PARA MONGODB
        function mostrarHorario(horarios) {
          if (!horarios || horarios.length === 0) {
            document.getElementById('horario-lista').innerHTML = \`
              <div style="text-align: center; padding: 20px; color: #880e4f;">
                <div style="font-size: 2em; margin-bottom: 10px;">🕐</div>
                <p>No hay clases en el horario aún</p>
              </div>
            \`;
            return;
          }

          const horarioHTML = horarios.map(horario => {
            const horarioId = horario.id;
            
            return \`
            <div class="item-tarea">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <span class="color-materia" style="background-color: \${horario.materia_color || '#EC4899'};"></span>
                    <strong style="color: #880e4f; flex: 1;">\${horario.materia_nombre}</strong>
                    <span style="background: #ff9eb5; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.9em;">
                      🕐 \${horario.hora_inicio} - \${horario.hora_fin}
                    </span>
                  </div>
                  <div style="color: #666; font-size: 0.9em;">\${horario.dia}</div>
                  \${horario.aula ? \`<div style="color: #666; font-size: 0.9em;">🏫 \${horario.aula}</div>\` : ''}
                  \${horario.profesor ? \`<div style="color: #666; font-size: 0.9em;">👨‍🏫 \${horario.profesor}</div>\` : ''}
                </div>
                <button class="btn btn-pequeno" onclick="eliminarHorario('\${horarioId}')" 
                        style="background: #ef4444; min-width: 60px;">
                  🗑️ Eliminar
                </button>
              </div>
            </div>
            \`;
          }).join('');
          
          document.getElementById('horario-lista').innerHTML = horarioHTML;
        }

        function obtenerEmojiTipo(tipo) {
            const emojis = {
                'tarea': '📝',
                'quiz': '📋',
                'parcial': '📊',
                'trabajo': '📄',
                'proyecto': '📚'
            };
            return emojis[tipo] || '📌';
        }

        // Cargar todo al iniciar
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM cargado, inicializando aplicación...');
            cargarProgreso();
            cargarTareas();
            cargarHorario();
            cargarRecompensas();
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

// API de progreso
app.get('/api/progreso', async (req, res) => {
  try {
    const db = getDB();
    const tareas = await db.collection('tareas').find({}).toArray();
    
    const tareasCompletadas = tareas.filter(t => t.completada).length;
    const puntosTotales = tareasCompletadas * 10; // 10 puntos por tarea
    
    // Obtener puntos gastados de recompensas
    const recompensasCanjeadas = await db.collection('recompensas_canjeadas').find({}).toArray();
    const puntosGastados = recompensasCanjeadas.reduce((total, r) => total + r.puntos, 0);
    
    res.json({
      success: true,
      progreso: {
        tareas_completadas: tareasCompletadas,
        puntos_totales: puntosTotales,
        puntos_gastados: puntosGastados
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🚀 Listo para producción en Render.com`);
});