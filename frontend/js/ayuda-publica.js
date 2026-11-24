
/* =====================================================
   CENTRO DE AYUDA PARA VISITANTES
   PARQUE ECOLÓGICO Y RECREATIVO EL SABINAL
   ===================================================== */

(() => {
    "use strict";

    function iniciar() {

        if (document.getElementById("sab-help")) return;

        /* =============================================
           TUTORIALES PARA VISITANTES
           ============================================= */

        const guias = [

            {
                icono: "📅",
                nombre: "Reservaciones en línea",
                descripcion: "Reserva tus boletos antes de visitar el zoológico.",
                pasos: [
                    {
                        titulo: "Consulta las tarifas",
                        texto: "Revisa las categorías y precios disponibles en la página.",
                        objetivo: ".tarifas"
                    },
                    {
                        titulo: "Escribe tu nombre",
                        texto: "Ingresa el nombre completo de la persona que realiza la reservación.",
                        objetivo: "#nombre_cliente"
                    },
                    {
                        titulo: "Datos de contacto",
                        texto: "Escribe tu correo electrónico y un número de teléfono de 10 dígitos. Verifica que sean correctos.",
                        objetivo: "#email"
                    },
                    {
                        titulo: "Selecciona la fecha",
                        texto: "Selecciona el día en que acudirás al zoológico.",
                        objetivo: "#fecha_visita"
                    },
                    {
                        titulo: "Selecciona tus boletos",
                        texto: "Elige las categorías y cantidades correspondientes a las personas que realizarán la visita.",
                        objetivo: "#boletos-container"
                    },
                    {
                        titulo: "Revisa el total",
                        texto: "Comprueba la cantidad de boletos, el subtotal, los descuentos aplicables y el total a pagar.",
                        objetivo: "#total"
                    },
                    {
                        titulo: "Genera tu reservación",
                        texto: "Cuando todos los datos sean correctos, presiona Reservar Boletos y Generar QR. Guarda tu comprobante para presentarlo al llegar.",
                        objetivo: "#btn-comprar"
                    }
                ]
            },

            {
                icono: "🎟️",
                nombre: "Tarifas y boletos",
                descripcion: "Conoce las categorías de entrada.",
                pasos: [
                    {
                        titulo: "Consulta los precios vigentes",
                        texto: "Revisa las tarjetas de tarifas que aparecen en la página principal.",
                        objetivo: ".tarifas"
                    },
                    {
                        titulo: "Menores de cinco años",
                        texto: "Los menores de cinco años tienen entrada gratuita y no requieren boleto.",
                        objetivo: ".tarifas"
                    },
                    {
                        titulo: "Boletos infantiles y adultos",
                        texto: "La categoría infantil corresponde a edades de 5 a 12 años y la categoría adulto de 13 a 59 años.",
                        objetivo: ".tarifas"
                    },
                    {
                        titulo: "Adultos mayores y estudiantes",
                        texto: "La categoría de adulto mayor corresponde a personas de 60 años en adelante. Los estudiantes deberán presentar su credencial vigente.",
                        objetivo: ".tarifas"
                    }
                ]
            },

            {
                icono: "📱",
                nombre: "Mi código QR",
                descripcion: "Aprende a guardar y presentar tu comprobante.",
                pasos: [
                    {
                        titulo: "Generar el código QR",
                        texto: "Al completar correctamente tu reservación, el sistema generará el código QR correspondiente.",
                        objetivo: "#btn-comprar"
                    },
                    {
                        titulo: "Guardar el comprobante",
                        texto: "Desde la ventana de confirmación podrás descargar tu código QR o imprimir el comprobante."
                    },
                    {
                        titulo: "Consultar tu correo",
                        texto: "Revisa el correo electrónico que proporcionaste durante la reservación. Si no encuentras el mensaje, revisa la carpeta de correo no deseado."
                    },
                    {
                        titulo: "Presentar el código QR",
                        texto: "Presenta tu código QR en la taquilla del zoológico el día correspondiente a tu reservación."
                    }
                ]
            },

            {
                icono: "💵",
                nombre: "Formas de pago",
                descripcion: "Reserva ahora y paga al llegar.",
                pasos: [
                    {
                        titulo: "Reservación sin pago en línea",
                        texto: "No necesitas ingresar datos bancarios ni realizar transferencias para reservar tus boletos."
                    },
                    {
                        titulo: "Consultar el importe",
                        texto: "Antes de confirmar tu reservación, verifica el importe total que deberás pagar.",
                        objetivo: "#total"
                    },
                    {
                        titulo: "Pago en efectivo",
                        texto: "Al llegar al zoológico, presenta tu código QR y realiza el pago correspondiente en efectivo en taquilla."
                    },
                    {
                        titulo: "Validación de acceso",
                        texto: "El personal del zoológico verificará tu reservación, el pago y la vigencia del código QR antes de permitir el ingreso."
                    }
                ]
            },

            {
                icono: "🔎",
                nombre: "Consultar mi boleto",
                descripcion: "Recupera el comprobante de tu reservación.",
                pasos: [
                    {
                        titulo: "Buscar por folio",
                        texto: "Introduce el folio de tu reservación y selecciona Buscar boleto.",
                        objetivo: "#folio_consulta"
                    },
                    {
                        titulo: "Buscar por correo electrónico",
                        texto: "Si no recuerdas tu folio, introduce el correo electrónico utilizado durante tu reservación y selecciona Buscar por correo.",
                        objetivo: "#email_consulta"
                    },
                    {
                        titulo: "Seleccionar el boleto",
                        texto: "Si aparecen varios resultados, selecciona Ver boleto en la reservación correspondiente a tu visita."
                    },
                    {
                        titulo: "Recuperar el comprobante",
                        texto: "Consulta los datos de tu reservación y utiliza las opciones disponibles para descargar el QR o imprimir el boleto."
                    }
                ]
            },

            {
                icono: "🎉",
                nombre: "Promociones",
                descripcion: "Consulta los descuentos disponibles.",
                pasos: [
                    {
                        titulo: "Seleccionar la fecha",
                        texto: "Selecciona la fecha en que deseas visitar el zoológico.",
                        objetivo: "#fecha_visita"
                    },
                    {
                        titulo: "Consultar promociones",
                        texto: "Si existe una promoción activa, revisa las condiciones y categorías participantes.",
                        objetivo: ".zoo-header"
                    },
                    {
                        titulo: "Verificar el descuento",
                        texto: "Comprueba que el descuento correspondiente aparezca en el resumen de tu reservación.",
                        objetivo: "#total"
                    },
                    {
                        titulo: "Consideraciones importantes",
                        texto: "Las promociones dependen de su vigencia y condiciones. El pago se realiza en efectivo al llegar al zoológico."
                    }
                ]
            },

            {
                icono: "🕐",
                nombre: "Horarios y ubicación",
                descripcion: "Organiza tu próxima visita.",
                pasos: [
                    {
                        titulo: "Horario de atención",
                        texto: "Consulta el horario publicado en la página principal del zoológico antes de realizar tu visita.",
                        objetivo: ".zoo-info"
                    },
                    {
                        titulo: "Ubicación del zoológico",
                        texto: "El Parque Ecológico y Recreativo El Sabinal se encuentra en La Trinitaria, Chiapas.",
                        objetivo: ".zoo-info"
                    },
                    {
                        titulo: "Información de contacto",
                        texto: "Consulta los datos de contacto publicados en la página para resolver dudas relacionadas con tu visita.",
                        objetivo: ".zoo-info"
                    }
                ]
            },

            {
                icono: "🐯",
                nombre: "Nuestros animales",
                descripcion: "Conoce los animales del zoológico.",
                pasos: [
                    {
                        titulo: "Ingresar al catálogo",
                        texto: "Selecciona la opción Ver animales del zoológico para conocer las especies disponibles.",
                        objetivo: ".btn-ver-animales"
                    },
                    {
                        titulo: "Explorar los animales",
                        texto: "Consulta las fotografías y la información sobre las especies, su alimentación y hábitat.",
                        enlace: "/animales.html",
                        boton: "Ver animales del zoológico"
                    },
                    {
                        titulo: "Durante tu visita",
                        texto: "Respeta las indicaciones del personal, las áreas delimitadas y las normas de cuidado de los animales."
                    }
                ]
            },

            {
                icono: "📋",
                nombre: "Donación de animales",
                descripcion: "Conoce el procedimiento para solicitar una donación.",
                pasos: [
                    {
                        titulo: "Abrir el formulario",
                        texto: "Ingresa al formulario de solicitud de donación de animales.",
                        enlace: "/donaciones.html",
                        boton: "Abrir formulario de donación"
                    },
                    {
                        titulo: "Registrar los datos del donante",
                        texto: "Completa tu nombre, teléfono y correo electrónico."
                    },
                    {
                        titulo: "Registrar los datos del animal",
                        texto: "Proporciona la información solicitada sobre la especie, edad, procedencia y condiciones del animal."
                    },
                    {
                        titulo: "Motivo de la donación",
                        texto: "Explica el motivo por el que deseas donar al animal y agrega las observaciones correspondientes."
                    },
                    {
                        titulo: "Enviar la solicitud",
                        texto: "Verifica la información y selecciona Enviar solicitud de donación."
                    },
                    {
                        titulo: "Esperar la revisión",
                        texto: "El envío del formulario no significa que la donación haya sido aceptada. No traslades ni entregues al animal sin recibir indicaciones del personal autorizado."
                    }
                ]
            },

            {
                icono: "❓",
                nombre: "Preguntas frecuentes",
                descripcion: "Resuelve las dudas más comunes.",
                pasos: [
                    {
                        titulo: "¿No recibiste tu correo?",
                        texto: "Revisa la carpeta de spam o correo no deseado. También puedes consultar tu boleto utilizando el correo registrado.",
                        objetivo: "#email_consulta"
                    },
                    {
                        titulo: "¿Debo pagar por internet?",
                        texto: "No. Las reservaciones se realizan en línea, pero el pago se realiza en efectivo en taquilla."
                    },
                    {
                        titulo: "¿Puedo imprimir mi código QR?",
                        texto: "Sí. Puedes utilizar las opciones de descarga o impresión disponibles en tu comprobante."
                    },
                    {
                        titulo: "¿Qué pasa si olvidé mi folio?",
                        texto: "Puedes buscar tu reservación utilizando el correo electrónico que registraste.",
                        objetivo: "#email_consulta"
                    },
                    {
                        titulo: "¿Tengo otra duda?",
                        texto: "Comunícate con el personal del zoológico mediante los datos de contacto publicados en la página.",
                        objetivo: ".zoo-info"
                    }
                ]
            }

        ];

        /* =============================================
           ESTILOS DEL CENTRO DE AYUDA PÚBLICO
           ============================================= */

        const estilos = document.createElement("style");

        estilos.textContent = `

            #sab-help-launch {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9000;
                background: #185c3b;
                color: white;
                border: 2px solid #e4b84c;
                border-radius: 40px;
                padding: 15px 22px;
                font: bold 15px Arial, sans-serif;
                cursor: pointer;
                box-shadow: 0 6px 20px #0003;
                transition: .2s ease;
            }

            #sab-help-launch:hover {
                background: #123e2d;
                transform: translateY(-3px);
            }

            #sab-help {
                width: min(1100px, 94vw);
                max-width: 94vw;
                max-height: 90vh;
                padding: 0;
                border: 0;
                border-radius: 22px;
                background: #f2f6f3;
                color: #163e2d;
                font: 16px/1.5 Arial, sans-serif;
                box-shadow: 0 20px 80px #0005;
                overflow: hidden;
                margin: auto;
                box-sizing: border-box;
                text-align: left;
            }

            #sab-help[open] {
                display: flex;
                flex-direction: column;
            }

            #sab-help::backdrop {
                background: #102c23aa;
                backdrop-filter: blur(4px);
            }

            #sab-help * {
                box-sizing: border-box;
            }

            #sab-help header {
                background: linear-gradient(
                    120deg,
                    #123e2d,
                    #236e49
                );
                color: white;
                padding: 26px;
                border-bottom: 4px solid #e4b84c;
                position: relative;
                flex-shrink: 0;
            }

            #sab-help header small {
                color: #f6d477;
                font-weight: bold;
                letter-spacing: 1px;
                font-size: 12px;
            }

            #sab-help h2 {
                font-size: 30px;
                color: white;
                margin: 8px 40px 8px 0;
            }

            #sab-help header p {
                margin: 0 0 18px;
                color: #e1eee5;
                font-size: 14px;
            }

            #sab-help input {
                width: 100%;
                background: white;
                color: #163e2d;
                border: 1px solid #d4e1d7;
                border-radius: 12px;
                padding: 14px;
                font: inherit;
                outline: none;
            }

            #sab-help input:focus {
                outline: 3px solid #e4b84c;
            }

            #sab-help button,
            #sab-help a.sh-action {
                font: inherit;
                cursor: pointer;
                border-radius: 10px;
                padding: 12px 16px;
                border: 1px solid #cddbd1;
                background: white;
                color: #185c3b;
                text-decoration: none;
            }

            #sab-help button:disabled {
                opacity: .45;
                cursor: not-allowed;
            }

            #sab-help button.sh-primary,
            #sab-help a.sh-action {
                background: #185c3b;
                color: white;
                font-weight: bold;
            }

            #sab-help button.sh-primary:hover,
            #sab-help a.sh-action:hover {
                background: #123e2d;
            }

            #sab-help .sh-close {
                position: absolute;
                right: 15px;
                top: 15px;
                background: transparent;
                color: white;
                border-color: #ffffff66;
                width: 40px;
                height: 40px;
                padding: 0;
                font-size: 20px;
            }

            #sab-help .sh-body {
                padding: 24px;
                overflow: auto;
                min-height: 0;
                flex: 1;
                overscroll-behavior: contain;
            }

            #sab-help .sh-grid {
                display: grid;
                grid-template-columns:
                    repeat(auto-fit, minmax(230px, 1fr));
                gap: 16px;
            }

            #sab-help .sh-card {
                text-align: left;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
                padding: 20px;
                border-radius: 16px;
                transition: .2s ease;
            }

            #sab-help .sh-card:hover {
                border-color: #185c3b;
                transform: translateY(-3px);
                box-shadow: 0 5px 16px #185c3b15;
            }

            #sab-help .sh-card span {
                font-size: 28px;
                background: #e8f2eb;
                border-radius: 12px;
                padding: 8px 12px;
            }

            #sab-help .sh-card small {
                color: #52665a;
                font-size: 13px;
                line-height: 1.6;
            }

            #sab-help .sh-card b {
                font-size: 18px;
                color: #123e2d;
            }

            #sab-help .sh-card strong {
                font-size: 13px;
                margin-top: auto;
                padding-top: 8px;
            }

            #sab-help .sh-note {
                background: #fff8e6;
                border: 1px solid #dfcc95;
                border-left: 5px solid #e4b84c;
                padding: 18px;
                border-radius: 12px;
                margin-bottom: 22px;
                color: #66501b;
            }

            #sab-help .sh-step {
                background: white;
                border: 1px solid #d4e1d7;
                border-radius: 16px;
                padding: 24px;
                margin: 16px 0;
                min-height: 150px;
            }

            #sab-help .sh-step h3 {
                color: #185c3b;
                margin-top: 0;
                font-size: 22px;
            }
#sab-help .sh-imagen-tutorial {
    margin: 20px 0;
    padding: 12px;
    background: #f2f6f3;
    border: 2px solid #e4b84c;
    border-radius: 14px;
    overflow: hidden;
}

#sab-help .sh-imagen-tutorial img {
    display: block;
    width: 100%;
    max-height: 450px;
    object-fit: contain;
    border-radius: 8px;
}

#sab-help .sh-imagen-tutorial small {
    display: block;
    text-align: center;
    margin-top: 10px;
    color: #52665a;
    font-size: 12px;
}
            #sab-help .sh-step p {
                line-height: 1.8;
                color: #34483b;
            }

            #sab-help .sh-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                margin-top: 16px;
            }

            #sab-help .sh-nav {
                justify-content: space-between;
            }

            #sab-help progress {
                width: 100%;
                height: 12px;
                accent-color: #185c3b;
            }

            #sab-help footer {
                padding: 14px;
                text-align: center;
                background: white;
                color: #52665a;
                font-size: 13px;
                border-top: 1px solid #d4e1d7;
                flex-shrink: 0;
            }

            #sab-help .sh-faq {
                margin-top: 28px;
            }

            #sab-help details {
                background: white;
                border: 1px solid #d4e1d7;
                border-radius: 12px;
                margin-bottom: 10px;
                overflow: hidden;
            }

            #sab-help summary {
                padding: 16px;
                cursor: pointer;
                font-weight: bold;
                color: #185c3b;
            }

            #sab-help details[open] summary {
                background: #e8f2eb;
            }

            #sab-help details p {
                padding: 0 16px;
                font-size: 14px;
                line-height: 1.7;
            }

            #sab-help .sh-aviso {
                color: #865b13;
                font-size: 14px;
            }

            #sab-help button:focus-visible,
            #sab-help a:focus-visible,
            #sab-help summary:focus-visible {
                outline: 3px solid #e4b84c;
                outline-offset: 3px;
            }

            .sab-help-highlight {
                outline: 4px solid #e4b84c !important;
                outline-offset: 4px !important;
                box-shadow: 0 0 0 8px #e4b84c35 !important;
                scroll-margin: 90px;
            }

            @media (max-width: 600px) {

                #sab-help {
                    max-height: 95vh;
                    border-radius: 14px;
                }

                #sab-help header,
                #sab-help .sh-body {
                    padding: 16px;
                }

                #sab-help header small {
                    font-size: 10px;
                    display: block;
                    padding-right: 35px;
                }

                #sab-help h2 {
                    font-size: 23px;
                }

                #sab-help .sh-grid {
                    grid-template-columns: 1fr;
                }

                #sab-help .sh-step {
                    padding: 18px;
                }

                #sab-help-launch {
                    bottom: 12px;
                    right: 12px;
                    padding: 12px 17px;
                    font-size: 13px;
                }

                #sab-help .sh-nav button {
                    flex: 1;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                #sab-help *,
                #sab-help-launch {
                    transition: none !important;
                }
            }

            @media print {
                #sab-help,
                #sab-help-launch {
                    display: none !important;
                }
            }

        `;

        document.head.appendChild(estilos);

        /* =============================================
           CREAR BOTÓN FLOTANTE
           ============================================= */

        const flotante = document.createElement("button");

        flotante.id = "sab-help-launch";
        flotante.type = "button";
        flotante.textContent = "❔ ¿Necesitas ayuda?";

        flotante.setAttribute(
            "aria-label",
            "Abrir centro de ayuda"
        );

        /* =============================================
           CREAR VENTANA PRINCIPAL
           ============================================= */

        const ventana = document.createElement("dialog");

        ventana.id = "sab-help";

        ventana.setAttribute(
            "aria-labelledby",
            "sh-title"
        );

        ventana.innerHTML = `

            <header>

                <small>
                    🦁 PARQUE ECOLÓGICO Y RECREATIVO EL SABINAL
                </small>

                <button
                    type="button"
                    class="sh-close"
                    aria-label="Cerrar ayuda"
                >
                    ×
                </button>

                <h2 id="sh-title">
                    ¿Cómo podemos ayudarte?
                </h2>

                <p>
                    Encuentra toda la información que necesitas
                    para organizar tu próxima visita.
                </p>

                <input
                    type="search"
                    aria-label="Buscar instrucciones"
                    placeholder="🔎 Buscar información sobre tu visita..."
                    autocomplete="off"
                >

            </header>

            <div class="sh-body"></div>

            <footer>
                Centro de ayuda · Parque Ecológico y Recreativo El Sabinal
            </footer>

        `;

        document.body.appendChild(flotante);
        document.body.appendChild(ventana);

        /* =============================================
           VARIABLES DEL CENTRO DE AYUDA
           ============================================= */

        const contenido = ventana.querySelector(".sh-body");

        const buscador = ventana.querySelector("input");

        const cerrar = ventana.querySelector(".sh-close");

        let guiaActual = -1;
        let pasoActual = 0;
        let elementoResaltado = null;
        let temporizador = null;

        /* =============================================
           FUNCIONES AUXILIARES
           ============================================= */

        function normalizar(texto) {

            return String(texto)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
        }

        function crearBoton(texto, accion, clase = "") {

            const boton = document.createElement("button");

            boton.type = "button";
            boton.textContent = texto;
            boton.className = clase;

            boton.addEventListener("click", accion);

            return boton;
        }

        function limpiarResaltado() {

            clearTimeout(temporizador);

            if (elementoResaltado) {

                elementoResaltado.classList.remove(
                    "sab-help-highlight"
                );

                elementoResaltado = null;
            }
        }

        /* =============================================
           MOSTRAR GUÍAS Y BUSCADOR
           ============================================= */

        function mostrarInicio() {

            guiaActual = -1;
            pasoActual = 0;

            flotante.textContent = "❔ ¿Necesitas ayuda?";

            const consulta = normalizar(buscador.value);

            contenido.innerHTML = `

                <div class="sh-note">

                    <strong>
                        💡 Información importante
                    </strong>

                    <p>
                        Reserva tus boletos en línea y realiza
                        el pago en efectivo al llegar a la taquilla.
                        No necesitas pagar por internet.
                    </p>

                </div>

                <h3>
                    ${consulta
                        ? "Resultados de búsqueda"
                        : "¿Qué necesitas hacer?"}
                </h3>

                <p id="sh-resultados"></p>

                <div class="sh-grid"></div>

            `;

            const grid = contenido.querySelector(".sh-grid");

            let encontrados = 0;

            guias.forEach((guia, indice) => {

                const texto = [

                    guia.nombre,
                    guia.descripcion,

                    ...guia.pasos.map(
                        paso => paso.titulo + " " + paso.texto
                    )

                ].join(" ");

                if (!normalizar(texto).includes(consulta)) {
                    return;
                }

                encontrados++;

                const tarjeta = crearBoton(

                    "",

                    () => {

                        guiaActual = indice;
                        pasoActual = 0;

                        buscador.value = "";

                        mostrarPaso();
                    },

                    "sh-card"
                );

                tarjeta.innerHTML = `

                    <span>${guia.icono}</span>

                    <b>${guia.nombre}</b>

                    <small>${guia.descripcion}</small>

                    <strong>
                        Ver tutorial · ${guia.pasos.length} pasos →
                    </strong>

                `;

                grid.appendChild(tarjeta);

            });

            contenido.querySelector(
                "#sh-resultados"
            ).textContent = encontrados + " guías disponibles.";

            if (encontrados === 0) {

                grid.textContent =
                    "No encontramos resultados. " +
                    "Intenta buscar QR, pago, boletos o reservación.";
            }

            /* PREGUNTAS FRECUENTES DESPLEGABLES */

            const preguntas = guias.find(
                guia => guia.nombre === "Preguntas frecuentes"
            );

            const resultadosFAQ = preguntas.pasos.filter(
                paso => normalizar(
                    paso.titulo + " " + paso.texto
                ).includes(consulta)
            );

            if (resultadosFAQ.length) {

                const seccion = document.createElement("section");

                seccion.className = "sh-faq";

                seccion.innerHTML = `

                    <h3>Preguntas frecuentes</h3>

                    ${resultadosFAQ.map(paso => `

                        <details>

                            <summary>
                                ${paso.titulo}
                            </summary>

                            <p>
                                ${paso.texto}
                            </p>

                        </details>

                    `).join("")}

                `;

                contenido.appendChild(seccion);
            }

            contenido.scrollTop = 0;
        }

        /* =============================================
           MOSTRAR TUTORIAL PASO A PASO
           ============================================= */

        function mostrarPaso() {

            if (guiaActual < 0) return;

            const guia = guias[guiaActual];

            const paso = guia.pasos[pasoActual];

            const total = guia.pasos.length;

            const ultimo = pasoActual === total - 1;
            const imagenesReservacion = [
    "tarifas.png",
    "nombre.png",
    "contacto.png",
    "fecha.png",
    "boletos.png",
    "total.png",
    "reservar.png"
];

const imagenTutorial =
    guia.nombre === "Reservaciones en línea"
        ? "/img/ayuda/publica/" + imagenesReservacion[pasoActual]
        : "";

            contenido.innerHTML = `

                <div class="sh-actions sh-back"></div>

                <h3>
                    ${guia.icono} ${guia.nombre}
                </h3>

                <p>${guia.descripcion}</p>

                <p>
                    <strong>
                        Paso ${pasoActual + 1} de ${total}
                    </strong>
                </p>

                <progress
                    max="${total}"
                    value="${pasoActual + 1}"
                    aria-label="Progreso del tutorial"
                ></progress>

                <div class="sh-step">

                    <h3>
                        ${pasoActual + 1}. ${paso.titulo}
                    </h3>

                    <p>${paso.texto}</p>
                    ${imagenTutorial ? `
    <div class="sh-imagen-tutorial">
        <img
            src="${imagenTutorial}"
            alt="${paso.titulo}"
            loading="lazy"
        >
        <small>
            Referencia visual del sistema El Sabinal.
        </small>
    </div>
` : ""}

                    <div class="sh-actions sh-target"></div>

                </div>

                <div class="sh-actions sh-nav"></div>

            `;

            /* REGRESAR A LAS GUÍAS */

            contenido.querySelector(".sh-back").appendChild(

                crearBoton(

                    "← Todas las guías",

                    () => {

                        buscador.value = "";

                        mostrarInicio();
                    }
                )
            );

            /* UBICAR ELEMENTOS */

            const acciones = contenido.querySelector(".sh-target");

            if (paso.objetivo) {

                acciones.appendChild(

                    crearBoton(

                        "📍 Ubicar en la página",

                        () => ubicarElemento(paso.objetivo),

                        "sh-primary"
                    )
                );
            }

            /* ENLACES A OTRAS PÁGINAS */

            if (paso.enlace) {

                const enlace = document.createElement("a");

                enlace.href = paso.enlace;
                enlace.className = "sh-action";

                enlace.textContent =
                    paso.boton || "Abrir página";

                acciones.appendChild(enlace);
            }

            /* BOTONES ANTERIOR Y SIGUIENTE */

            const navegacion = contenido.querySelector(".sh-nav");

            const anterior = crearBoton(

                "← Anterior",

                () => {

                    if (pasoActual > 0) {

                        pasoActual--;

                        mostrarPaso();
                    }
                }
            );

            anterior.disabled = pasoActual === 0;

            navegacion.appendChild(anterior);

            navegacion.appendChild(

                crearBoton(

                    ultimo ? "✓ Finalizar" : "Siguiente →",

                    () => {

                        if (ultimo) {

                            finalizarTutorial();

                        } else {

                            pasoActual++;

                            mostrarPaso();
                        }
                    },

                    "sh-primary"
                )
            );

            contenido.scrollTop = 0;
        }

        /* =============================================
           RESALTAR ELEMENTOS DE LA PÁGINA
           ============================================= */

        function ubicarElemento(selector) {

            const elemento = document.querySelector(selector);

            if (
                !elemento ||
                elemento.getClientRects().length === 0
            ) {

                const avisoAnterior = contenido.querySelector(
                    ".sh-aviso"
                );

                if (avisoAnterior) {
                    avisoAnterior.remove();
                }

                const aviso = document.createElement("p");

                aviso.className = "sh-aviso";

                aviso.setAttribute("role", "status");

                aviso.textContent =
                    "Este elemento no está visible en este momento. " +
                    "Puedes continuar consultando las instrucciones.";

                contenido.querySelector(
                    ".sh-step"
                ).appendChild(aviso);

                return;
            }

            limpiarResaltado();

            ventana.close();

            elementoResaltado = elemento;

            elemento.classList.add("sab-help-highlight");

            elemento.scrollIntoView({

                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",

                block: "center"

            });

            flotante.textContent = "📘 Continuar tutorial";

            temporizador = setTimeout(

                limpiarResaltado,

                7000
            );
        }

        /* =============================================
           FINALIZAR TUTORIAL
           ============================================= */

        function finalizarTutorial() {

            const nombre = guias[guiaActual].nombre;

            guiaActual = -1;
            pasoActual = 0;

            flotante.textContent = "❔ ¿Necesitas ayuda?";

            contenido.innerHTML = `

                <div class="sh-step"
                     style="text-align:center;padding:35px 20px;">

                    <div style="font-size:55px;">
                        ✅
                    </div>

                    <h3>¡Tutorial completado!</h3>

                    <p>
                        Has terminado la guía de
                        <strong>${nombre}</strong>.
                    </p>

                    <p>
                        Gracias por utilizar el Centro de ayuda
                        del Parque Ecológico y Recreativo El Sabinal.
                    </p>

                    <div class="sh-final"></div>

                </div>

            `;

            contenido.querySelector(".sh-final").appendChild(

                crearBoton(

                    "Explorar otras guías",

                    () => {

                        buscador.value = "";

                        mostrarInicio();
                    },

                    "sh-primary"
                )
            );

            contenido.scrollTop = 0;
        }

        /* =============================================
           ABRIR Y CERRAR EL CENTRO DE AYUDA
           ============================================= */

        flotante.addEventListener("click", () => {

            if (ventana.open) return;

            limpiarResaltado();

            ventana.showModal();

            flotante.textContent = "❔ ¿Necesitas ayuda?";

            if (guiaActual < 0) {

                buscador.value = "";

                mostrarInicio();

            } else {

                mostrarPaso();
            }
        });

        cerrar.addEventListener("click", () => {

            ventana.close();
        });

        buscador.addEventListener("input", () => {

            mostrarInicio();
        });

        ventana.addEventListener("click", evento => {

            if (evento.target !== ventana) return;

            const rect = ventana.getBoundingClientRect();

            if (
                evento.clientX < rect.left ||
                evento.clientX > rect.right ||
                evento.clientY < rect.top ||
                evento.clientY > rect.bottom
            ) {

                ventana.close();
            }
        });

        /* =============================================
           INICIAR CENTRO DE AYUDA
           ============================================= */

        mostrarInicio();

        console.info(
            "Centro de ayuda público El Sabinal iniciado correctamente."
        );

    }

    if (document.readyState === "loading") {

        document.addEventListener(

            "DOMContentLoaded",

            iniciar,

            { once: true }
        );

    } else {

        iniciar();
    }

})();
