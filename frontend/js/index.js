
        const API_BASE = '';
        let categorias = [];
        let promocionesWeb = [];

        function money(valor) {
            return '$' + Number(valor || 0).toFixed(2) + ' MXN';
        }

        function formatearMetodoPago(valor) {
            const mapa = {
                pago_en_linea: 'Pago en línea',
                efectivo: 'Efectivo',
                tarjeta: 'Tarjeta',
                transferencia: 'Transferencia',
                cortesia: 'Cortesía'
            };
            return mapa[valor] || valor || 'N/A';
        }

        function mostrarMensaje(texto, tipo = 'ok') {
            const mensaje = document.getElementById('mensaje');
            mensaje.className = `mensaje ${tipo}`;
            mensaje.textContent = texto;
        }

        function ocultarMensaje() {
            const mensaje = document.getElementById('mensaje');
            mensaje.className = 'mensaje';
            mensaje.textContent = '';
        }

        function mostrarMensajeConsulta(texto, tipo = 'ok') {
            const mensaje = document.getElementById('mensaje-consulta');
            mensaje.className = `mensaje ${tipo}`;
            mensaje.textContent = texto;
        }

        function ocultarMensajeConsulta() {
            const mensaje = document.getElementById('mensaje-consulta');
            mensaje.className = 'mensaje';
            mensaje.textContent = '';
        }

        function getCategoriaById(id) {
            return categorias.find(c => Number(c.id) === Number(id)) || null;
        }

        function construirOpcionesCategorias() {
            return categorias.map(cat => `
                <option value="${cat.id}" data-precio="${cat.precio}">
                    ${cat.nombre} - ${money(cat.precio)}
                </option>
            `).join('');
        }

        function renderTarifas() {
            const contenedor = document.getElementById('tarjetas-precios');

            contenedor.innerHTML = categorias.map(cat => `
                <div class="precio-card">
                    <h3>${cat.nombre}</h3>
                    <div class="precio">$${Number(cat.precio).toFixed(2)} <small>MXN</small></div>
                    <p>${cat.descripcion || ''}${cat.requiere_credencial ? ' | Requiere credencial' : ''}</p>
                </div>
            `).join('');
        }

        function crearBoletoHTML() {
            return `
                <div class="boleto-item">
                    <select class="categoria" onchange="calcularTotales()">
                        ${construirOpcionesCategorias()}
                    </select>
                    <input type="number" class="cantidad" value="1" min="1" max="100" onchange="calcularTotales()">
                    <span class="subtotal">$0.00</span>
                    <button type="button" class="btn-eliminar" onclick="eliminarBoleto(this)">✕</button>
                </div>
            `;
        }

        function agregarBoleto() {
            if (!categorias.length) return;

            const container = document.getElementById('boletos-container');
            const wrapper = document.createElement('div');
            wrapper.innerHTML = crearBoletoHTML();
            container.appendChild(wrapper.firstElementChild);
            calcularTotales();
        }

        function eliminarBoleto(btn) {
            const items = document.querySelectorAll('.boleto-item');
            if (items.length <= 1) {
                mostrarMensaje('Debes tener al menos un renglón de boletos.', 'error');
                return;
            }

            btn.parentElement.remove();
            calcularTotales();
        }
        function nombreDiaPromoPublica(valor) {
    const mapa = {
        1: 'domingo',
        2: 'lunes',
        3: 'martes',
        4: 'miércoles',
        5: 'jueves',
        6: 'viernes',
        7: 'sábado'
    };

    return mapa[Number(valor)] || 'todos los días';
}

async function cargarPromocionesWeb() {
    const fecha = document.getElementById('fecha_visita')?.value || new Date().toISOString().split('T')[0];

    try {
        const response = await fetch(`${API_BASE}/api/promociones-publicas?fecha=${encodeURIComponent(fecha)}`);
        const data = await response.json();

        promocionesWeb = data.success ? (data.promociones || []) : [];
        renderPromoWeb();
        calcularTotales();
    } catch {
        promocionesWeb = [];
        renderPromoWeb();
    }
}

