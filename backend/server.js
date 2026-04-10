// ============================================
// 🔧 FORZAR IPv4
// ============================================

require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// ============================================
// 📦 IMPORTACIONES
// ============================================
const express = require('express');
const mysql = require('mysql2/promise');
const QRCode = require('qrcode');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;


const PANEL_USER = process.env.PANEL_USER || 'admin';
const PANEL_PASS = process.env.PANEL_PASS || 'Sabinal2026*';
const PANEL_SESSION_HOURS = Number(process.env.PANEL_SESSION_HOURS || 12);

const panelSessions = new Map();
// ============================================
// ⚙️ CONFIG GENERAL
// ============================================
const FRONTEND_DIR = path.join(__dirname, '../frontend'); // ajusta si cambia tu estructura
const QR_DIR = path.join(__dirname, 'qrs');

if (!fs.existsSync(QR_DIR)) {
    fs.mkdirSync(QR_DIR, { recursive: true });
    console.log('📁 Carpeta de QRs creada');
}

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/qrs', express.static(QR_DIR));

app.use((req, res, next) => {
    const protegidas = ['/admin.html', '/lector.html'];

    if (protegidas.includes(req.path)) {
        return requirePanelAuth(req, res, next);
    }

    next();
});

if (fs.existsSync(FRONTEND_DIR)) {
    app.use(express.static(FRONTEND_DIR));
    console.log('🌐 Frontend servido desde:', FRONTEND_DIR);
}
// ============================================
// 🗄️ CONEXIÓN A MySQL
// ============================================
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'zoologicosabinal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ============================================
// 📧 CONFIGURACIÓN DE CORREO
// ⚠️ CAMBIA ESTAS VARIABLES EN TU SISTEMA
// ============================================
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Zoológico El Sabinal';

const smtpHabilitado = Boolean(SMTP_USER && SMTP_PASS);

let transporter = null;

if (smtpHabilitado) {
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
        },
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000,
        lookup: (hostname, options, callback) => {
            dns.lookup(hostname, { family: 4 }, callback);
        }
    });

    transporter.verify((error) => {
        if (error) {
            console.log('❌ Error de conexión SMTP:', error.message);
        } else {
            console.log('✅ Correo SMTP listo');
        }
    });
} else {
    console.log('⚠️ SMTP no configurado. Las ventas sí se registran, pero no se enviarán correos.');
}

// ============================================
// 🧰 HELPERS
// ============================================
function obtenerIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

function generarFolio() {
    const ahora = new Date();
    const y = ahora.getFullYear();
    const m = String(ahora.getMonth() + 1).padStart(2, '0');
    const d = String(ahora.getDate()).padStart(2, '0');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `ZB-${y}${m}${d}-${random}`;
}

