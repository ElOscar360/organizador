// server.js - VERSIÓN CON MODALES
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

// Ruta principal CON MODALES
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
            /* Estilos para modales */
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }
            .modal-contenido {
                background-color: #fef6ff;
                margin: 5% auto;
                padding: 25px;
                border-radius: 20px;
                width: 90%;
                max-width: 500px;
                border: 3px solid #ff9eb5;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
            .cerrar-modal {
                color: #880e4f;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                background: none;
                border: none;
            }
            .cerrar-modal:hover {
                color: #ec4899;
            }
            .form-grupo {
                margin-bottom: 18px;
            }
            .form-label {
                display: block;
                margin-bottom: 6px;
                color: #880e4f;
                font-weight: bold;
            }
            .form-input, .form-select, .form-textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #ff9eb5;
                border-radius: 12px;
                background: white;
                font-size: 16px;
                box-sizing: border-box;
            }
            .form-textarea {
                min-height: 80px;
                resize: vertical;
            }
            .form-botones {
                display: flex;
                gap: 12px;
                margin-top: 25px;
                justify-content: flex-end;
            }
            .btn {
                background: #ec4899;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
            }
            .btn:hover {
                background: #db2777;
            }
            .btn-secundario {
                background: #8b5cf6;
            }
            .btn-secundario:hover {
                background: #7c3aed;
            }
            .btn-accion {
                background: #10b981;
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 5px;
            }
             /* === AGREGAR AQUÍ LOS NUEVOS ESTILOS DE RECOMPENSAS === */
                .tarjeta-recompensa {
                    background: white;
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 15px;
                    border: 2px solid #ff9eb5;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .info-recompensa {
                    flex: 1;
                }
                .recompensa-titulo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                    flex-wrap: wrap;
                }
                .recompensa-categoria {
                    background: #8b5cf6;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 10px;
                    font-size: 0.8em;
                }
                .recompensa-descripcion {
                    color: #666;
                    margin: 10px 0;
                    line-height: 1.4;
                }
                .recompensa-puntos {
                    background: #fce4ec;
                    padding: 5px 10px;
                    border-radius: 15px;
                    color: #880e4f;
                    font-weight: bold;
                    display: inline-block;
                }
                .btn-canjear {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                    min-width: 120px;
                    font-size: 14px;
                    transition: background 0.3s;
                }
                .btn-canjear:hover:not(:disabled) {
                    background: #059669;
                    transform: translateY(-2px);
                }
                .btn-canjear:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                    transform: none;
                }
                .btn-filtro {
                    background: #fce4ec;
                    border: 2px solid #ff9eb5;
                    padding: 8px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    color: #880e4f;
                    font-weight: bold;
                    transition: all 0.3s;
                }
                .btn-filtro:hover {
                    background: #fbcfe8;
                }
                .btn-filtro.active {
                    background: #ec4899;
                    color: white;
                    border-color: #ec4899;
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
                        <button class="btn-accion" onclick="mostrarModal('modalTarea')">
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
                        <button class="btn-accion" onclick="mostrarModal('modalHorario')">
                            <span>➕</span> Nueva Clase
                        </button>
                    </div>
                    <button class="btn" onclick="cargarHorario()">🔄 Actualizar Horario</button>
                    <div id="horario-lista" style="margin-top: 20px;">Cargando horario...</div>
                </div>

                <!-- Sección de Recompensas -->
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
                        <div id="historial-canjes" style="margin-top: 15px;"></div>
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
                
                <form id="formTarea">
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
                        <button type="button" class="btn" onclick="crearTarea()">💾 Guardar Tarea</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal para Nueva Clase en Horario -->
        <div id="modalHorario" class="modal">
            <div class="modal-contenido">
                <button class="cerrar-modal" onclick="cerrarModal('modalHorario')">×</button>
                <h2 style="color: #880e4f; margin-bottom: 20px; text-align: center;">🕐 Nueva Clase</h2>
                
                <form id="formHorario">
                    <div class="form-grupo">
                        <label class="form-label">Nombre de la materia *</label>
                        <input type="text" class="form-input" name="materia_nombre" required placeholder="Ej: Matemáticas">
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
                        </select>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-grupo">
                            <label class="form-label">Hora inicio *</label>
                            <input type="time" class="form-input" name="hora_inicio" required>
                        </div>
                        <div class="form-grupo">
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
                        <button type="button" class="btn" onclick="crearHorario()">💾 Guardar Clase</button>
                    </div>
                </form>
            </div>
        </div>

        <script>
        // ========== FUNCIONES PARA MODALES ==========
        
        function mostrarModal(idModal) {
    document.getElementById(idModal).style.display = 'block';
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

        // ========== FUNCIONES PRINCIPALES ==========
        
        // Crear nueva tarea
        async function crearTarea() {
            const form = document.getElementById('formTarea');
            const formData = new FormData(form);
            
            const tareaData = {
                titulo: formData.get('titulo'),
                descripcion: formData.get('descripcion'),
                tipo: formData.get('tipo'),
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
                    form.reset();
                    cargarTareas();
                    cargarProgreso();
                    cargarRecompensas();
                } else {
                    alert('❌ Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Error al crear la tarea');
            }
        }

        // Crear nuevo horario
        async function crearHorario() {
            const form = document.getElementById('formHorario');
            const formData = new FormData(form);
            
            const horarioData = {
                materia_nombre: formData.get('materia_nombre'),
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
                    form.reset();
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
        
        async function eliminarTarea(id) {
            if (confirm('¿Estás segura de que quieres eliminar esta tarea?')) {
                try {
                    const response = await fetch('/api/tareas/' + id, { 
                        method: 'DELETE' 
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('✅ Tarea eliminada correctamente');
                        cargarTareas();
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('❌ Error al eliminar la tarea');
                }
            }
        }

        async function eliminarHorario(id) {
            if (confirm('¿Estás segura de que quieres eliminar esta clase del horario?')) {
                try {
                    const response = await fetch('/api/horarios/' + id, { 
                        method: 'DELETE' 
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('✅ Clase eliminada del horario');
                        cargarHorario();
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('❌ Error al eliminar la clase');
                }
            }
        }

        // ========== SISTEMA DE RECOMPENSAS ==========

        let recompensasGlobales = [];
        let puntosActuales = 0;

        async function cargarRecompensas() {
    try {
        console.log('🔄 [1] Iniciando carga de recompensas...');
        
        const response = await fetch('/api/recompensas');
        console.log('📨 [2] Respuesta HTTP:', response.status, response.ok);
        
        const data = await response.json();
        console.log('📦 [3] Datos recibidos:', data);
        
        if (data.success) {
            recompensasGlobales = data.recompensas;
            console.log('✅ [4] Recompensas cargadas en variable:', recompensasGlobales);
            console.log('📝 [5] Cantidad:', recompensasGlobales.length);
            
            await actualizarPuntos();
            console.log('🎨 [6] Llamando a mostrarRecompensas...');
            mostrarRecompensas(recompensasGlobales);
        } else {
            console.error('❌ [ERROR] Error en la respuesta:', data.error);
        }
    } catch (error) {
        console.error('💥 [ERROR] Error cargando recompensas:', error);
    }
}

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

        function mostrarRecompensas(recompensas) {
    console.log('🎨 [7] MostrarRecompensas llamado con:', recompensas);
    console.log('📊 [8] Tipo de datos:', typeof recompensas);
    console.log('🔢 [9] Cantidad recibida:', recompensas ? recompensas.length : 'null');
    
    if (!recompensas || recompensas.length === 0) {
        console.log('❌ [10] No hay recompensas o array vacío');
        document.getElementById('recompensas-lista').innerHTML = 
            '<div style="text-align: center; padding: 40px; color: #880e4f;">' +
                '<div style="font-size: 3em; margin-bottom: 10px;">🎁</div>' +
                '<h3>No hay recompensas disponibles</h3>' +
                '<p>¡Vuelve más tarde!</p>' +
            '</div>';
        return;
    }

    console.log('🎯 [11] Generando HTML para recompensas...');
    
    const recompensasHTML = recompensas.map((recompensa, index) => {
        console.log('📝 [12] Procesando recompensa ${index}:', recompensa.nombre);
        const puedeCanjear = puntosActuales >= recompensa.puntos_requeridos;
        
        return '<div class="tarjeta-recompensa">' +
                    '<div class="info-recompensa">' +
                        '<div class="recompensa-titulo">' +
                            '<span style="font-size: 1.5em; margin-right: 10px;">' + (recompensa.imagen || '🎁') + '</span>' +
                            '<strong style="font-size: 1.1em; color: #880e4f;">' + recompensa.nombre + '</strong>' +
                            '<span class="recompensa-categoria">' + obtenerNombreCategoria(recompensa.categoria) + '</span>' +
                        '</div>' +
                        '<div class="recompensa-descripcion">' + recompensa.descripcion + '</div>' +
                        '<div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">' +
                            '<span class="recompensa-puntos">💎 ' + recompensa.puntos_requeridos + ' puntos</span>' +
                            (recompensa.canjeable_multiple ? 
                                '<span style="color: #8b5cf6; font-size: 0.8em; background: #f3f4f6; padding: 3px 8px; border-radius: 10px;">🔄 Múltiple</span>' : 
                                ''
                            ) +
                        '</div>' +
                    '</div>' +
                    '<button class="btn-canjear" ' +
                            'onclick="canjearRecompensa(\'' + recompensa._id + '\', ' + recompensa.puntos_requeridos + ')" ' +
                            (puedeCanjear ? '' : 'disabled') + '>' +
                        (puedeCanjear ? '🎁 Canjear' : '🔒 Insuficiente') +
                    '</button>' +
                '</div>';
    }).join('');

    console.log('🎉 [13] HTML generado, insertando en DOM...');
    document.getElementById('recompensas-lista').innerHTML = recompensasHTML;
    console.log('✅ [14] Recompensas mostradas en pantalla');
}

        function filtrarRecompensas(categoria) {
            document.querySelectorAll('.btn-filtro').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            const recompensasFiltradas = categoria === 'todas' 
                ? recompensasGlobales 
                : recompensasGlobales.filter(r => r.categoria === categoria);
            
            mostrarRecompensas(recompensasFiltradas);
        }

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

        // ========== FUNCIONES BÁSICAS ==========
        
        async function cargarTareas() {
            try {
                const response = await fetch('/api/tareas');
                const data = await response.json();
                mostrarTareas(data.tareas);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function cargarHorario() {
            try {
                const response = await fetch('/api/horarios');
                const data = await response.json();
                mostrarHorario(data.horarios);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function obtenerMensajeEspecial() {
            try {
                const response = await fetch('/api/mensaje-especial');
                const data = await response.json();
                document.getElementById('mensaje-especial').innerHTML = 
                    '<strong>💕 ' + data.mensaje + '</strong>' +
                    '<br><small>🕒 ' + data.timestamp + '</small>';
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function completarTarea(id) {
            try {
                const response = await fetch('/api/tareas/' + id + '/completar', { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                    alert(data.message + '\\n' + data.mensaje_especial);
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
                const response = await fetch('/api/progreso');
                const data = await response.json();
                mostrarProgreso(data.progreso);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function mostrarProgreso(progreso) {
            document.getElementById('progreso-info').innerHTML = 
                '<div style="text-align: center;">' +
                    '<h3 style="color: #880e4f; margin-bottom: 15px;">⭐ Mi Progreso 🌟</h3>' +
                    '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">' +
                        '<div style="background: #fce4ec; padding: 15px; border-radius: 15px;">' +
                            '<div style="font-size: 2em; color: #ec4899;">' + progreso.puntos_totales + '</div>' +
                            '<div style="color: #880e4f;">🎯 Puntos</div>' +
                        '</div>' +
                        '<div style="background: #fce4ec; padding: 15px; border-radius: 15px;">' +
                            '<div style="font-size: 2em; color: #ec4899;">' + progreso.tareas_completadas + '</div>' +
                            '<div style="color: #880e4f;">✅ Tareas</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

        function mostrarTareas(tareas) {
            if (!tareas || tareas.length === 0) {
                document.getElementById('tareas-lista').innerHTML = 
                    '<div style="text-align: center; padding: 30px; color: #880e4f;">' +
                        '<div style="font-size: 3em; margin-bottom: 10px;">🎀</div>' +
                        '<h3>¡No hay tareas pendientes!</h3>' +
                        '<p>¡Eres una estudiante ejemplar! 💖</p>' +
                    '</div>';
                return;
            }

            const tareasHTML = tareas.map(tarea => {
                const fechaEntrega = tarea.fecha_entrega ? new Date(tarea.fecha_entrega).toLocaleDateString() : '';
                
                return '<div class="item-tarea ' + (tarea.completada ? 'tarea-completada' : '') + '">' +
                    '<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">' +
                        '<div style="flex: 1;">' +
                            '<div style="display: flex; align-items: center; margin-bottom: 8px;">' +
                                '<span class="color-materia" style="background-color: ' + (tarea.materia_color || '#EC4899') + ';"></span>' +
                                '<strong style="color: #880e4f;">' + (tarea.materia_nombre || 'General') + '</strong>' +
                                '<span style="margin-left: auto; background: #ff9eb5; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em;">' +
                                    obtenerEmojiTipo(tarea.tipo) + ' ' + tarea.tipo +
                                '</span>' +
                            '</div>' +
                            '<div style="color: #880e4f; font-size: 1.1em; margin-bottom: 5px;">' + tarea.titulo + '</div>' +
                            (tarea.descripcion ? '<div style="color: #666; margin-bottom: 8px; font-size: 0.9em;">' + tarea.descripcion + '</div>' : '') +
                            '<div style="display: flex; gap: 15px; font-size: 0.85em; color: #888;">' +
                                (fechaEntrega ? '<span>📅 ' + fechaEntrega + '</span>' : '') +
                                '<span>⭐ Prioridad: ' + '★'.repeat(tarea.prioridad) + '☆'.repeat(5-tarea.prioridad) + '</span>' +
                                '<span>🎯 ' + (tarea.puntos || 10) + ' puntos</span>' +
                            '</div>' +
                        '</div>' +
                        '<div style="display: flex; gap: 8px; flex-direction: column; min-width: 120px;">' +
                            (!tarea.completada ? 
                                '<button class="btn btn-pequeno" onclick="completarTarea(\\'' + tarea._id + '\\')" style="background: #10b981;">✅ Completar</button>' :
                                '<span style="color: #10b981; font-weight: bold; text-align: center;">✅ Completada</span>'
                            ) +
                            '<button class="btn btn-pequeno" onclick="eliminarTarea(\\'' + tarea._id + '\\')" style="background: #ef4444;">🗑️ Eliminar</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
            
            document.getElementById('tareas-lista').innerHTML = tareasHTML;
        }

        function mostrarHorario(horarios) {
            if (!horarios || horarios.length === 0) {
                document.getElementById('horario-lista').innerHTML = 
                    '<div style="text-align: center; padding: 20px; color: #880e4f;">' +
                        '<div style="font-size: 2em; margin-bottom: 10px;">🕐</div>' +
                        '<p>No hay clases en el horario aún</p>' +
                    '</div>';
                return;
            }

            const horarioHTML = horarios.map(horario => {
                return '<div class="item-tarea">' +
                    '<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">' +
                        '<div style="flex: 1;">' +
                            '<div style="display: flex; align-items: center; margin-bottom: 5px;">' +
                                '<span class="color-materia" style="background-color: ' + (horario.materia_color || '#EC4899') + ';"></span>' +
                                '<strong style="color: #880e4f; flex: 1;">' + horario.materia_nombre + '</strong>' +
                                '<span style="background: #ff9eb5; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.9em;">' +
                                    '🕐 ' + horario.hora_inicio + ' - ' + horario.hora_fin +
                                '</span>' +
                            '</div>' +
                            '<div style="color: #666; font-size: 0.9em;">' + horario.dia + '</div>' +
                            (horario.aula ? '<div style="color: #666; font-size: 0.9em;">🏫 ' + horario.aula + '</div>' : '') +
                            (horario.profesor ? '<div style="color: #666; font-size: 0.9em;">👨‍🏫 ' + horario.profesor + '</div>' : '') +
                        '</div>' +
                        '<button class="btn btn-pequeno" onclick="eliminarHorario(\\'' + horario._id + '\\')" style="background: #ef4444; min-width: 60px;">🗑️ Eliminar</button>' +
                    '</div>' +
                '</div>';
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
    timestamp: new Date().toLocaleTimeString()
  });
});

// API de progreso
app.get('/api/progreso', async (req, res) => {
  try {
    const db = getDB();
    const tareas = await db.collection('tareas').find({}).toArray();
    
    const tareasCompletadas = tareas.filter(t => t.completada).length;
    const puntosTotales = tareasCompletadas * 10;
    
    const recompensasCanjeadas = await db.collection('recompensas_canjeadas').find({}).toArray();
    const puntosGastados = recompensasCanjeadas.reduce((total, r) => total + (r.puntos_gastados || 0), 0);
    
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

// API de recompensas
app.get('/api/recompensas', async (req, res) => {
    try {
        console.log('🔍 [SERVER] Buscando recompensas en MongoDB...');
        const db = getDB();
        
        const recompensas = await db.collection('recompensas').find({}).toArray();
        console.log('📊 [SERVER] Recompensas encontradas:', recompensas.length);
        
        res.json({
            success: true,
            recompensas: recompensas
        });
        
        console.log('✅ [SERVER] Recompensas enviadas al frontend');
    } catch (error) {
        console.error('❌ [SERVER] Error en /api/recompensas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta de DEBUG para recompensas
app.get('/api/debug-recompensas', async (req, res) => {
    try {
        const db = getDB();
        console.log('🔍 Buscando recompensas en la base de datos...');
        
        const recompensas = await db.collection('recompensas').find({}).toArray();
        console.log('📊 Recompensas encontradas:', recompensas.length);
        
        recompensas.forEach((r, i) => {
            console.log(`🎁 Recompensa ${i + 1}:`, r.nombre, '- ID:', r._id);
        });

        res.json({
            success: true,
            count: recompensas.length,
            recompensas: recompensas
        });
    } catch (error) {
        console.error('❌ Error en debug:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🚀 Listo para producción en Render.com`);
});