function renderPromoWeb() {
    const box = document.getElementById('promo-web-box');
    if (!box) return;

    if (!promocionesWeb.length) {
        box.style.display = 'none';
        box.innerHTML = '';
        return;
    }

    const promo = promocionesWeb[0];

    box.style.display = 'block';
    box.innerHTML = `
        <strong>🎉 Promoción activa: ${promo.nombre}</strong>
        <span>${promo.descripcion || '2x1 disponible solo en reservaciones web.'}</span>
        <small>
            Aplica ${promo.dia_semana ? 'los ' + nombreDiaPromoPublica(promo.dia_semana) : 'todos los días'}.
            ${promo.categoria_nombre ? 'Categoría: ' + promo.categoria_nombre + '.' : 'Aplica a todas las categorías.'}
        </small>
    `;
}

function obtenerPromoActivaParaCategoria(categoriaId) {
    if (!promocionesWeb.length) return null;

    const promo = promocionesWeb[0];

    if (!promo.categoria_id) return promo;

    return Number(promo.categoria_id) === Number(categoriaId) ? promo : null;
}

        function calcularTotales() {
            let total = 0;

            document.querySelectorAll('.boleto-item').forEach(item => {
                const categoriaId = Number(item.querySelector('.categoria').value);
                const cantidad = Number(item.querySelector('.cantidad').value) || 0;
                const categoria = getCategoriaById(categoriaId);

                const precio = categoria ? Number(categoria.precio) : 0;
               let subtotal = precio * cantidad;
let descuento = 0;

const promo = obtenerPromoActivaParaCategoria(categoriaId);

if (promo && promo.tipo === '2x1') {
    const gratis = Math.floor(cantidad / 2);
    descuento = gratis * precio;
    subtotal = subtotal - descuento;
}

item.querySelector('.subtotal').textContent = descuento > 0
    ? `$${subtotal.toFixed(2)} promo`
    : '$' + subtotal.toFixed(2);

total += subtotal;
            });

            document.getElementById('total').innerHTML = `Total: $${total.toFixed(2)} MXN`;
            return total;
        }

        function obtenerDetallesCompra() {
            const detalles = [];

            document.querySelectorAll('.boleto-item').forEach(item => {
                const categoriaId = Number(item.querySelector('.categoria').value);
                const cantidad = Number(item.querySelector('.cantidad').value) || 0;

                if (cantidad > 0) {
                    detalles.push({
                        categoria_id: categoriaId,
                        cantidad: cantidad
                    });
                }
            });

            return detalles;
        }

        function imprimirSoloQR() {
            window.print();
        }

        function claseEstadoAcceso(estado) {
            const v = String(estado || '').toLowerCase();
            if (v === 'usado') return 'estado-pill estado-ok';
            if (v === 'pendiente') return 'estado-pill estado-warn';
            return 'estado-pill estado-bad';
        }

        function renderResultadoCompra(data) {
            const qrContainer = document.getElementById('qr-code');
            const resumen = document.getElementById('resumen-compra');
            const qrSection = document.getElementById('qr-generado');
            const btnDescargar = document.getElementById('btn-descargar');

            qrContainer.innerHTML = `
                <img src="${data.venta.qr_url}" alt="Código QR del boleto">
            `;

            const detalleHTML = data.detalles.map(d => `
                <li>${d.nombre} x${d.cantidad} — ${money(d.subtotal)}</li>
            `).join('');

           resumen.innerHTML = `
    <h2 style="margin:0 0 10px;color:#283618;">✅ Reservación registrada</h2>
    <p><strong>Folio:</strong> ${data.venta.folio}</p>
    <p><strong>Correo:</strong> ${data.venta.email || 'N/A'}</p>
    <p><strong>Fecha de visita:</strong> ${data.venta.fecha_visita}</p>
    <p><strong>Total de personas:</strong> ${data.venta.cantidad_personas}</p>
    <p><strong>Total a pagar en taquilla:</strong> ${money(data.venta.total)}</p>
    <p><strong>Estado del pago:</strong> Pendiente de pago en taquilla</p>
    <p><strong>Correo enviado:</strong> ${data.venta.correo_enviado ? 'Sí ✅' : 'No ⚠️'}</p>
    <p><strong>Indicaciones:</strong> 📱 Presenta este QR en taquilla para confirmar tu pago.</p>
    <p><strong>Detalle:</strong></p>
    <ul>${detalleHTML}</ul>
`;

            btnDescargar.href = data.venta.qr_url;
            btnDescargar.setAttribute('download', `${data.venta.folio}.png`);

            qrSection.style.display = 'block';
            qrSection.scrollIntoView({ behavior: 'smooth' });
        }

        function imprimirConsulta() {
            const resultado = document.getElementById('consulta-resultado');
            if (!resultado.classList.contains('show')) {
                mostrarMensajeConsulta('❌ Primero consulta un boleto.', 'error');
                return;
            }

            const popup = window.open('', '_blank', 'width=900,height=700');
            popup.document.write(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Consulta de boleto</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; color: #222; }
                        .wrap { max-width: 720px; margin: auto; border: 2px solid #d4a373; border-radius: 18px; padding: 24px; }
                        h1 { margin-top: 0; color: #1b4332; }
                        .box { background: #f8f9fa; padding: 14px; border-radius: 12px; margin: 10px 0; }
                        .qr { text-align: center; margin: 20px 0; }
                        .qr img { max-width: 220px; border: 1px solid #ccc; padding: 10px; border-radius: 12px; }
                        ul { margin: 0; padding-left: 20px; }
                    </style>
                </head>
                <body>
                    <div class="wrap">
                        ${document.getElementById('consulta-resultado').innerHTML}
                    </div>
                    <script>
                        window.onload = function() { window.print(); }
                    <\/script>
                </body>
                </html>
            `);
            popup.document.close();
        }

        async function consultarBoleto() {
            ocultarMensajeConsulta();
            document.getElementById('lista-boletos-email').style.display = 'none';

            const folio = document.getElementById('folio_consulta').value.trim();
            const resultado = document.getElementById('consulta-resultado');
            const qr = document.getElementById('consulta-qr');
            const resumen = document.getElementById('consulta-resumen');
            const descargar = document.getElementById('consulta-descargar');

            if (!folio) {
                mostrarMensajeConsulta('❌ Escribe el folio de compra.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/api/ventas/${encodeURIComponent(folio)}`);
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'No se encontró la compra');
                }

                const venta = data.venta;
                const detallesHtml = (data.detalles || []).map(d => `
                    <li>${d.nombre} x${d.cantidad} — ${money(d.subtotal)}</li>
                `).join('');

                qr.innerHTML = `
                    <img src="${API_BASE}/qrs/${encodeURIComponent(venta.folio)}.png" alt="QR del boleto">
                `;

                resumen.innerHTML = `
                    <p><strong>Folio:</strong> ${venta.folio}</p>
                    <p><strong>Cliente:</strong> ${venta.nombre_cliente || 'N/A'}</p>
                    <p><strong>Correo:</strong> ${venta.email || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> ${venta.telefono || 'N/A'}</p>
                    <p><strong>Fecha de visita:</strong> ${venta.fecha_visita ? String(venta.fecha_visita).slice(0,10) : 'N/A'}</p>
                    <p><strong>Total de personas:</strong> ${venta.cantidad_personas ?? 'N/A'}</p>
                    <p><strong>Total pagado:</strong> ${money(venta.total)}</p>
                    <p><strong>Método de pago:</strong> ${formatearMetodoPago(venta.metodo_pago)}</p>
                    <p>
                        <strong>Estado de acceso:</strong>
                        <span class="${claseEstadoAcceso(venta.estado_acceso)}">${venta.estado_acceso || 'N/A'}</span>
                    </p>
                    <p><strong>Detalle:</strong></p>
                    <ul>${detallesHtml || '<li>Sin detalle</li>'}</ul>
                `;

                descargar.href = `${API_BASE}/qrs/${encodeURIComponent(venta.folio)}.png`;
                descargar.setAttribute('download', `${venta.folio}.png`);

                resultado.classList.add('show');
                resultado.scrollIntoView({ behavior: 'smooth' });

                mostrarMensajeConsulta('✅ Boleto encontrado correctamente.', 'ok');
            } catch (error) {
                resultado.classList.remove('show');
                mostrarMensajeConsulta(`❌ ${error.message}`, 'error');
            }
        }

        async function consultarBoletosPorEmail() {
            ocultarMensajeConsulta();

            const email = document.getElementById('email_consulta').value.trim();
            const lista = document.getElementById('lista-boletos-email');
            const resultado = document.getElementById('consulta-resultado');

            if (!email) {
                mostrarMensajeConsulta('❌ Escribe el correo electrónico.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/api/ventas-por-email?email=${encodeURIComponent(email)}`);
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'No se encontraron boletos para ese correo');
                }

                if (!data.ventas || !data.ventas.length) {
                    lista.style.display = 'none';
                    resultado.classList.remove('show');
                    mostrarMensajeConsulta('⚠️ No hay boletos registrados con ese correo.', 'error');
                    return;
                }

                lista.innerHTML = `
                    <h3>📋 Boletos encontrados (${data.total})</h3>
                    ${data.ventas.map(v => `
                        <div class="item-boleto-email">
                            <div>
                                <p><strong>Folio:</strong> ${v.folio}</p>
                                <p><strong>Fecha visita:</strong> ${v.fecha_visita ? String(v.fecha_visita).slice(0,10) : 'N/A'}</p>
                                <p><strong>Total:</strong> ${money(v.total)}</p>
                                <p><strong>Estado:</strong> ${v.estado_acceso || 'N/A'}</p>
                            </div>
                            <div>
                                <button class="btn-ver-boleto" onclick="cargarBoletoDesdeLista('${v.folio}')">
                                    Ver boleto
                                </button>
                            </div>
                        </div>
                    `).join('')}
                `;

                lista.style.display = 'block';
                resultado.classList.remove('show');
                mostrarMensajeConsulta('✅ Boletos encontrados correctamente.', 'ok');
                lista.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                lista.style.display = 'none';
                resultado.classList.remove('show');
                mostrarMensajeConsulta(`❌ ${error.message}`, 'error');
            }
        }

        function cargarBoletoDesdeLista(folio) {
            document.getElementById('folio_consulta').value = folio;
            consultarBoleto();
        }

        async function cargarCategorias() {
            const response = await fetch(`${API_BASE}/api/categorias`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'No se pudieron cargar las categorías');
            }

            categorias = data.categorias || [];
            renderTarifas();

            const container = document.getElementById('boletos-container');
            container.innerHTML = '';
            agregarBoleto();
        }

        async function procesarCompra() {
            ocultarMensaje();

            const btnComprar = document.getElementById('btn-comprar');
            const nombre_cliente = document.getElementById('nombre_cliente').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const fecha_visita = document.getElementById('fecha_visita').value;

            if (!nombre_cliente || !email || !telefono || !fecha_visita) {
                mostrarMensaje('Completa todos los datos del formulario.', 'error');
                return;
            }

            const detalles = obtenerDetallesCompra();
            if (!detalles.length) {
                mostrarMensaje('Agrega al menos una categoría con cantidad válida.', 'error');
                return;
            }

            btnComprar.disabled = true;
         btnComprar.textContent = '⏳ Generando reservación...';

            try {
                const response = await fetch(`${API_BASE}/api/venta`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
    nombre_cliente,
    email,
    telefono,
    fecha_visita,
    detalles,
    metodo_pago: 'efectivo',
    canal_venta: 'web',
    observaciones: 'Reservación web pendiente de pago en taquilla'
})
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'No se pudo procesar la compra');
                }

                renderResultadoCompra(data);
            mostrarMensaje('✅ Reservación realizada correctamente. Presenta tu QR en taquilla para confirmar tu pago.', 'ok');

            } catch (error) {
                mostrarMensaje(`❌ ${error.message}`, 'error');
            } finally {
                btnComprar.disabled = false;
           btnComprar.textContent = '🎟️ Reservar Boletos y Generar QR';
            }
        }

        document.addEventListener('DOMContentLoaded', async function () {
            const hoy = new Date().toISOString().split('T')[0];
            const fechaInput = document.getElementById('fecha_visita');
            fechaInput.min = hoy;
            fechaInput.value = hoy;
            fechaInput.addEventListener('change', cargarPromocionesWeb);

            try {
                await cargarCategorias();
                calcularTotales();
                await cargarPromocionesWeb();
            } catch (error) {
                mostrarMensaje(`❌ ${error.message}`, 'error');
            }

            document.getElementById('folio_consulta').addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    consultarBoleto();
                }
            });

            document.getElementById('email_consulta').addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    consultarBoletosPorEmail();
                }
            });
        });
    