function generarQrToken() {
    return `ZQ-${crypto.randomBytes(24).toString('hex')}`;
}
function normalizarCodigoQR(codigo) {
    let limpio = String(codigo || '')
        .normalize('NFKC')
        .toUpperCase()
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[‘’‚‛´`'"]/g, '-')
        .replace(/[‐-‒–—−]/g, '-')
        .replace(/\s+/g, '')
        .replace(/[^A-Z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const mFolio = limpio.match(/^ZB-?(\d{8})-?([A-Z0-9]{6})$/);
    if (mFolio) {
        limpio = `ZB-${mFolio[1]}-${mFolio[2]}`;
    }

    return limpio;
}

function fechaHoyISO() {
    const ahora = new Date();

    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Mexico_City',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(ahora);

    const y = partes.find(p => p.type === 'year').value;
    const m = partes.find(p => p.type === 'month').value;
    const d = partes.find(p => p.type === 'day').value;

    return `${y}-${m}-${d}`;
}

function formatearFecha(fecha) {
    try {
        return new Intl.DateTimeFormat('es-MX', {
            dateStyle: 'full'
        }).format(new Date(fecha));
    } catch {
        return fecha;
    }
}

function limpiarTexto(texto) {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}
function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function parseCookies(req) {
    const raw = req.headers.cookie || '';
    const cookies = {};

    raw.split(';').forEach(parte => {
        const [k, ...v] = parte.split('=');
        if (!k) return;
        cookies[k.trim()] = decodeURIComponent(v.join('=').trim() || '');
    });

    return cookies;
}

function crearPanelSession(username) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (PANEL_SESSION_HOURS * 60 * 60 * 1000);

    panelSessions.set(token, {
        username,
        expiresAt
    });

    return { token, expiresAt };
}

function obtenerPanelSession(req) {
    const cookies = parseCookies(req);
    const token = cookies.panel_session;

    if (!token) return null;

    const session = panelSessions.get(token);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
        panelSessions.delete(token);
        return null;
    }

    return {
        token,
        ...session
    };
}

function limpiarSesionesExpiradas() {
    const ahora = Date.now();
    for (const [token, session] of panelSessions.entries()) {
        if (ahora > session.expiresAt) {
            panelSessions.delete(token);
        }
    }
}

setInterval(limpiarSesionesExpiradas, 10 * 60 * 1000);

function requirePanelAuth(req, res, next) {
    const session = obtenerPanelSession(req);

    if (!session) {
        const aceptaHtml = (req.headers.accept || '').includes('text/html');

        if (aceptaHtml) {
            const nextUrl = encodeURIComponent(req.originalUrl || '/admin.html');
            return res.redirect(`/panel-login?next=${nextUrl}`);
        }

        return res.status(401).json({
            success: false,
            message: 'No autorizado. Inicia sesión en el panel.'
        });
    }

    req.panelUser = session;
    next();
}

function extraerNombreCategoria(textoEntrada) {
    const texto = limpiarTexto(textoEntrada);

    if (texto.includes('adulto mayor')) return 'Adulto Mayor';
    if (texto.includes('infantil')) return 'Infantil';
    if (texto.includes('estudiante')) return 'Estudiante';
    if (texto.includes('nino') || texto.includes('niño')) return 'Niño';
    if (texto.includes('adulto')) return 'Adulto';

    return null;
}

function crearUrlQR(req, folio) {
    return `${req.protocol}://${req.get('host')}/qrs/${encodeURIComponent(folio)}.png`;
}

async function generarYGuardarQR(folio) {
    const qrPath = path.join(QR_DIR, `${folio}.png`);

    await QRCode.toFile(qrPath, folio, {
        width: 520,
        margin: 3,
        errorCorrectionLevel: 'H',
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });

    return qrPath;
}

function construirHtmlCorreo(venta, detalles) {
    const detallesHTML = detalles.map(d => `
        <li style="background:#f8f9fa;margin:6px 0;padding:10px;border-radius:10px;border-left:4px solid #bc6c25;">
            <strong>${d.nombre}</strong> x${d.cantidad} — $${Number(d.subtotal).toFixed(2)} MXN
        </li>
    `).join('');

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <title>Boleto - Zoológico El Sabinal</title>
        </head>
        <body style="font-family:Segoe UI,Arial,sans-serif;background:#f0f0f0;margin:0;padding:20px;">
            <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.18);">
                <div style="background:linear-gradient(145deg,#2d6a4f,#1b4d3d);padding:30px;text-align:center;border-bottom:5px solid #f9b81b;">
                    <h1 style="color:#fff;margin:0;">🦁 ZOOLÓGICO EL SABINAL</h1>
                    <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;">La Trinitaria, Chiapas</p>
                </div>

                <div style="padding:30px;">
                    <div style="background:#fefae0;padding:18px;border-radius:14px;border-left:8px solid #bc6c25;margin-bottom:22px;">
                        <h2 style="margin:0 0 10px;color:#283618;">✅ Compra confirmada</h2>
                        <p style="margin:6px 0;"><strong>Folio:</strong> ${venta.folio}</p>
                        <p style="margin:6px 0;"><strong>Fecha de visita:</strong> ${formatearFecha(venta.fecha_visita)}</p>
                        <p style="margin:6px 0;"><strong>Total pagado:</strong> $${Number(venta.total).toFixed(2)} MXN</p>
                        <p style="margin:6px 0;"><strong>Total de personas:</strong> ${venta.cantidad_personas}</p>
                    </div>

                    <h3 style="color:#283618;border-bottom:3px solid #bc6c25;padding-bottom:8px;">🎟️ Detalle de compra</h3>
                    <ul style="list-style:none;padding:0;margin:0 0 20px 0;">
                        ${detallesHTML}
                    </ul>

                    <div style="text-align:center;margin:25px 0;padding:20px;background:#f8f9fa;border-radius:15px;border:2px dashed #bc6c25;">
                        <p style="font-size:1.1em;color:#2d6a4f;margin-bottom:15px;"><strong>📱 Presenta este QR en la entrada</strong></p>
                        <img src="cid:qr-unico" style="max-width:230px;border:5px solid white;border-radius:20px;box-shadow:0 5px 15px rgba(0,0,0,0.2);" />
                    </div>

                    <div style="background:#283618;color:#fff;padding:18px;border-radius:14px;">
                        <h3 style="color:#f9b81b;margin:0 0 12px 0;">📍 Información importante</h3>
                        <p style="margin:8px 0;">📌 <strong>Dirección:</strong> El Sabinal, La Trinitaria, Chiapas</p>
                        <p style="margin:8px 0;">🕐 <strong>Horario:</strong> Lunes a Domingo - 9:00 AM a 5:00 PM</p>
                        <p style="margin:8px 0;">📞 <strong>Informes:</strong> 963 123 4567</p>
                    </div>

                    <div style="margin-top:20px;padding:14px;background:#fff3cd;border-radius:10px;border-left:5px solid #856404;">
                        <p style="margin:0;color:#856404;">
                            <strong>⚠️ Importante:</strong> este QR corresponde a una compra completa. Es válido para la fecha seleccionada y se marca como usado al ingresar.
                        </p>
                    </div>

                    <p style="text-align:center;margin-top:25px;color:#666;font-size:0.9em;">
                        🌿 Gracias por visitar el Zoológico El Sabinal
                    </p>
                </div>

                <div style="background:#1b4d3d;padding:14px;text-align:center;color:rgba(255,255,255,0.7);font-size:0.8em;">
                    Zoológico El Sabinal © 2026
                </div>
            </div>
        </body>
        </html>
    `;
}

async function enviarCorreoQR({ email, venta, detalles, qrPath }) {
    if (!smtpHabilitado || !transporter) {
        return { enviado: false, motivo: 'SMTP no configurado' };
    }

    const info = await transporter.sendMail({
        from: `${SMTP_FROM_NAME} <${SMTP_USER}>`,
        to: email,
        subject: `🎟️ Tus boletos - ${venta.folio}`,
        html: construirHtmlCorreo(venta, detalles),
        attachments: [
            {
                filename: `${venta.folio}.png`,
                path: qrPath,
                cid: 'qr-unico'
            }
        ]
    });

    return {
        enviado: true,
        respuesta: info.response
    };
}

async function obtenerCategoriasActivas(conn) {
    const [rows] = await conn.query(`
        SELECT id, clave, nombre, precio, requiere_credencial, activo
        FROM categorias
        WHERE activo = 1
        ORDER BY id
    `);
    return rows;
}

async function normalizarDetallesEntrada(conn, body) {
    const detallesEntrada = Array.isArray(body.detalles)
        ? body.detalles
        : Array.isArray(body.boletos)
            ? body.boletos
            : [];

    if (!detallesEntrada.length) {
        throw new Error('No se recibieron categorías para la venta');
    }

    const categorias = await obtenerCategoriasActivas(conn);
    const porId = new Map(categorias.map(c => [Number(c.id), c]));
    const porNombre = new Map(categorias.map(c => [limpiarTexto(c.nombre), c]));

    const detallesNormalizados = [];

    for (const item of detallesEntrada) {
        const cantidad = Number(item.cantidad || 0);

        if (!Number.isFinite(cantidad) || cantidad <= 0) {
            continue;
        }

        let categoria = null;

        if (item.categoria_id) {
            categoria = porId.get(Number(item.categoria_id)) || null;
        } else {
            const nombreDetectado = extraerNombreCategoria(
                item.categoria ||
                item.nombre_categoria ||
                item.nombre ||
                ''
            );

            if (nombreDetectado) {
                categoria = porNombre.get(limpiarTexto(nombreDetectado)) || null;
            }
        }

        if (!categoria) {
            throw new Error(`No se pudo resolver la categoría para: ${JSON.stringify(item)}`);
        }

        const precioUnitario = Number(categoria.precio);
        const subtotal = Number((precioUnitario * cantidad).toFixed(2));

        detallesNormalizados.push({
            categoria_id: Number(categoria.id),
            nombre: categoria.nombre,
            cantidad,
            precio_unitario: precioUnitario,
            subtotal
        });
    }

    if (!detallesNormalizados.length) {
        throw new Error('Todos los renglones de la venta quedaron en cantidad 0');
    }

    // Unificar por categoría por si vienen repetidas
    const agrupados = new Map();

    for (const d of detallesNormalizados) {
        if (!agrupados.has(d.categoria_id)) {
            agrupados.set(d.categoria_id, { ...d });
        } else {
            const actual = agrupados.get(d.categoria_id);
            actual.cantidad += d.cantidad;
            actual.subtotal = Number((actual.cantidad * actual.precio_unitario).toFixed(2));
        }
    }

    return Array.from(agrupados.values());
}

async function obtenerVentaCompletaPorFiltro(filtro, valor) {
    const conn = await pool.getConnection();

    try {
        let where = '';
        if (filtro === 'folio') where = 'v.folio = ?';
        else if (filtro === 'qr_token') where = 'v.qr_token = ?';
        else if (filtro === 'id') where = 'v.id = ?';
        else throw new Error('Filtro no válido');

        const [ventas] = await conn.query(`
            SELECT 
                v.*,
                u.nombre AS usuario_nombre,
                u.apellidos AS usuario_apellidos,
                t.nombre AS taquillero_nombre,
                t.apellidos AS taquillero_apellidos
            FROM ventas v
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            LEFT JOIN usuarios t ON v.taquillero_id = t.id
            WHERE ${where}
            LIMIT 1
        `, [valor]);

        if (!ventas.length) return null;

        const venta = ventas[0];

        const [detalles] = await conn.query(`
            SELECT 
                dv.id,
                dv.categoria_id,
                c.nombre,
                c.clave,
                dv.cantidad,
                dv.precio_unitario,
                dv.subtotal
            FROM detalle_venta dv
            INNER JOIN categorias c ON c.id = dv.categoria_id
            WHERE dv.venta_id = ?
            ORDER BY c.id
        `, [venta.id]);

        const [accesos] = await conn.query(`
            SELECT 
                a.*,
                u.nombre AS taquillero_nombre,
                u.apellidos AS taquillero_apellidos
            FROM accesos a
            LEFT JOIN usuarios u ON a.taquillero_id = u.id
            WHERE a.venta_id = ?
            ORDER BY a.fecha_acceso DESC
        `, [venta.id]);

        return { venta, detalles, accesos };
    } finally {
        conn.release();
    }
}

async function registrarAcceso({
    conn,
    ventaId,
    taquilleroId = null,
    dispositivo = 'Lector QR',
    resultado,
    ip,
    motivoRechazo = null,
    observaciones = null
}) {
    await conn.query(`
        INSERT INTO accesos
        (
            venta_id,
            taquillero_id,
            dispositivo,
            fecha_acceso,
            resultado,
            ip_dispositivo,
            motivo_rechazo,
            observaciones
        )
        VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
    `, [
        ventaId,
        taquilleroId,
        dispositivo,
        resultado,
        ip,
        motivoRechazo,
        observaciones
    ]);
}

// ============================================
// 🔐 LOGIN SIMPLE DEL PANEL
// ============================================
app.get('/panel-login', (req, res) => {
    const nextUrl = String(req.query.next || '/admin.html');

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Acceso al panel</title>
            <style>
                * { box-sizing: border-box; font-family: Segoe UI, Arial, sans-serif; }
                body {
                    margin: 0;
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    background: linear-gradient(145deg, #1b4d3d 0%, #2d6a4f 100%);
                    padding: 20px;
                }
                .card {
                    width: 100%;
                    max-width: 420px;
                    background: white;
                    border-radius: 24px;
                    padding: 28px;
                    box-shadow: 0 20px 40px rgba(0,0,0,.25);
                    border: 2px solid #f9b81b;
                }
                h1 {
                    margin: 0 0 10px;
                    color: #283618;
                    font-size: 1.8rem;
                }
                p {
                    color: #5f6b7a;
                    margin: 0 0 20px;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 700;
                    color: #283618;
                }
                input {
                    width: 100%;
                    padding: 12px 14px;
                    border-radius: 14px;
                    border: 2px solid #d4a373;
                    margin-bottom: 16px;
                    font-size: 1rem;
                    outline: none;
                }
                input:focus {
                    border-color: #bc6c25;
                    box-shadow: 0 0 0 4px rgba(188,108,37,.12);
                }
                button[type="submit"] {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 16px;
                    background: linear-gradient(145deg, #2d6a4f, #1b4332);
                    color: white;
                    font-weight: 800;
                    font-size: 1rem;
                    cursor: pointer;
                    border: 2px solid #f9b81b;
                }
                .error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 2px solid #dc3545;
                    padding: 12px 14px;
                    border-radius: 14px;
                    margin-bottom: 16px;
                    font-weight: 700;
                    opacity: 1;
                    transition: opacity .4s ease, transform .4s ease;
                }
                .error.hide {
                    opacity: 0;
                    transform: translateY(-6px);
                }
                .password-wrap {
                    position: relative;
                    margin-bottom: 16px;
                }
                .password-wrap input {
                    margin-bottom: 0;
                    padding-right: 52px;
                }
                .toggle-pass {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 1.15rem;
                    padding: 6px 8px;
                    border-radius: 10px;
                }
                .toggle-pass:hover {
                    background: rgba(0,0,0,.06);
                }
                .hint {
                    margin-top: 10px;
                    font-size: .9rem;
                    color: #5f6b7a;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <form class="card" method="POST" action="/panel-login">
                <h1>🔐 Acceso al panel</h1>
                <p>Ingresa para abrir admin y lector.</p>

                ${req.query.error ? `<div class="error" id="loginError">❌ Usuario o contraseña incorrectos</div>` : ''}

                <input type="hidden" name="next" value="${nextUrl}">

                <label>Usuario</label>
                <input type="text" name="username" required autocomplete="username">

                <label>Contraseña</label>
                <div class="password-wrap">
                    <input type="password" name="password" id="passwordInput" required autocomplete="current-password">
                    <button type="button" class="toggle-pass" id="togglePass" aria-label="Mostrar contraseña">👁️</button>
                </div>

                <button type="submit">Entrar</button>
                <div class="hint">Zoológico El Sabinal · Acceso privado</div>
            </form>

            <script>
                const passwordInput = document.getElementById('passwordInput');
                const togglePass = document.getElementById('togglePass');

                if (togglePass && passwordInput) {
                    togglePass.addEventListener('click', function () {
                        const visible = passwordInput.type === 'text';
                        passwordInput.type = visible ? 'password' : 'text';
                        togglePass.textContent = visible ? '👁️' : '🙈';
                        togglePass.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
                    });
                }

                const loginError = document.getElementById('loginError');
                if (loginError) {
                    setTimeout(() => {
                        loginError.classList.add('hide');
                    }, 3000);

                    setTimeout(() => {
                        if (loginError && loginError.parentNode) {
                            loginError.parentNode.removeChild(loginError);
                        }
                    }, 3600);
                }
            <\/script>
        </body>
        </html>
    `);
});

