
const API_BASE = '';
let ventaActual = null;
let categoriasTaquilla = [];
let ventaTaquillaActual = null;

let chartCategorias = null;
let chartEstados = null;
let chartCanales = null;
let chartDiasSemana = null;
let chartTendencia = null;
function mostrarUsuarioPanel(username) {
  const box = document.getElementById('panelUsername');
  if (box) {
    box.textContent = username || 'Usuario desconocido';
  }
}
function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function money(value) {
  return '$' + Number(value || 0).toFixed(2);
}

function destruirChart(chart) {
  if (chart) {
    chart.destroy();
  }

  return null;
}

function crearGrafica(ctxId, tipo, labels, data, label, extraOptions = {}) {
  const ctx = document.getElementById(ctxId);

  if (!ctx) return null;

  return new Chart(ctx, {
    type: tipo,
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: tipo !== 'bar' && tipo !== 'line'
        }
      },
      scales: tipo === 'doughnut' || tipo === 'pie'
        ? {}
        : {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          },
      ...extraOptions
    }
  });
}

    function setMessage(id, text, type = 'ok') {
      const box = document.getElementById(id);
      box.className = `message show ${type}`;
      box.textContent = text;
    }

    function clearMessage(id) {
      const box = document.getElementById(id);
      box.className = 'message';
      box.textContent = '';
    }

    function badgeEstado(valor) {
      const v = String(valor || '').toLowerCase();

      if (['pagado', 'usado', 'aceptado'].includes(v)) {
        return `<span class="tag ok">${valor}</span>`;
      }

      if (['pendiente'].includes(v)) {
        return `<span class="tag warn">${valor}</span>`;
      }

      return `<span class="tag bad">${valor}</span>`;
    }

    function cambiarPanel(nombre) {
      document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.panel === nombre);
      });

      document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
      });

      document.getElementById(`panel-${nombre}`).classList.add('active');
    }

    function descargarCSV(nombreArchivo, filas) {
      if (!filas.length) {
        return;
      }

      const encabezados = Object.keys(filas[0]);
      const csv = [
        encabezados.join(','),
        ...filas.map(f =>
          encabezados.map(k => {
            const valor = String(f[k] ?? '').replace(/"/g, '""');
            return `"${valor}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      URL.revokeObjectURL(url);
    }

    function verDetalleDesdeVentas(folio) {
      cambiarPanel('buscar');
      document.getElementById('folioBuscar').value = folio;
      buscarFolio();
    }
    function descargarQRDetalle() {
  if (!ventaActual || !ventaActual.folio) {
    setMessage('msgBuscar', '❌ Primero busca una venta.', 'error');
    return;
  }

  const url = `${API_BASE}/qrs/${encodeURIComponent(ventaActual.folio)}.png`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ventaActual.folio}.png`;
  a.click();
}

function reimprimirDetalle() {
  if (!ventaActual) {
    setMessage('msgBuscar', '❌ Primero busca una venta.', 'error');
    return;
  }

  const detallesHtml = (ventaActual.detalles || []).length
    ? ventaActual.detalles.map(d => `
        <li>${d.nombre} x${d.cantidad} — ${money(d.subtotal)}</li>
      `).join('')
    : '<li>Sin detalle</li>';

  const popup = window.open('', '_blank', 'width=900,height=700');
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Comprobante ${ventaActual.folio}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 24px;
          color: #222;
        }
        .wrap {
          max-width: 720px;
          margin: auto;
          border: 2px solid #d4a373;
          border-radius: 18px;
          padding: 24px;
        }
        h1 {
          margin-top: 0;
          color: #1b4332;
        }
        .qr {
          text-align: center;
          margin: 20px 0;
        }
        .qr img {
          max-width: 220px;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 12px;
        }
        .box {
          background: #f8f9fa;
          padding: 14px;
          border-radius: 12px;
          margin: 10px 0;
        }
        ul { margin: 0; padding-left: 20px; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <h1>🦁 Zoológico El Sabinal</h1>
        <div class="box"><strong>Folio:</strong> ${ventaActual.folio}</div>
        <div class="box"><strong>Cliente:</strong> ${ventaActual.nombre_cliente || 'N/A'}</div>
        <div class="box"><strong>Email:</strong> ${ventaActual.email || 'N/A'}</div>
        <div class="box"><strong>Teléfono:</strong> ${ventaActual.telefono || 'N/A'}</div>
        <div class="box"><strong>Fecha visita:</strong> ${ventaActual.fecha_visita ? String(ventaActual.fecha_visita).slice(0,10) : 'N/A'}</div>
        <div class="box"><strong>Total:</strong> ${money(ventaActual.total)}</div>
        <div class="box"><strong>Método de pago:</strong> ${ventaActual.metodo_pago || 'N/A'}</div>
        <div class="box"><strong>Estado pago:</strong> ${ventaActual.estado_pago || 'N/A'}</div>
        <div class="box"><strong>Estado acceso:</strong> ${ventaActual.estado_acceso || 'N/A'}</div>

        <div class="qr">
          <img src="${API_BASE}/qrs/${encodeURIComponent(ventaActual.folio)}.png" alt="QR">
        </div>

        <div class="box">
          <strong>Detalle de compra</strong>
          <ul>${detallesHtml}</ul>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        }
      <\/script>
    </body>
    </html>
  `);
  popup.document.close();
}

async function cancelarVentaActual() {
  if (!ventaActual || !ventaActual.folio) {
    setMessage('msgBuscar', '❌ Primero busca una venta.', 'error');
    return;
  }

  const confirmado = confirm(`¿Seguro que deseas cancelar la venta ${ventaActual.folio}?`);
  if (!confirmado) return;

  const motivo = prompt('Motivo de cancelación:', 'Cancelación manual desde panel admin');
  if (motivo === null) return;

  try {
    const res = await fetch(`${API_BASE}/api/ventas/${encodeURIComponent(ventaActual.folio)}/cancelar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivo })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'No se pudo cancelar la venta');
    }

    setMessage('msgBuscar', '✅ Venta cancelada correctamente.', 'ok');

    await buscarFolio();
    await cargarVentas();
    await cargarDashboard();
    await cargarCorte();
  } catch (error) {
    setMessage('msgBuscar', '❌ ' + error.message, 'error');
  }
}
async function confirmarPagoActual() {
  if (!ventaActual || !ventaActual.folio) {
    setMessage('msgBuscar', '❌ Primero busca una reservación.', 'error');
    return;
  }

  const confirmado = confirm(`¿Confirmar pago de la reservación ${ventaActual.folio}?`);
  if (!confirmado) return;

  const metodoPago = prompt(
    'Método de pago: efectivo, tarjeta, transferencia o cortesia',
    'efectivo'
  );

  if (metodoPago === null) return;

  const metodoFinal = metodoPago.trim().toLowerCase();

  const metodosValidos = ['efectivo', 'tarjeta', 'transferencia', 'pago_en_linea', 'cortesia'];

  if (!metodosValidos.includes(metodoFinal)) {
    setMessage('msgBuscar', '❌ Método de pago no válido.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/ventas/${encodeURIComponent(ventaActual.folio)}/confirmar-pago`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metodo_pago: metodoFinal,
        referencia_pago: 'Pago confirmado desde panel admin'
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'No se pudo confirmar el pago');
    }

    setMessage('msgBuscar', '✅ Pago confirmado correctamente. Ahora el QR ya puede validarse en el lector.', 'ok');

    await buscarFolio();
    await cargarDashboard();
    await cargarVentas();
    await cargarCorte();

    if (typeof cargarBI === 'function') {
      await cargarBI();
    }
  } catch (error) {
    setMessage('msgBuscar', '❌ ' + error.message, 'error');
  }
}