app.post('/panel-login', (req, res) => {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    const nextUrl = String(req.body.next || '/admin.html');

    if (username !== PANEL_USER || password !== PANEL_PASS) {
        return res.redirect(`/panel-login?error=1&next=${encodeURIComponent(nextUrl)}`);
    }

    const session = crearPanelSession(username);

    res.setHeader(
        'Set-Cookie',
        `panel_session=${session.token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${PANEL_SESSION_HOURS * 60 * 60}`
    );

    return res.redirect(nextUrl);
});

app.get('/panel-logout', (req, res) => {
    const cookies = parseCookies(req);
    const token = cookies.panel_session;

    if (token) {
        panelSessions.delete(token);
    }

    res.setHeader('Set-Cookie', 'panel_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
    res.redirect('/panel-login');
});

app.get('/api/panel-me', requirePanelAuth, (req, res) => {
    res.json({
        success: true,
        user: {
            username: req.panelUser.username
        }
    });
});

// ============================================
// 🛡️ RUTAS PRIVADAS DEL PANEL
// ============================================
app.use('/api/validar-qr', requirePanelAuth);
app.use('/api/historial-ventas', requirePanelAuth);
app.use('/api/historial-accesos', requirePanelAuth);
app.use('/api/corte-basico', requirePanelAuth);
app.use('/api/estadisticas', requirePanelAuth);
app.use('/api/test-email', requirePanelAuth);

app.use(/^\/api\/ventas\/[^/]+\/cancelar$/, requirePanelAuth);

// ============================================
// 🚑 HEALTHCHECK
// ============================================
app.get('/api/health', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query('SELECT NOW() AS servidor');
        conn.release();

        res.json({
            ok: true,
            mensaje: 'Servidor y base de datos funcionando',
            fecha_servidor: rows[0].servidor
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error de conexión',
            error: error.message
        });
    }
});

// ============================================
// 📂 LISTAR CATEGORÍAS
// ============================================
app.get('/api/categorias', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const categorias = await obtenerCategoriasActivas(conn);
        conn.release();

        res.json({
            success: true,
            categorias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo categorías',
            error: error.message
        });
    }
});

// ============================================
// 🎟️ CREAR VENTA
// Acepta:
// 1) detalles: [{ categoria_id, cantidad }]
// 2) boletos: [{ categoria: "Adulto", cantidad: 2 }]
// ============================================
app.post('/api/venta', async (req, res) => {
    const conn = await pool.getConnection();

    try {
        const {
            usuario_id = null,
            taquillero_id = null,
            corte_id = null,
            nombre_cliente = null,
            email = '',
            telefono = null,
            fecha_visita,
            metodo_pago,
            referencia_pago = null,
            canal_venta = 'web',
            observaciones = null
        } = req.body;

        const canalVentaFinal = String(canal_venta || 'web').toLowerCase() === 'taquilla'
            ? 'taquilla'
            : 'web';

        const emailLimpio = String(email || '').trim();
        const emailFinal = emailLimpio || null;

        if (!fecha_visita) {
            return res.status(400).json({
                success: false,
                message: 'fecha_visita es obligatoria'
            });
        }

        // En venta web sí pedimos correo, en taquilla es opcional
        if (canalVentaFinal === 'web' && !emailFinal) {
            return res.status(400).json({
                success: false,
                message: 'Email es obligatorio para ventas web'
            });
        }

        if (emailFinal && !esEmailValido(emailFinal)) {
            return res.status(400).json({
                success: false,
                message: 'El correo no tiene un formato válido'
            });
        }

        const detalles = await normalizarDetallesEntrada(conn, req.body);

        const cantidadPersonas = detalles.reduce((acc, d) => acc + Number(d.cantidad), 0);
        const total = Number(detalles.reduce((acc, d) => acc + Number(d.subtotal), 0).toFixed(2));

        const folio = generarFolio();
        const qrToken = generarQrToken();

        const metodoPagoFinal = ['efectivo', 'tarjeta', 'transferencia', 'pago_en_linea', 'cortesia']
            .includes(metodo_pago)
            ? metodo_pago
            : (canalVentaFinal === 'taquilla' ? 'efectivo' : 'pago_en_linea');

        const estadoPagoFinal = 'pagado';
        const ipCompra = obtenerIP(req);

        await conn.beginTransaction();

        const [ventaResult] = await conn.query(`
            INSERT INTO ventas
            (
                folio,
                qr_token,
                usuario_id,
                taquillero_id,
                corte_id,
                nombre_cliente,
                email,
                telefono,
                fecha_visita,
                cantidad_personas,
                total,
                metodo_pago,
                referencia_pago,
                estado_pago,
                estado_acceso,
                qr_usado,
                canal_venta,
                ip_compra,
                observaciones,
                fecha_venta
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', 0, ?, ?, ?, NOW())
        `, [
            folio,
            qrToken,
            usuario_id,
            taquillero_id,
            corte_id,
            nombre_cliente,
            emailFinal,
            telefono,
            fecha_visita,
            cantidadPersonas,
            total,
            metodoPagoFinal,
            referencia_pago,
            estadoPagoFinal,
            canalVentaFinal,
            ipCompra,
            observaciones
        ]);

        const ventaId = ventaResult.insertId;

        for (const d of detalles) {
            await conn.query(`
                INSERT INTO detalle_venta
                (
                    venta_id,
                    categoria_id,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES (?, ?, ?, ?, ?)
            `, [
                ventaId,
                d.categoria_id,
                d.cantidad,
                d.precio_unitario,
                d.subtotal
            ]);
        }

        await conn.commit();

        const qrPath = await generarYGuardarQR(folio);
        const qrUrl = crearUrlQR(req, folio);

        let correoEnviado = false;
        let correoInfo = null;

        // Solo intentar correo si sí existe email
        if (emailFinal) {
            try {
                const resultadoCorreo = await enviarCorreoQR({
                    email: emailFinal,
                    venta: {
                        folio,
                        fecha_visita,
                        total,
                        cantidad_personas: cantidadPersonas
                    },
                    detalles,
                    qrPath
                });

                correoEnviado = Boolean(resultadoCorreo.enviado);
                correoInfo = resultadoCorreo;

                if (correoEnviado) {
                    await pool.query(`
                        UPDATE ventas
                        SET correo_enviado = 1,
                            fecha_envio_qr = NOW()
                        WHERE id = ?
                    `, [ventaId]);
                }
            } catch (correoError) {
                correoInfo = {
                    enviado: false,
                    motivo: correoError.message
                };
                console.log('⚠️ La venta se guardó, pero falló el correo:', correoError.message);
            }
        } else {
            correoInfo = {
                enviado: false,
                motivo: 'Venta sin correo; no se envió QR por email'
            };
        }

        res.json({
            success: true,
            message: canalVentaFinal === 'taquilla'
                ? '✅ Venta de taquilla registrada correctamente'
                : '✅ Venta registrada correctamente',
            venta: {
                id: ventaId,
                folio,
                qr_token: qrToken,
                qr_url: qrUrl,
                email: emailFinal,
                fecha_visita,
                cantidad_personas: cantidadPersonas,
                total,
                estado_pago: estadoPagoFinal,
                canal_venta: canalVentaFinal,
                correo_enviado: correoEnviado
            },
            detalles,
            correo: correoInfo
        });
    } catch (error) {
        try { await conn.rollback(); } catch {}
        res.status(500).json({
            success: false,
            message: 'Error procesando la venta',
            error: error.message
        });
    } finally {
        conn.release();
    }
});