// ✅ PEGAR AQUÍ
async function registrarEntradaManualActual() {
  if (!ventaActual || !ventaActual.folio) {
    setMessage('msgBuscar', '❌ Primero busca una venta.', 'error');
    return;
  }

  const confirmado = confirm(`¿Registrar entrada manual para el folio ${ventaActual.folio}?`);
  if (!confirmado) return;

  try {
    const res = await fetch(`${API_BASE}/api/ventas/${encodeURIComponent(ventaActual.folio)}/registrar-entrada`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dispositivo: 'Registro manual desde panel admin',
        observaciones: 'Entrada manual de ticket de taquilla'
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'No se pudo registrar la entrada');
    }

    setMessage('msgBuscar', '✅ Entrada registrada correctamente.', 'ok');

    await buscarFolio();
    await cargarDashboard();
    await cargarVentas();
    await cargarAccesos();
    await cargarCorte();

    if (typeof cargarBI === 'function') {
      await cargarBI();
    }
  } catch (error) {
    setMessage('msgBuscar', '❌ ' + error.message, 'error');
  }
}



async function cargarCategoriasTaquilla() {
  clearMessage('msgTaquilla');

  try {
    const res = await fetch(`${API_BASE}/api/categorias`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'No se pudieron cargar las categorías');
    }

    categoriasTaquilla = data.categorias || [];
    renderCategoriasTaquilla();
    recalcularTaquilla();
  } catch (error) {
    document.getElementById('tkCategoriasWrap').innerHTML = 'Error cargando categorías.';
    setMessage('msgTaquilla', '❌ ' + error.message, 'error');
  }
}

function renderCategoriasTaquilla() {
  const wrap = document.getElementById('tkCategoriasWrap');

  const categoriasVisibles = (categoriasTaquilla || []).filter(cat => {
    const clave = String(cat.clave || '').toUpperCase();
    const nombre = String(cat.nombre || '').toLowerCase();
    return clave !== 'NIN' && nombre !== 'niño' && Number(cat.precio || 0) > 0;
  });

  if (!categoriasVisibles.length) {
    wrap.innerHTML = 'No hay categorías activas para taquilla.';
    return;
  }

  wrap.innerHTML = categoriasVisibles.map(cat => `
    <div class="categoria-row">
      <div>
        <div class="cat-nombre">${cat.nombre}</div>
        <small>${cat.clave || ''}</small>
        <small class="cat-desc">
          ${cat.descripcion || ''}
          ${Number(cat.requiere_credencial) === 1 ? ' · Requiere credencial vigente' : ''}
        </small>
      </div>
      <div class="cat-precio">${money(cat.precio)}</div>
      <input
        type="number"
        min="0"
        step="1"
        value="0"
        data-categoria-id="${cat.id}"
        data-precio="${cat.precio}"
        class="tk-cantidad"
        oninput="recalcularTaquilla()"
      >
    </div>
  `).join('');
}