// ============================================
// 🔍 VALIDAR QR
// Busca por qr_token o por folio
// ============================================
app.post('/api/validar-qr', async (req, res) => {
    const conn = await pool.getConnection();

    try {
        const {
    codigo_qr,
    taquillero_id = null,
    dispositivo = 'Lector QR',
    observaciones = null
} = req.body;

const codigoNormalizado = normalizarCodigoQR(codigo_qr);
if (!codigoNormalizado) {
            return res.status(400).json({
                valido: false,
                mensaje: 'Debes enviar el código_qr'
            });
        }

        const ip = obtenerIP(req);

        await conn.beginTransaction();

       const [ventas] = await conn.query(`
    SELECT *
    FROM ventas
    WHERE qr_token = ? OR folio = ?
    LIMIT 1
`, [codigoNormalizado, codigoNormalizado]);

        if (!ventas.length) {
            await conn.rollback();
            return res.json({
                valido: false,
                mensaje: '❌ QR no encontrado'
            });
        }

        const venta = ventas[0];

        const [detalles] = await conn.query(`
            SELECT 
                dv.categoria_id,
                c.nombre,
                dv.cantidad,
                dv.precio_unitario,
                dv.subtotal
            FROM detalle_venta dv
            INNER JOIN categorias c ON c.id = dv.categoria_id
            WHERE dv.venta_id = ?
            ORDER BY c.id
        `, [venta.id]);

        const hoy = fechaHoyISO();
        const fechaVentaObj = new Date(venta.fecha_visita);
const fechaVenta = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}).format(fechaVentaObj);

        if (venta.estado_pago !== 'pagado') {
            await registrarAcceso({
                conn,
                ventaId: venta.id,
                taquilleroId: taquillero_id,
                dispositivo,
                resultado: 'rechazado',
                ip,
                motivoRechazo: 'Pago no confirmado',
                observaciones
            });

            await conn.commit();

            return res.json({
                valido: false,
                mensaje: '❌ Pago no confirmado',
               datos: {
    folio: venta.folio,
    email: venta.email,
    telefono: venta.telefono,
    nombre_cliente: venta.nombre_cliente,
    total: venta.total,
    cantidad_personas: venta.cantidad_personas,
    fecha_visita: venta.fecha_visita,
    metodo_pago: venta.metodo_pago,
    detalles
}
            });
        }

        if (venta.estado_acceso === 'usado' || Number(venta.qr_usado) === 1) {
            await registrarAcceso({
                conn,
                ventaId: venta.id,
                taquilleroId: taquillero_id,
                dispositivo,
                resultado: 'rechazado',
                ip,
                motivoRechazo: 'QR ya utilizado',
                observaciones
            });

            await conn.commit();

            return res.json({
                valido: false,
                mensaje: '❌ Este QR ya fue utilizado',
             datos: {
    folio: venta.folio,
    email: venta.email,
    telefono: venta.telefono,
    nombre_cliente: venta.nombre_cliente,
    total: venta.total,
    cantidad_personas: venta.cantidad_personas,
    fecha_visita: venta.fecha_visita,
    metodo_pago: venta.metodo_pago,
    detalles
}
            });
        }

        if (fechaVenta !== hoy) {
            await registrarAcceso({
                conn,
                ventaId: venta.id,
                taquilleroId: taquillero_id,
                dispositivo,
                resultado: 'rechazado',
                ip,
                motivoRechazo: 'Fecha de visita no válida',
                observaciones
            });

            await conn.commit();

            return res.json({
                valido: false,
                mensaje: `❌ Este QR corresponde a la fecha ${fechaVenta}, no a hoy`,
             datos: {
    folio: venta.folio,
    email: venta.email,
    telefono: venta.telefono,
    nombre_cliente: venta.nombre_cliente,
    total: venta.total,
    cantidad_personas: venta.cantidad_personas,
    fecha_visita: venta.fecha_visita,
    metodo_pago: venta.metodo_pago,
    detalles
}
            });
        }
        
const ahoraCDMX = new Date();
const horaActual = Number(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    hour: '2-digit',
    hour12: false
}).format(ahoraCDMX));