function recalcularTaquilla() {
  const inputs = document.querySelectorAll('.tk-cantidad');
  let totalPersonas = 0;
  let totalMonto = 0;

  inputs.forEach(input => {
    const cantidad = Number(input.value || 0);
    const precio = Number(input.dataset.precio || 0);

    totalPersonas += cantidad;
    totalMonto += cantidad * precio;
  });

  document.getElementById('tkTotalPersonas').textContent = totalPersonas;
  document.getElementById('tkTotalMonto').textContent = money(totalMonto);
}

function limpiarTaquilla() {
  document.getElementById('tkNombre').value = '';
  document.getElementById('tkTelefono').value = '';
  document.getElementById('tkEmail').value = '';
  document.getElementById('tkFecha').value = todayISO();
  document.getElementById('tkMetodoPago').value = 'efectivo';

  document.querySelectorAll('.tk-cantidad').forEach(input => {
    input.value = 0;
  });

  ventaTaquillaActual = null;
  document.getElementById('tkResultado').classList.remove('show');
  clearMessage('msgTaquilla');
  recalcularTaquilla();
}

function obtenerDetallesTaquilla() {
  const inputs = document.querySelectorAll('.tk-cantidad');
  const detalles = [];

  inputs.forEach(input => {
    const cantidad = Number(input.value || 0);
    const categoriaId = Number(input.dataset.categoriaId);

    if (cantidad > 0) {
      detalles.push({
        categoria_id: categoriaId,
        cantidad
      });
    }
  });

  return detalles;
}

async function venderEnTaquilla() {
  clearMessage('msgTaquilla');

  const nombre = document.getElementById('tkNombre').value.trim();
  const telefono = document.getElementById('tkTelefono').value.trim();
  const emailCapturado = document.getElementById('tkEmail').value.trim();
  const fecha = document.getElementById('tkFecha').value;
const metodoPago = 'efectivo';

  const detalles = obtenerDetallesTaquilla();

  if (!fecha) {
    setMessage('msgTaquilla', '❌ Selecciona la fecha de visita.', 'error');
    return;
  }

  if (!detalles.length) {
    setMessage('msgTaquilla', '❌ Debes seleccionar al menos un boleto.', 'error');
    return;
  }

 const emailFinal = emailCapturado || '';

  try {
    const res = await fetch(`${API_BASE}/api/venta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_cliente: nombre || 'Cliente de taquilla',
        email: emailFinal,
        telefono,
        fecha_visita: fecha,
        metodo_pago: metodoPago,
        canal_venta: 'taquilla',
        observaciones: 'Venta en taquilla desde panel admin',
        detalles
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'No se pudo generar la venta');
    }

    ventaTaquillaActual = {
      ...data.venta,
      detalles: data.detalles || [],
      nombre_cliente: nombre || 'Cliente de taquilla',
      telefono,
      metodo_pago: metodoPago,
      email: emailFinal
    };

const detalleTicketHtml = (data.detalles || []).map(d => `
  <div class="ticket-row">
    <span>${d.nombre} x${d.cantidad}</span>
    <strong>${money(d.subtotal)}</strong>
  </div>
`).join('');

document.getElementById('tkResumenVenta').innerHTML = `
  <div class="ticket-preview">
    <h4>🦁 Zoológico El Sabinal</h4>
    <p><strong>Ticket de compra en taquilla</strong></p>

    <div class="ticket-row">
      <span>Folio</span>
      <strong>${data.venta.folio}</strong>
    </div>

    <div class="ticket-row">
      <span>Cliente</span>
      <strong>${nombre || 'Cliente de taquilla'}</strong>
    </div>

    <div class="ticket-row">
      <span>Fecha de visita</span>
      <strong>${data.venta.fecha_visita}</strong>
    </div>

    <div class="ticket-row">
      <span>Método de pago</span>
      <strong>Efectivo</strong>
    </div>

    <div class="ticket-row">
      <span>Estado</span>
      <strong>Pagado</strong>
    </div>

    <hr>

    ${detalleTicketHtml}

    <div class="ticket-total">
      Total pagado: ${money(data.venta.total)}
    </div>

    <p style="margin-top:12px;color:#5f6b7a;">
      Conserva este ticket como comprobante de compra.
    </p>
  </div>
`;

    document.getElementById('tkQrImg').src = data.venta.qr_url;
    document.getElementById('tkResultado').classList.add('show');

    setMessage('msgTaquilla', '✅ Venta en taquilla generada correctamente.', 'ok');

    await cargarDashboard();
    await cargarVentas();
    await cargarCorte();
  } catch (error) {
    setMessage('msgTaquilla', '❌ ' + error.message, 'error');
  }
}

function descargarQRTaquilla() {
  if (!ventaTaquillaActual || !ventaTaquillaActual.folio) {
    setMessage('msgTaquilla', '❌ Primero genera una venta.', 'error');
    return;
  }

  const a = document.createElement('a');
  a.href = `${API_BASE}/qrs/${encodeURIComponent(ventaTaquillaActual.folio)}.png`;
  a.download = `${ventaTaquillaActual.folio}.png`;
  a.click();
}

function imprimirVentaTaquilla() {
  if (!ventaTaquillaActual) {
    setMessage('msgTaquilla', '❌ Primero genera una venta.', 'error');
    return;
  }

  const detallesHtml = (ventaTaquillaActual.detalles || []).length
    ? ventaTaquillaActual.detalles.map(d => `
        <tr>
          <td>${d.nombre || 'Boleto'}</td>
          <td style="text-align:center;">${d.cantidad}</td>
          <td style="text-align:right;">${money(d.precio_unitario)}</td>
          <td style="text-align:right;">${money(d.subtotal)}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="4">Sin detalle</td></tr>';

  const popup = window.open('', '_blank', 'width=420,height=700');

  popup.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Ticket ${ventaTaquillaActual.folio}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: Arial, sans-serif;
          color: #111;
          margin: 0;
          padding: 16px;
          background: #fff;
        }
        .ticket {
          width: 100%;
          max-width: 360px;
          margin: auto;
          border: 1px dashed #111;
          padding: 16px;
        }
        h1 {
          font-size: 20px;
          text-align: center;
          margin: 0 0 6px;
        }
        .center {
          text-align: center;
        }
        .muted {
          color: #555;
          font-size: 12px;
        }
        .line {
          border-top: 1px dashed #111;
          margin: 12px 0;
        }
        .row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin: 6px 0;
          font-size: 13px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 12px;
        }
        th, td {
          padding: 5px 2px;
          border-bottom: 1px solid #eee;
        }
        th {
          text-align: left;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          text-align: right;
          margin-top: 12px;
        }
        .thanks {
          text-align: center;
          font-size: 12px;
          margin-top: 14px;
        }
        @media print {
          body { padding: 0; }
          .ticket { border: none; }
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <h1>🦁 Zoológico El Sabinal</h1>
        <div class="center muted">La Trinitaria, Chiapas</div>
        <div class="center muted">Ticket de compra en taquilla</div>

        <div class="line"></div>

        <div class="row"><span>Folio:</span><strong>${ventaTaquillaActual.folio}</strong></div>
        <div class="row"><span>Cliente:</span><strong>${ventaTaquillaActual.nombre_cliente || 'Cliente de taquilla'}</strong></div>
        <div class="row"><span>Teléfono:</span><strong>${ventaTaquillaActual.telefono || 'N/A'}</strong></div>
        <div class="row"><span>Correo:</span><strong>${ventaTaquillaActual.email || 'N/A'}</strong></div>
        <div class="row"><span>Fecha visita:</span><strong>${String(ventaTaquillaActual.fecha_visita || '').slice(0,10)}</strong></div>
        <div class="row"><span>Método:</span><strong>Efectivo</strong></div>
        <div class="row"><span>Estado:</span><strong>Pagado</strong></div>

        <div class="line"></div>

        <table>
          <thead>
            <tr>
              <th>Boleto</th>
              <th style="text-align:center;">Cant.</th>
              <th style="text-align:right;">Precio</th>
              <th style="text-align:right;">Subt.</th>
            </tr>
          </thead>
          <tbody>
            ${detallesHtml}
          </tbody>
        </table>

        <div class="total">Total: ${money(ventaTaquillaActual.total)}</div>

        <div class="line"></div>

        <div class="thanks">
          Gracias por tu visita 🌿<br>
          Conserva este ticket como comprobante.
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      <\/script>
    </body>
    </html>
  `);

  popup.document.close();
}

function verDetalleTaquilla() {
  if (!ventaTaquillaActual || !ventaTaquillaActual.folio) {
    setMessage('msgTaquilla', '❌ Primero genera una venta.', 'error');
    return;
  }

  cambiarPanel('buscar');
  document.getElementById('folioBuscar').value = ventaTaquillaActual.folio;
  buscarFolio();
}

    async function cargarDashboard() {
      clearMessage('msgDashboard');
      try {
        const res = await fetch(`${API_BASE}/api/estadisticas`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'No se pudieron cargar las estadísticas');
        }

        document.getElementById('cardVentasHoy').textContent = data.ventas_hoy ?? 0;
        document.getElementById('cardIngresosHoy').textContent = money(data.ingresos_hoy);
        document.getElementById('cardAccesosAceptados').textContent = data.visitantes_actuales ?? 0;
        document.getElementById('cardPendientes').textContent = data.qr_pendientes_hoy ?? 0;
        document.getElementById('cardMasVendido').textContent = data.boletos_mas_vendidos || '---';
      } catch (error) {
        setMessage('msgDashboard', '❌ ' + error.message, 'error');
      }
    }

    async function cargarVentas() {
      clearMessage('msgVentas');

      const fecha = document.getElementById('fechaVentas').value;
      const estadoAcceso = document.getElementById('estadoAccesoVentas').value;
      const tbody = document.getElementById('tbodyVentas');

      tbody.innerHTML = '<tr><td colspan="11">Cargando ventas...</td></tr>';

      try {
        const params = new URLSearchParams();
        if (fecha) params.set('fecha', fecha);
        if (estadoAcceso) params.set('estado_acceso', estadoAcceso);
        params.set('limit', '100');

        const res = await fetch(`${API_BASE}/api/historial-ventas?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'No se pudo cargar el historial de ventas');
        }

        if (!data.ventas.length) {
          tbody.innerHTML = '<tr><td colspan="11">No hay ventas para los filtros seleccionados.</td></tr>';
          return;
        }

        tbody.innerHTML = data.ventas.map(v => `
          <tr>
            <td>${v.folio}</td>
            <td>${v.nombre_cliente || 'N/A'}</td>
            <td>${v.email || 'N/A'}</td>
            <td>${v.fecha_visita ? String(v.fecha_visita).slice(0, 10) : 'N/A'}</td>
            <td>${v.cantidad_personas ?? 'N/A'}</td>
            <td>${money(v.total)}</td>
            <td>${badgeEstado(v.estado_pago)}</td>
            <td>${badgeEstado(v.estado_acceso)}</td>
            <td>${v.canal_venta || 'N/A'}</td>
            <td>${v.total_escaneos ?? 0}</td>
            <td>
              <button class="btn btn-secondary" onclick="verDetalleDesdeVentas('${v.folio}')">
                Ver detalle
              </button>
            </td>
          </tr>
        `).join('');
      } catch (error) {
        tbody.innerHTML = '<tr><td colspan="11">Error cargando ventas.</td></tr>';
        setMessage('msgVentas', '❌ ' + error.message, 'error');
      }
    }

    async function cargarAccesos() {
      clearMessage('msgAccesos');

      const fecha = document.getElementById('fechaAccesos').value;
      const resultado = document.getElementById('resultadoAcceso').value;
      const tbody = document.getElementById('tbodyAccesos');

      tbody.innerHTML = '<tr><td colspan="7">Cargando accesos...</td></tr>';

      try {
        const params = new URLSearchParams();
        if (fecha) params.set('fecha', fecha);
        if (resultado) params.set('resultado', resultado);
        params.set('limit', '100');

        const res = await fetch(`${API_BASE}/api/historial-accesos?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'No se pudo cargar el historial de accesos');
        }

        if (!data.accesos.length) {
          tbody.innerHTML = '<tr><td colspan="7">No hay accesos para los filtros seleccionados.</td></tr>';
          return;
        }

        tbody.innerHTML = data.accesos.map(a => `
          <tr>
            <td>${new Date(a.fecha_acceso).toLocaleString('es-MX')}</td>
            <td>${a.folio || 'N/A'}</td>
            <td>${a.nombre_cliente || 'N/A'}</td>
            <td>${a.email || 'N/A'}</td>
            <td>${badgeEstado(a.resultado)}</td>
            <td>${a.dispositivo || 'N/A'}</td>
            <td>${a.motivo_rechazo || '-'}</td>
          </tr>
        `).join('');
      } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7">Error cargando accesos.</td></tr>';
        setMessage('msgAccesos', '❌ ' + error.message, 'error');
      }
    }

    async function buscarFolio() {
  clearMessage('msgBuscar');

  const folio = document.getElementById('folioBuscar').value.trim();
  const card = document.getElementById('detalleVenta');
  const grid = document.getElementById('detalleGrid');
  const detalleLista = document.getElementById('detalleLista');
  const accesosLista = document.getElementById('accesosLista');
  const btnCancelar = document.getElementById('btnCancelarVenta');
  const btnConfirmarPago = document.getElementById('btnConfirmarPago');
  const btnRegistrarEntrada = document.getElementById('btnRegistrarEntrada');

  if (!folio) {
    setMessage('msgBuscar', '❌ Escribe un folio.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/ventas/${encodeURIComponent(folio)}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Venta no encontrada');
    }

    const v = data.venta;
    ventaActual = {
      ...v,
      detalles: data.detalles || [],
      accesos: data.accesos || []
    };

    grid.innerHTML = `
      <div><strong>Folio:</strong><br>${v.folio}</div>
      <div><strong>Cliente:</strong><br>${v.nombre_cliente || 'N/A'}</div>
      <div><strong>Email:</strong><br>${v.email || 'N/A'}</div>
      <div><strong>Teléfono:</strong><br>${v.telefono || 'N/A'}</div>
      <div><strong>Fecha visita:</strong><br>${v.fecha_visita ? String(v.fecha_visita).slice(0,10) : 'N/A'}</div>
      <div><strong>Total:</strong><br>${money(v.total)}</div>
      <div><strong>Pago:</strong><br>${v.estado_pago}</div>
      <div><strong>Acceso:</strong><br>${v.estado_acceso}</div>
      <div><strong>Método de pago:</strong><br>${v.metodo_pago || 'N/A'}</div>
      <div><strong>Personas:</strong><br>${v.cantidad_personas ?? 'N/A'}</div>
    `;

    detalleLista.innerHTML = data.detalles.length
      ? data.detalles.map(d => `<li>${d.nombre} x${d.cantidad} — ${money(d.subtotal)}</li>`).join('')
      : '<li>Sin detalle</li>';

    accesosLista.innerHTML = data.accesos.length
      ? data.accesos.map(a => `
          <li>
            ${new Date(a.fecha_acceso).toLocaleString('es-MX')} —
            ${a.resultado} —
            ${a.dispositivo || 'N/A'}
            ${a.motivo_rechazo ? ` — ${a.motivo_rechazo}` : ''}
          </li>
        `).join('')
      : '<li>Sin accesos registrados</li>';

    // si ya fue usada o cancelada, escondemos cancelar
    const accesoUsado = String(v.estado_acceso || '').toLowerCase() === 'usado';
    const cancelada = String(v.estado_pago || '').toLowerCase() === 'cancelado' ||
                      String(v.estado_acceso || '').toLowerCase() === 'cancelado';

    btnCancelar.style.display = (accesoUsado || cancelada) ? 'none' : 'inline-block';
    const pagoPendiente = String(v.estado_pago || '').toLowerCase() === 'pendiente';

btnConfirmarPago.style.display = (!accesoUsado && !cancelada && pagoPendiente)
  ? 'inline-block'
  : 'none';
  const pagoPagado = String(v.estado_pago || '').toLowerCase() === 'pagado';
const accesoPendiente = String(v.estado_acceso || '').toLowerCase() === 'pendiente';

btnRegistrarEntrada.style.display = (!cancelada && pagoPagado && accesoPendiente)
  ? 'inline-block'
  : 'none';

    card.style.display = 'block';
  } catch (error) {
    ventaActual = null;
    card.style.display = 'none';
    setMessage('msgBuscar', '❌ ' + error.message, 'error');
  }
}
async function cargarBI() {
  clearMessage('msgBI');

  const fecha = document.getElementById('fechaBI').value || todayISO();
  const dias = document.getElementById('rangoBI').value || '30';

  try {
    const params = new URLSearchParams();
    params.set('fecha', fecha);
    params.set('dias', dias);

    const res = await fetch(`${API_BASE}/api/bi-dashboard?${params.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'No se pudo cargar BI');
    }

    const resumen = data.resumen || {};

    document.getElementById('biReservacionesWeb').textContent = resumen.reservaciones_web ?? 0;
    document.getElementById('biVentasTaquilla').textContent = resumen.ventas_taquilla ?? 0;
    document.getElementById('biPendientesPago').textContent = resumen.pendientes_pago ?? 0;
    document.getElementById('biIngresosEstimados').textContent = money(resumen.ingresos_estimados);
    document.getElementById('biIngresosCobrados').textContent = money(resumen.ingresos_cobrados);
    document.getElementById('biConversionPago').textContent = `${resumen.conversion_pago ?? 0}%`;

    document.getElementById('biCategoriaTop').textContent = data.insights?.categoria_top || 'Sin datos';
    document.getElementById('biDiaTop').textContent = data.insights?.dia_top || 'Sin datos';

    document.getElementById('insightCategoria').textContent = data.insights?.mensaje_categoria || 'Sin datos por ahora.';
    document.getElementById('insightDia').textContent = data.insights?.mensaje_dia || 'Sin datos por ahora.';
    document.getElementById('insightPago').textContent = data.insights?.mensaje_pago || 'Sin datos por ahora.';

    const categorias = data.categorias || [];
    const estados = data.estados || [];
    const canales = data.canales || [];
    const diasSemana = data.dias_semana || [];
    const tendencia = data.tendencia_dias || [];

    chartCategorias = destruirChart(chartCategorias);
    chartEstados = destruirChart(chartEstados);
    chartCanales = destruirChart(chartCanales);
    chartDiasSemana = destruirChart(chartDiasSemana);
    chartTendencia = destruirChart(chartTendencia);

    chartCategorias = crearGrafica(
      'chartCategorias',
      'bar',
      categorias.map(c => c.nombre),
      categorias.map(c => c.cantidad),
      'Boletos reservados/vendidos'
    );

    chartEstados = crearGrafica(
      'chartEstados',
      'doughnut',
      estados.map(e => e.estado_pago),
      estados.map(e => e.total),
      'Reservaciones por estado'
    );

    chartCanales = crearGrafica(
      'chartCanales',
      'pie',
      canales.map(c => c.canal_venta === 'web' ? 'Reservación web' : 'Venta taquilla'),
      canales.map(c => c.total),
      'Canal'
    );

    chartDiasSemana = crearGrafica(
      'chartDiasSemana',
      'bar',
      diasSemana.map(d => d.dia_nombre),
      diasSemana.map(d => d.personas),
      'Visitantes esperados'
    );

    chartTendencia = crearGrafica(
      'chartTendencia',
      'line',
      tendencia.map(t => t.fecha_visita),
      tendencia.map(t => t.personas),
      'Visitantes esperados',
      {
        tension: 0.35
      }
    );

    if (!categorias.length && !tendencia.length) {
      setMessage('msgBI', '⚠️ No hay datos suficientes para graficar en esta fecha o rango.', 'error');
    } else {
      setMessage('msgBI', '✅ BI actualizado correctamente.', 'ok');
    }
  } catch (error) {
    setMessage('msgBI', '❌ ' + error.message, 'error');
  }
}
    async function cargarCorte() {
      clearMessage('msgCorte');

      const fecha = document.getElementById('fechaCorte').value;
      try {
        const params = new URLSearchParams();
        if (fecha) params.set('fecha', fecha);

        const res = await fetch(`${API_BASE}/api/corte-basico?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'No se pudo cargar el corte');
        }

        document.getElementById('corteOperaciones').textContent = data.total_operaciones ?? 0;
        document.getElementById('corteMonto').textContent = money(data.monto_total);
        document.getElementById('corteEfectivo').textContent = money(data.total_efectivo);
        document.getElementById('corteTarjeta').textContent = money(data.total_tarjeta);
        document.getElementById('corteTransferencia').textContent = money(data.total_transferencia);
        document.getElementById('corteOnline').textContent = money(data.total_pago_en_linea);
        document.getElementById('corteAceptados').textContent = data.accesos_aceptados ?? 0;
        document.getElementById('corteRechazados').textContent = data.accesos_rechazados ?? 0;
      } catch (error) {
        setMessage('msgCorte', '❌ ' + error.message, 'error');
      }
    }

    async function exportarVentasCSV() {
      try {
        const fecha = document.getElementById('fechaVentas').value;
        const estadoAcceso = document.getElementById('estadoAccesoVentas').value;

        const params = new URLSearchParams();
        if (fecha) params.set('fecha', fecha);
        if (estadoAcceso) params.set('estado_acceso', estadoAcceso);
        params.set('limit', '500');

        const res = await fetch(`${API_BASE}/api/historial-ventas?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'No se pudo exportar ventas');
        }

        const filas = data.ventas.map(v => ({
          folio: v.folio,
          cliente: v.nombre_cliente || '',
          email: v.email || '',
          telefono: v.telefono || '',
          fecha_visita: v.fecha_visita ? String(v.fecha_visita).slice(0, 10) : '',
          cantidad_personas: v.cantidad_personas ?? '',
          total: v.total ?? '',
          estado_pago: v.estado_pago || '',
          estado_acceso: v.estado_acceso || '',
          canal_venta: v.canal_venta || '',
          escaneos: v.total_escaneos ?? 0
        }));

        descargarCSV(`ventas_${fecha || 'todas'}.csv`, filas);
      } catch (error) {
        setMessage('msgVentas', '❌ ' + error.message, 'error');
      }
    }

    async function exportarAccesosCSV() {
      try {
        const fecha = document.getElementById('fechaAccesos').value;
        const resultado = document.getElementById('resultadoAcceso').value;

        const params = new URLSearchParams();
        if (fecha) params.set('fecha', fecha);
        if (resultado) params.set('resultado', resultado);
        params.set('limit', '500');

        const res = await fetch(`${API_BASE}/api/historial-accesos?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'No se pudo exportar accesos');
        }

        const filas = data.accesos.map(a => ({
          fecha_acceso: new Date(a.fecha_acceso).toLocaleString('es-MX'),
          folio: a.folio || '',
          cliente: a.nombre_cliente || '',
          email: a.email || '',
          resultado: a.resultado || '',
          dispositivo: a.dispositivo || '',
          motivo_rechazo: a.motivo_rechazo || ''
        }));

        descargarCSV(`accesos_${fecha || 'todos'}.csv`, filas);
      } catch (error) {
        setMessage('msgAccesos', '❌ ' + error.message, 'error');
      }
    }

    async function exportarCorteCSV() {
      try {
        const fecha = document.getElementById('fechaCorte').value || todayISO();
        const params = new URLSearchParams();
        params.set('fecha', fecha);

        const res = await fetch(`${API_BASE}/api/corte-basico?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'No se pudo exportar el corte');
        }

        const filas = [{
          fecha: data.fecha || fecha,
          total_operaciones: data.total_operaciones ?? 0,
          monto_total: data.monto_total ?? 0,
          total_efectivo: data.total_efectivo ?? 0,
          total_tarjeta: data.total_tarjeta ?? 0,
          total_transferencia: data.total_transferencia ?? 0,
          total_pago_en_linea: data.total_pago_en_linea ?? 0,
          accesos_aceptados: data.accesos_aceptados ?? 0,
          accesos_rechazados: data.accesos_rechazados ?? 0
        }];

        descargarCSV(`corte_${fecha}.csv`, filas);
      } catch (error) {
        setMessage('msgCorte', '❌ ' + error.message, 'error');
      }
    }

  function limpiarBusqueda() {
  ventaActual = null;
  document.getElementById('folioBuscar').value = '';
  document.getElementById('detalleVenta').style.display = 'none';
  clearMessage('msgBuscar');
}
async function verificarSesionPanel() {
  try {
    const res = await fetch(`${API_BASE}/api/panel-me`, {
      credentials: 'same-origin'
    });

    if (!res.ok) {
      window.location.href = '/panel-login?next=' + encodeURIComponent('/admin.html');
      return false;
    }

    const data = await res.json();
if (!data.success) {
  window.location.href = '/panel-login?next=' + encodeURIComponent('/admin.html');
  return false;
}

mostrarUsuarioPanel(data.user?.username || 'admin');
return true;
    return true;
  } catch (error) {
    window.location.href = '/panel-login?next=' + encodeURIComponent('/admin.html');
    return false;
  }
}

    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cambiarPanel(btn.dataset.panel);
      });
    });

    document.getElementById('btnTkHoy').addEventListener('click', () => {
  document.getElementById('tkFecha').value = todayISO();
});