if (horaActual < 9 || horaActual >= 17) {
    await registrarAcceso({
        conn,
        ventaId: venta.id,
        taquilleroId: taquillero_id,
        dispositivo,
        resultado: 'rechazado',
        ip,
        motivoRechazo: 'Fuera del horario del zoológico',
        observaciones
    });

    await conn.commit();

    return res.json({
        valido: false,
        mensaje: '❌ Fuera del horario del zoológico (9:00 AM a 5:00 PM)',
     datos: {
    folio: venta.folio,
    email: venta.email,
    telefono: venta.telefono,
    nombre_cliente: venta.nombre_cliente,
    total: venta.total,
    cantidad_personas: venta.cantidad_personas,
    fecha_visita: venta.fecha_visita,
    metodo_pago: venta.metodo_pago,
    detalles
}
    });
}
        await registrarAcceso({
            conn,
            ventaId: venta.id,
            taquilleroId: taquillero_id,
            dispositivo,
            resultado: 'aceptado',
            ip,
            observaciones
        });

        await conn.query(`
            UPDATE ventas
            SET qr_usado = 1,
                estado_acceso = 'usado',
                fecha_uso = NOW()
            WHERE id = ?
        `, [venta.id]);

        await conn.commit();

        res.json({
            valido: true,
            mensaje: '✅ ACCESO PERMITIDO',
            datos: {
                id: venta.id,
                folio: venta.folio,
                email: venta.email,
                telefono: venta.telefono,
                nombre_cliente: venta.nombre_cliente,
                total: Number(venta.total).toFixed(2),
                cantidad_personas: venta.cantidad_personas,
                fecha_visita: venta.fecha_visita,
                metodo_pago: venta.metodo_pago,
                detalles
            }
        });
    } catch (error) {
        try { await conn.rollback(); } catch {}
        res.status(500).json({
            valido: false,
            mensaje: 'Error al validar el QR',
            error: error.message
        });
    } finally {
        conn.release();
    }
});

// ============================================
// 📄 OBTENER DETALLE DE UNA VENTA POR FOLIO
// ============================================
app.get('/api/ventas/:folio', async (req, res) => {
    try {
        const data = await obtenerVentaCompletaPorFiltro('folio', req.params.folio);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        res.json({
            success: true,
            ...data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo la venta',
            error: error.message
        });
    }
});