document.getElementById('btnTkLimpiar').addEventListener('click', limpiarTaquilla);
document.getElementById('btnTkVender').addEventListener('click', venderEnTaquilla);
document.getElementById('btnTkDescargarQR').addEventListener('click', descargarQRTaquilla);
document.getElementById('btnTkImprimir').addEventListener('click', imprimirVentaTaquilla);
document.getElementById('btnTkVerDetalle').addEventListener('click', verDetalleTaquilla);

    document.getElementById('btnVentas').addEventListener('click', cargarVentas);
    document.getElementById('btnVentasHoy').addEventListener('click', () => {
      document.getElementById('fechaVentas').value = todayISO();
      cargarVentas();
    });
    document.getElementById('btnExportarVentas').addEventListener('click', exportarVentasCSV);

    document.getElementById('btnAccesos').addEventListener('click', cargarAccesos);
    document.getElementById('btnAccesosHoy').addEventListener('click', () => {
      document.getElementById('fechaAccesos').value = todayISO();
      cargarAccesos();
    });
    document.getElementById('btnExportarAccesos').addEventListener('click', exportarAccesosCSV);

    document.getElementById('btnBuscarFolio').addEventListener('click', buscarFolio);
    document.getElementById('btnLimpiarBusqueda').addEventListener('click', limpiarBusqueda);

    document.getElementById('btnCorte').addEventListener('click', cargarCorte);
    document.getElementById('btnCorteHoy').addEventListener('click', () => {
      document.getElementById('fechaCorte').value = todayISO();
      cargarCorte();
    });
    document.getElementById('btnExportarCorte').addEventListener('click', exportarCorteCSV);
    document.getElementById('btnBI').addEventListener('click', cargarBI);