// ============================================
// 📧 CONSULTAR VENTAS POR EMAIL
// ============================================
app.get('/api/ventas-por-email', async (req, res) => {
    try {
        const email = String(req.query.email || '').trim();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Debes enviar el email'
            });
        }

        const [ventas] = await pool.query(`
            SELECT
                v.id,
                v.folio,
                v.nombre_cliente,
                v.email,
                v.telefono,
                v.fecha_visita,
                v.cantidad_personas,
                v.total,
                v.metodo_pago,
                v.estado_pago,
                v.estado_acceso,
                v.qr_usado,
                v.canal_venta,
                v.fecha_venta
            FROM ventas v
            WHERE v.email = ?
            ORDER BY v.fecha_venta DESC
        `, [email]);

        res.json({
            success: true,
            total: ventas.length,
            ventas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error consultando ventas por email',
            error: error.message
        });
    }
});

// ============================================
// ❌ CANCELAR VENTA POR FOLIO
// ============================================
app.post('/api/ventas/:folio/cancelar', async (req, res) => {
    const conn = await pool.getConnection();

    try {
        const folio = req.params.folio;
        const motivo = (req.body?.motivo || 'Cancelación manual desde panel admin').trim();

        await conn.beginTransaction();

        const [rows] = await conn.query(`
            SELECT *
            FROM ventas
            WHERE folio = ?
            LIMIT 1
        `, [folio]);

        if (!rows.length) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        const venta = rows[0];

        if (String(venta.estado_acceso).toLowerCase() === 'usado' || Number(venta.qr_usado) === 1) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: 'No se puede cancelar una venta ya utilizada'
            });
        }

        if (
            String(venta.estado_pago).toLowerCase() === 'cancelado' ||
            String(venta.estado_acceso).toLowerCase() === 'cancelado'
        ) {
            await conn.rollback();
            return res.status(400).json({
                success: false,
                message: 'La venta ya está cancelada'
            });
        }

        await conn.query(`
            UPDATE ventas
            SET
                estado_pago = 'cancelado',
                estado_acceso = 'cancelado',
                observaciones = CONCAT(
                    IFNULL(observaciones, ''),
                    CASE WHEN IFNULL(observaciones, '') = '' THEN '' ELSE ' | ' END,
                    ?
                )
            WHERE id = ?
        `, [`Cancelada: ${motivo}`, venta.id]);

        await conn.commit();

        res.json({
            success: true,
            message: 'Venta cancelada correctamente'
        });
    } catch (error) {
        try { await conn.rollback(); } catch {}
        res.status(500).json({
            success: false,
            message: 'Error cancelando la venta',
            error: error.message
        });
    } finally {
        conn.release();
    }
});

// ============================================
// 📚 HISTORIAL DE VENTAS
// Filtros opcionales:
// ?fecha=2026-03-31
// ?email=correo@dominio.com
// ?folio=ZB-...
// ?canal_venta=web
// ?estado_pago=pagado
// ?estado_acceso=pendiente
// ?limit=50
// ============================================
app.get('/api/historial-ventas', async (req, res) => {
    try {
        const {
            fecha,
            email,
            folio,
            canal_venta,
            estado_pago,
            estado_acceso,
            usuario_id,
            taquillero_id,
            limit = 100
        } = req.query;

        const condiciones = [];
        const valores = [];

        if (fecha) {
            condiciones.push('DATE(v.fecha_venta) = ?');
            valores.push(fecha);
        }

        if (email) {
            condiciones.push('v.email LIKE ?');
            valores.push(`%${email}%`);
        }

        if (folio) {
            condiciones.push('v.folio LIKE ?');
            valores.push(`%${folio}%`);
        }

        if (canal_venta) {
            condiciones.push('v.canal_venta = ?');
            valores.push(canal_venta);
        }

        if (estado_pago) {
            condiciones.push('v.estado_pago = ?');
            valores.push(estado_pago);
        }

        if (estado_acceso) {
            condiciones.push('v.estado_acceso = ?');
            valores.push(estado_acceso);
        }

        if (usuario_id) {
            condiciones.push('v.usuario_id = ?');
            valores.push(Number(usuario_id));
        }

        if (taquillero_id) {
            condiciones.push('v.taquillero_id = ?');
            valores.push(Number(taquillero_id));
        }

        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT 
                v.id,
                v.folio,
                v.email,
                v.telefono,
                v.nombre_cliente,
                v.fecha_visita,
                v.cantidad_personas,
                v.total,
                v.metodo_pago,
                v.estado_pago,
                v.estado_acceso,
                v.qr_usado,
                v.canal_venta,
                v.fecha_venta,
                u.nombre AS usuario_nombre,
                u.apellidos AS usuario_apellidos,
                t.nombre AS taquillero_nombre,
                t.apellidos AS taquillero_apellidos,
                (
                    SELECT COUNT(*) 
                    FROM accesos a
                    WHERE a.venta_id = v.id
                ) AS total_escaneos
            FROM ventas v
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            LEFT JOIN usuarios t ON v.taquillero_id = t.id
            ${where}
            ORDER BY v.fecha_venta DESC
            LIMIT ?
        `, [...valores, Number(limit)]);

        res.json({
            success: true,
            total: rows.length,
            ventas: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo historial',
            error: error.message
        });
    }
});



// ============================================
// 💰 CORTE BÁSICO
// ============================================
app.get('/api/corte-basico', async (req, res) => {
    try {
        const fecha = req.query.fecha || fechaHoyISO();

        const [ventasRows] = await pool.query(`
            SELECT
                COUNT(*) AS total_operaciones,
                COALESCE(SUM(total), 0) AS monto_total,
                COALESCE(SUM(CASE WHEN metodo_pago = 'efectivo' THEN total ELSE 0 END), 0) AS total_efectivo,
                COALESCE(SUM(CASE WHEN metodo_pago = 'tarjeta' THEN total ELSE 0 END), 0) AS total_tarjeta,
                COALESCE(SUM(CASE WHEN metodo_pago = 'transferencia' THEN total ELSE 0 END), 0) AS total_transferencia,
                COALESCE(SUM(CASE WHEN metodo_pago = 'pago_en_linea' THEN total ELSE 0 END), 0) AS total_pago_en_linea
            FROM ventas
            WHERE DATE(fecha_venta) = ?
              AND estado_pago = 'pagado'
        `, [fecha]);

        const [accesosRows] = await pool.query(`
            SELECT
                COALESCE(SUM(CASE WHEN resultado = 'aceptado' THEN 1 ELSE 0 END), 0) AS accesos_aceptados,
                COALESCE(SUM(CASE WHEN resultado = 'rechazado' THEN 1 ELSE 0 END), 0) AS accesos_rechazados
            FROM accesos
            WHERE DATE(fecha_acceso) = ?
        `, [fecha]);

        res.json({
            success: true,
            fecha,
            ...ventasRows[0],
            ...accesosRows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo corte básico',
            error: error.message
        });
    }
});

// ============================================
// 🚪 HISTORIAL DE ACCESOS
// ============================================
app.get('/api/historial-accesos', async (req, res) => {
    try {
        const {
            fecha,
            resultado,
            folio,
            limit = 100
        } = req.query;

        const condiciones = [];
        const valores = [];

        if (fecha) {
            condiciones.push('DATE(a.fecha_acceso) = ?');
            valores.push(fecha);
        }

        if (resultado) {
            condiciones.push('a.resultado = ?');
            valores.push(resultado);
        }

        if (folio) {
            condiciones.push('v.folio LIKE ?');
            valores.push(`%${folio}%`);
        }

        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

        const [rows] = await pool.query(`
            SELECT
                a.id,
                a.fecha_acceso,
                a.resultado,
                a.dispositivo,
                a.ip_dispositivo,
                a.motivo_rechazo,
                a.observaciones,
                v.folio,
                v.email,
                v.nombre_cliente,
                v.fecha_visita,
                v.total,
                u.nombre AS taquillero_nombre,
                u.apellidos AS taquillero_apellidos
            FROM accesos a
            INNER JOIN ventas v ON v.id = a.venta_id
            LEFT JOIN usuarios u ON u.id = a.taquillero_id
            ${where}
            ORDER BY a.fecha_acceso DESC
            LIMIT ?
        `, [...valores, Number(limit)]);

        res.json({
            success: true,
            total: rows.length,
            accesos: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo historial de accesos',
            error: error.message
        });
    }
});

// ============================================
// 📊 ESTADÍSTICAS DINÁMICAS
// ============================================
app.get('/api/estadisticas', async (req, res) => {
    try {
        const [ventasHoyRows] = await pool.query(`
            SELECT 
                COUNT(*) AS ventas_hoy,
                COALESCE(SUM(total), 0) AS ingresos_hoy
            FROM ventas
            WHERE DATE(fecha_venta) = CURDATE()
              AND estado_pago = 'pagado'
        `);

        const [accesosHoyRows] = await pool.query(`
            SELECT 
                COUNT(*) AS accesos_aceptados_hoy
            FROM accesos
            WHERE DATE(fecha_acceso) = CURDATE()
              AND resultado = 'aceptado'
        `);

        const [pendientesRows] = await pool.query(`
            SELECT 
                COUNT(*) AS pendientes_hoy
            FROM ventas
            WHERE fecha_visita = CURDATE()
              AND estado_pago = 'pagado'
              AND qr_usado = 0
        `);

        const [masVendidaRows] = await pool.query(`
            SELECT 
                c.nombre,
                COALESCE(SUM(dv.cantidad), 0) AS total_vendidos
            FROM detalle_venta dv
            INNER JOIN ventas v ON v.id = dv.venta_id
            INNER JOIN categorias c ON c.id = dv.categoria_id
            WHERE DATE(v.fecha_venta) = CURDATE()
            GROUP BY c.id, c.nombre
            ORDER BY total_vendidos DESC
            LIMIT 1
        `);

        res.json({
            success: true,
            ventas_hoy: Number(ventasHoyRows[0].ventas_hoy || 0),
            ingresos_hoy: Number(ventasHoyRows[0].ingresos_hoy || 0),
            visitantes_actuales: Number(accesosHoyRows[0].accesos_aceptados_hoy || 0),
            qr_pendientes_hoy: Number(pendientesRows[0].pendientes_hoy || 0),
            boletos_mas_vendidos: masVendidaRows.length ? masVendidaRows[0].nombre : 'Sin datos',
            alertas_fraude: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo estadísticas',
            error: error.message
        });
    }
});

// ============================================
// 📧 PROBAR SMTP
// ============================================
app.get('/api/test-email', async (req, res) => {
    try {
        if (!smtpHabilitado || !transporter) {
            return res.json({
                success: false,
                message: 'SMTP no configurado'
            });
        }

        await transporter.verify();
        res.json({
            success: true,
            message: '✅ Conexión SMTP exitosa'
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
});

// ============================================
// 🏠 RUTA BASE
// ============================================
app.get('/', (req, res) => {
    if (fs.existsSync(path.join(FRONTEND_DIR, 'index.html'))) {
        return res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
    }

    res.json({
        ok: true,
        mensaje: 'API Zoológico El Sabinal funcionando'
    });
});

// ============================================
// 🚀 INICIAR SERVIDOR
// ============================================
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Carpeta de QRs: ${QR_DIR}`);

    try {
        const conn = await pool.getConnection();
        await conn.query('SELECT 1');
        conn.release();
        console.log('✅ Conectado a MySQL');
    } catch (error) {
        console.log('❌ Error conectando a MySQL:', error.message);
    }
});