document.getElementById('btnBIHoy').addEventListener('click', () => {
  document.getElementById('fechaBI').value = todayISO();
  cargarBI();
});

document.getElementById('rangoBI').addEventListener('change', cargarBI);

    document.getElementById('folioBuscar').addEventListener('keydown', e => {
      if (e.key === 'Enter') buscarFolio();
    });
document.getElementById('btnDescargarQRDetalle').addEventListener('click', descargarQRDetalle);
document.getElementById('btnReimprimirDetalle').addEventListener('click', reimprimirDetalle);
document.getElementById('btnConfirmarPago').addEventListener('click', confirmarPagoActual);
document.getElementById('btnCancelarVenta').addEventListener('click', cancelarVentaActual);
document.getElementById('btnRegistrarEntrada').addEventListener('click', registrarEntradaManualActual);

 document.addEventListener('DOMContentLoaded', async () => {
  const ok = await verificarSesionPanel();
  if (!ok) return;

  const hoy = todayISO();
 document.getElementById('fechaVentas').value = hoy;
document.getElementById('fechaAccesos').value = hoy;
document.getElementById('fechaCorte').value = hoy;
document.getElementById('fechaBI').value = hoy;
document.getElementById('tkFecha').value = hoy;

  await cargarCategoriasTaquilla();
await cargarDashboard();
await cargarVentas();
await cargarAccesos();
await cargarCorte();
await cargarBI();

  setInterval(async () => {
    const sigueOk = await verificarSesionPanel();
    if (!sigueOk) return;

    cargarDashboard();

    if (document.getElementById('panel-ventas').classList.contains('active')) {
      cargarVentas();
    }

    if (document.getElementById('panel-accesos').classList.contains('active')) {
      cargarAccesos();
    }

    if (document.getElementById('panel-corte').classList.contains('active')) {
      cargarCorte();
    }
    if (document.getElementById('panel-bi').classList.contains('active')) {
  cargarBI();
}
  }, 30000);
});
