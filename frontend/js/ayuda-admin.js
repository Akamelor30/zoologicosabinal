
/* =====================================================
   CENTRO DE AYUDA ADMINISTRATIVO
   PARQUE ECOLÓGICO Y RECREATIVO EL SABINAL
   ===================================================== */

(() => {
    "use strict";

    function iniciarCentroAyuda() {

        if (document.getElementById("sbCentroAyuda")) return;

        /* =============================================
           CONFIGURACIÓN DE RECURSOS
           ============================================= */

        const CONFIG = {
            rutaImagenes: "/img/ayuda/",
            manualPDF: "/manuales/manual-usuario.pdf",
            manualDisponible: false
        };

        /* =============================================
           GUÍAS DE LOS MÓDULOS
           ============================================= */

        const modulos = [

            {
                id: "dashboard",
                icono: "📊",
                nombre: "Dashboard general",
                descripcion: "Consulta los indicadores y el estado general del zoológico.",
                pasos: [
                    {
                        titulo: "Ingresar al Dashboard",
                        texto: "Selecciona Dashboard en el menú lateral del panel administrativo."
                    },
                    {
                        titulo: "Consultar indicadores",
                        texto: "Revisa las operaciones del día, ingresos cobrados, accesos aceptados y reservaciones pendientes.",
                        objetivo: "#panel-dashboard .dashboard-cards"
                    },
                    {
                        titulo: "Consultar canales de venta",
                        texto: "Observa la comparación entre reservaciones web y ventas realizadas en taquilla.",
                        objetivo: "#chartDashboardCanales"
                    },
                    {
                        titulo: "Revisar actividad reciente",
                        texto: "Consulta las últimas operaciones registradas en el sistema.",
                        objetivo: "#dashboardRecientes"
                    },
                    {
                        titulo: "Utilizar accesos rápidos",
                        texto: "Utiliza los accesos rápidos para ingresar a venta en taquilla, búsqueda por folio, corte diario o lector QR.",
                        objetivo: "#panel-dashboard .quick-actions"
                    }
                ]
            },

            {
                id: "taquilla",
                icono: "🏷️",
                nombre: "Venta en taquilla",
                descripcion: "Registra ventas presenciales y genera tickets de compra.",
                pasos: [
                    {
                        titulo: "Ingresar a venta en taquilla",
                        texto: "Selecciona Venta en taquilla en el menú lateral."
                    },
                    {
                        titulo: "Registrar datos del visitante",
                        texto: "Completa el nombre, teléfono, correo opcional y fecha de visita.",
                        objetivo: "#tkNombre"
                    },
                    {
                        titulo: "Seleccionar los boletos",
                        texto: "Indica la cantidad de boletos correspondientes a cada categoría. Los menores de cinco años no requieren boleto.",
                        objetivo: "#tkCategoriasWrap"
                    },
                    {
                        titulo: "Verificar el total",
                        texto: "Comprueba la cantidad de personas y el importe total de la compra.",
                        objetivo: "#tkTotalMonto"
                    },
                    {
                        titulo: "Recibir el pago",
                        texto: "Recibe el importe correspondiente en efectivo antes de registrar la venta."
                    },
                    {
                        titulo: "Generar el ticket",
                        texto: "Selecciona Cobrar e imprimir ticket únicamente cuando hayas recibido el pago.",
                        objetivo: "#btnTkVender"
                    },
                    {
                        titulo: "Entregar el comprobante",
                        texto: "Revisa el ticket generado y utiliza la opción Imprimir ticket para entregarlo al visitante.",
                        objetivo: "#btnTkImprimir"
                    }
                ]
            },

            {
                id: "reservaciones",
                icono: "📅",
                nombre: "Reservaciones en línea",
                descripcion: "Conoce el proceso de reservación y pago en efectivo.",
                pasos: [
                    {
                        titulo: "Ingresar a reservaciones",
                        texto: "Selecciona Ir a reservaciones en línea para abrir la página pública del zoológico."
                    },
                    {
                        titulo: "Seleccionar la visita",
                        texto: "El visitante deberá seleccionar la fecha de visita y las cantidades de boletos."
                    },
                    {
                        titulo: "Completar los datos",
                        texto: "El visitante deberá proporcionar los datos solicitados y verificar que su correo electrónico sea correcto."
                    },
                    {
                        titulo: "Recibir el código QR",
                        texto: "Al completar la reservación, el visitante recibirá su código QR mediante correo electrónico."
                    },
                    {
                        titulo: "Realizar el pago",
                        texto: "La reservación no implica un pago en línea. El visitante deberá pagar en efectivo al llegar al zoológico."
                    },
                    {
                        titulo: "Confirmar el pago",
                        texto: "Desde el módulo Buscar por folio, localiza la reservación y confirma el pago después de recibir el efectivo."
                    },
                    {
                        titulo: "Validar el acceso",
                        texto: "Utiliza el lector QR para comprobar la reservación y su vigencia antes de permitir el ingreso."
                    }
                ]
            },

            {
                id: "lector",
                icono: "📷",
                nombre: "Validación de códigos QR",
                descripcion: "Consulta el procedimiento para validar el acceso.",
                pasos: [
                    {
                        titulo: "Abrir el lector QR",
                        texto: "Selecciona Ir al lector QR desde el menú administrativo."
                    },
                    {
                        titulo: "Preparar el lector",
                        texto: "Permite el acceso a la cámara cuando el navegador lo solicite."
                    },
                    {
                        titulo: "Presentar el código",
                        texto: "Solicita al visitante el código QR de su reservación."
                    },
                    {
                        titulo: "Escanear el código QR",
                        texto: "Coloca el código frente a la cámara para realizar su lectura."
                    },
                    {
                        titulo: "Verificar el resultado",
                        texto: "Comprueba el resultado de la validación. Si el código es rechazado, revisa el motivo antes de permitir el acceso."
                    },
                    {
                        titulo: "Consultar el historial",
                        texto: "Desde Historial de accesos puedes consultar los registros de validación."
                    }
                ]
            },

            {
                id: "ventas",
                icono: "🎟️",
                nombre: "Ventas del día",
                descripcion: "Consulta las ventas y reservaciones registradas.",
                pasos: [
                    {
                        titulo: "Ingresar al módulo",
                        texto: "Selecciona Ventas del día en el menú lateral."
                    },
                    {
                        titulo: "Seleccionar la fecha",
                        texto: "Indica la fecha que deseas consultar o selecciona Hoy.",
                        objetivo: "#fechaVentas"
                    },
                    {
                        titulo: "Filtrar por estado",
                        texto: "Selecciona el estado de acceso correspondiente o utiliza Todos.",
                        objetivo: "#estadoAccesoVentas"
                    },
                    {
                        titulo: "Consultar registros",
                        texto: "Presiona Consultar y revisa los folios, clientes, importes, pagos y estados de acceso.",
                        objetivo: "#btnVentas"
                    },
                    {
                        titulo: "Exportar información",
                        texto: "Utiliza Exportar CSV para descargar los registros de la consulta.",
                        objetivo: "#btnExportarVentas"
                    }
                ]
            },

            {
                id: "accesos",
                icono: "🚪",
                nombre: "Historial de accesos",
                descripcion: "Consulta los accesos aceptados y rechazados.",
                pasos: [
                    {
                        titulo: "Ingresar al historial",
                        texto: "Selecciona Historial de accesos en el menú lateral."
                    },
                    {
                        titulo: "Seleccionar la fecha",
                        texto: "Indica la fecha de los accesos que deseas revisar.",
                        objetivo: "#fechaAccesos"
                    },
                    {
                        titulo: "Seleccionar el resultado",
                        texto: "Filtra los accesos aceptados, rechazados o todos los registros.",
                        objetivo: "#resultadoAcceso"
                    },
                    {
                        titulo: "Consultar accesos",
                        texto: "Presiona Consultar y revisa los resultados y motivos de rechazo.",
                        objetivo: "#btnAccesos"
                    },
                    {
                        titulo: "Exportar historial",
                        texto: "Selecciona Exportar CSV para descargar la información.",
                        objetivo: "#btnExportarAccesos"
                    }
                ]
            },

            {
                id: "buscar",
                icono: "🔎",
                nombre: "Buscar por folio",
                descripcion: "Consulta operaciones y confirma pagos de reservaciones.",
                pasos: [
                    {
                        titulo: "Ingresar al buscador",
                        texto: "Selecciona Buscar por folio desde el menú lateral."
                    },
                    {
                        titulo: "Introducir el folio",
                        texto: "Escribe el folio correspondiente al ticket o reservación.",
                        objetivo: "#folioBuscar"
                    },
                    {
                        titulo: "Realizar la búsqueda",
                        texto: "Selecciona Buscar para consultar la información de la operación.",
                        objetivo: "#btnBuscarFolio"
                    },
                    {
                        titulo: "Revisar el detalle",
                        texto: "Comprueba los datos del visitante, los boletos y el estado del pago y acceso.",
                        objetivo: "#detalleVenta"
                    },
                    {
                        titulo: "Confirmar el pago",
                        texto: "Si la reservación está pendiente de pago, recibe el efectivo antes de utilizar Confirmar pago.",
                        objetivo: "#btnConfirmarPago"
                    },
                    {
                        titulo: "Consultar acciones disponibles",
                        texto: "Según el estado de la operación, podrás utilizar las opciones disponibles de reimpresión, descarga QR, registro manual o cancelación. Verifica siempre los datos antes de confirmar."
                    }
                ]
            },

            {
                id: "corte",
                icono: "💰",
                nombre: "Corte básico",
                descripcion: "Consulta ingresos cobrados y genera reportes de caja.",
                pasos: [
                    {
                        titulo: "Ingresar al corte",
                        texto: "Selecciona Corte básico desde el menú administrativo."
                    },
                    {
                        titulo: "Seleccionar la fecha",
                        texto: "Indica la fecha de corte que deseas consultar.",
                        objetivo: "#fechaCorte"
                    },
                    {
                        titulo: "Consultar información",
                        texto: "Presiona Consultar para obtener las operaciones cobradas durante la fecha seleccionada.",
                        objetivo: "#btnCorte"
                    },
                    {
                        titulo: "Revisar los ingresos",
                        texto: "Verifica el monto total, efectivo, personas y operaciones registradas.",
                        objetivo: "#corteMonto"
                    },
                    {
                        titulo: "Revisar el detalle",
                        texto: "Comprueba el listado de ventas incluidas en el corte.",
                        objetivo: "#tbodyCorteDetalle"
                    },
                    {
                        titulo: "Exportar el reporte",
                        texto: "Utiliza Exportar CSV o Imprimir / guardar PDF para conservar el reporte.",
                        objetivo: "#btnImprimirCorte"
                    }
                ]
            },

            {
                id: "bi",
                icono: "📈",
                nombre: "BI y gráficas",
                descripcion: "Analiza indicadores, ingresos y tendencias de visitantes.",
                pasos: [
                    {
                        titulo: "Ingresar a BI y gráficas",
                        texto: "Selecciona BI y gráficas en el menú administrativo."
                    },
                    {
                        titulo: "Definir el periodo",
                        texto: "Selecciona las fechas inicial y final o utiliza los periodos rápidos.",
                        objetivo: "#fechaInicioBI"
                    },
                    {
                        titulo: "Analizar el periodo",
                        texto: "Presiona Analizar periodo para consultar los indicadores correspondientes.",
                        objetivo: "#btnBI"
                    },
                    {
                        titulo: "Interpretar indicadores",
                        texto: "Revisa las reservaciones, ventas, ingresos cobrados y pendientes de pago.",
                        objetivo: "#biIngresosCobrados"
                    },
                    {
                        titulo: "Consultar gráficas",
                        texto: "Analiza las categorías, canales, tendencias y días de mayor demanda. Los pronósticos son estimaciones, no resultados garantizados.",
                        objetivo: "#panel-bi .bi-chart-grid"
                    },
                    {
                        titulo: "Descargar resultados",
                        texto: "Utiliza las opciones de descarga PNG, CSV o impresión en PDF.",
                        objetivo: "#panel-bi .bi-actions"
                    }
                ]
            },

            {
                id: "promociones",
                icono: "🎯",
                nombre: "Promociones web",
                descripcion: "Configura y administra promociones de reservaciones.",
                pasos: [
                    {
                        titulo: "Ingresar a promociones",
                        texto: "Selecciona Promociones web en el menú lateral."
                    },
                    {
                        titulo: "Registrar una promoción",
                        texto: "Escribe el nombre de la promoción y selecciona la categoría correspondiente.",
                        objetivo: "#promoNombre"
                    },
                    {
                        titulo: "Configurar la vigencia",
                        texto: "Selecciona el día de aplicación y las fechas inicial y final.",
                        objetivo: "#promoInicio"
                    },
                    {
                        titulo: "Guardar promoción",
                        texto: "Completa la descripción, revisa los datos y selecciona Guardar promoción.",
                        objetivo: "#btnGuardarPromo"
                    },
                    {
                        titulo: "Administrar promociones",
                        texto: "Consulta las promociones registradas y utiliza las opciones disponibles para modificarlas, activarlas o desactivarlas.",
                        objetivo: "#listaPromociones"
                    },
                    {
                        titulo: "Consideraciones importantes",
                        texto: "Las promociones web aplican únicamente a reservaciones en línea cuando estén habilitadas. El pago continúa siendo en efectivo en taquilla."
                    }
                ]
            },

            {
                id: "animales",
                icono: "🐯",
                nombre: "Catálogo de animales",
                descripcion: "Administra los animales visibles en la página pública.",
                pasos: [
                    {
                        titulo: "Ingresar al catálogo",
                        texto: "Selecciona Animales en el menú lateral."
                    },
                    {
                        titulo: "Registrar información",
                        texto: "Completa el nombre, especie, hábitat y alimentación del animal.",
                        objetivo: "#animalNombre"
                    },
                    {
                        titulo: "Agregar imagen",
                        texto: "Introduce una URL válida o la ruta de una imagen local del zoológico.",
                        objetivo: "#animalImagen"
                    },
                    {
                        titulo: "Completar descripción",
                        texto: "Agrega una descripción informativa y define el orden de presentación.",
                        objetivo: "#animalDescripcion"
                    },
                    {
                        titulo: "Guardar animal",
                        texto: "Verifica la información antes de seleccionar Guardar animal.",
                        objetivo: "#btnGuardarAnimal"
                    },
                    {
                        titulo: "Administrar visibilidad",
                        texto: "Consulta los animales registrados y utiliza las opciones de modificación, visibilidad o eliminación según corresponda.",
                        objetivo: "#listaAnimalesAdmin"
                    }
                ]
            },

            {
                id: "ejemplares",
                icono: "🦁",
                nombre: "Control de ejemplares",
                descripcion: "Administra expedientes, revisiones semanales y bajas.",
                pasos: [
                    {
                        titulo: "Ingresar al control interno",
                        texto: "Selecciona Control de ejemplares desde el menú lateral."
                    },
                    {
                        titulo: "Consultar indicadores",
                        texto: "Revisa los animales activos, en observación, en tratamiento y las revisiones pendientes.",
                        objetivo: "#ejTotalActivos"
                    },
                    {
                        titulo: "Registrar nuevo animal",
                        texto: "Selecciona Registrar nuevo animal cuando un ejemplar haya ingresado al zoológico.",
                        objetivo: "#btnNuevoEjemplar"
                    },
                    {
                        titulo: "Completar el expediente",
                        texto: "Registra los datos del ejemplar, incluyendo nombre, especie, fecha de llegada, procedencia, hábitat y condición de ingreso.",
                        objetivo: "#formEjemplarCard"
                    },
                    {
                        titulo: "Guardar el expediente",
                        texto: "Verifica los campos obligatorios y selecciona Guardar animal.",
                        objetivo: "#btnGuardarEjemplar"
                    },
                    {
                        titulo: "Buscar un ejemplar",
                        texto: "Utiliza el nombre, código o especie para localizar un animal registrado.",
                        objetivo: "#buscarEjemplar"
                    },
                    {
                        titulo: "Consultar expediente",
                        texto: "Selecciona Expediente en el registro correspondiente para consultar su información."
                    },
                    {
                        titulo: "Realizar revisión semanal",
                        texto: "Desde el expediente, selecciona Hacer revisión y registra la información del seguimiento semanal.",
                        objetivo: "#btnMostrarReporteEjemplar"
                    },
                    {
                        titulo: "Consultar historial",
                        texto: "Selecciona Ver historial para consultar los reportes anteriores.",
                        objetivo: "#btnMostrarHistorialEjemplar"
                    },
                    {
                        titulo: "Registrar salida o baja",
                        texto: "Utiliza Registrar salida / baja cuando corresponda. Verifica el motivo, fecha y responsable antes de guardar. El expediente anterior se conserva.",
                        objetivo: "#btnMostrarBajaEjemplar"
                    }
                ]
            },

            {
                id: "donaciones",
                icono: "📋",
                nombre: "Solicitudes de donación",
                descripcion: "Consulta, autoriza y rechaza solicitudes de animales.",
                pasos: [
                    {
                        titulo: "Compartir el formulario",
                        texto: "Proporciona al interesado el enlace del formulario de donación o permite que lo complete en las instalaciones con orientación del personal."
                    },
                    {
                        titulo: "Consultar solicitudes",
                        texto: "Ingresa a Solicitudes de donación desde el menú administrativo."
                    },
                    {
                        titulo: "Filtrar solicitudes",
                        texto: "Selecciona el estado correspondiente y consulta las solicitudes registradas."
                    },
                    {
                        titulo: "Revisar información",
                        texto: "Selecciona Ver detalle para consultar los datos del donante, del animal y sus observaciones."
                    },
                    {
                        titulo: "Autorizar una solicitud",
                        texto: "Si la solicitud cumple los criterios del zoológico, selecciona Autorizar y confirma la decisión."
                    },
                    {
                        titulo: "Rechazar una solicitud",
                        texto: "Selecciona Rechazar cuando corresponda. Escribe el motivo del rechazo en la ventana de información y confirma mediante Aceptar."
                    },
                    {
                        titulo: "Confirmar recepción física",
                        texto: "Una solicitud autorizada no significa que el animal ya haya ingresado. Espera hasta que el personal autorizado confirme su recepción física."
                    },
                    {
                        titulo: "Registrar el ejemplar",
                        texto: "Selecciona Registrar ejemplar en la solicitud autorizada, verifica los datos y completa el expediente vinculado al folio de donación."
                    }
                ]
            }

        ];

        /* =============================================
           PREGUNTAS FRECUENTES
           ============================================= */

        const preguntas = [
            {
                pregunta: "¿Las reservaciones se pagan en línea?",
                respuesta: "No. El visitante realiza la reservación en línea y paga en efectivo al llegar a la taquilla."
            },
            {
                pregunta: "¿Qué hago si un código QR es rechazado?",
                respuesta: "Revisa el motivo del rechazo, el folio, la fecha de visita y el estado de la reservación antes de permitir el acceso."
            },
            {
                pregunta: "¿Cómo confirmo el pago de una reservación?",
                respuesta: "Ingresa a Buscar por folio, localiza la reservación y utiliza Confirmar pago después de recibir el efectivo."
            },
            {
                pregunta: "¿Cómo puedo generar el reporte de ingresos?",
                respuesta: "Ingresa a Corte básico, selecciona la fecha y utiliza Imprimir / guardar PDF o Exportar CSV."
            },
            {
                pregunta: "¿Las promociones aplican en taquilla?",
                respuesta: "Las promociones web corresponden a reservaciones realizadas desde la página pública cuando se encuentran habilitadas."
            },
            {
                pregunta: "¿Cuál es la diferencia entre Animales y Control de ejemplares?",
                respuesta: "Animales administra el catálogo público. Control de ejemplares conserva los expedientes internos, revisiones semanales y bajas."
            },
            {
                pregunta: "¿Una donación autorizada registra automáticamente al animal?",
                respuesta: "No. El ejemplar debe registrarse cuando haya sido recibido físicamente por el personal autorizado."
            },
            {
                pregunta: "¿Qué sucede al registrar una baja?",
                respuesta: "El expediente y sus reportes anteriores se conservan como parte del historial del ejemplar."
            },
            {
                pregunta: "¿El Centro de ayuda modifica los registros?",
                respuesta: "No. Los tutoriales son informativos y no ejecutan automáticamente ventas, pagos, autorizaciones ni eliminaciones."
            }
        ];

        /* =============================================
           CREAR INTERFAZ DEL CENTRO DE AYUDA
           ============================================= */

        const contenedor = document.createElement("div");

        contenedor.id = "sbCentroAyuda";
        contenedor.className = "sb-ayuda";

        contenedor.innerHTML = `
            <button
                type="button"
                class="sb-ayuda-flotante"
                id="sbAyudaFlotante"
                aria-label="Abrir centro de ayuda"
            >
                ❔ ¿Necesitas ayuda?
            </button>

            <div
                class="sb-ayuda-overlay"
                id="sbAyudaOverlay"
                hidden
            >
                <div
                    class="sb-ayuda-ventana"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="sbAyudaTitulo"
                    tabindex="-1"
                >

                    <header class="sb-ayuda-header">

                        <div class="sb-ayuda-marca">
                            🦁 Parque Ecológico y Recreativo El Sabinal
                        </div>

                        <h2 id="sbAyudaTitulo">
                            Centro de ayuda
                        </h2>

                        <p>
                            Aprende a utilizar el sistema administrativo
                            mediante guías y tutoriales paso a paso.
                        </p>

                        <button
                            type="button"
                            class="sb-ayuda-cerrar"
                            id="sbAyudaCerrar"
                            aria-label="Cerrar centro de ayuda"
                        >×</button>

                        <div class="sb-ayuda-buscador">
                            <span aria-hidden="true">🔎</span>

                            <input
                                type="search"
                                id="sbAyudaBuscar"
                                placeholder="Buscar un módulo o procedimiento..."
                                aria-label="Buscar instrucciones"
                                autocomplete="off"
                            >
                        </div>

                    </header>

                    <div
                        class="sb-ayuda-contenido"
                        id="sbAyudaContenido"
                    ></div>

                    <footer class="sb-ayuda-footer">
                        Centro de ayuda · Sistema administrativo El Sabinal
                    </footer>

                </div>
            </div>
        `;

        document.body.appendChild(contenedor);

        /* =============================================
           REFERENCIAS Y ESTADO
           ============================================= */

        const overlay = document.getElementById("sbAyudaOverlay");
        const contenido = document.getElementById("sbAyudaContenido");
        const buscador = document.getElementById("sbAyudaBuscar");
        const flotante = document.getElementById("sbAyudaFlotante");
        const cerrar = document.getElementById("sbAyudaCerrar");
        const ventana = overlay.querySelector(".sb-ayuda-ventana");

        let moduloSeleccionado = null;
        let pasoActual = 0;
        let focoAnterior = null;
        let overflowAnterior = "";
        let elementoResaltado = null;
        let temporizadorResaltado = null;

        /* =============================================
           ACCESO DESDE EL MENÚ LATERAL
           ============================================= */

        const menu = document.querySelector(".sidebar .menu");

        if (menu && !document.getElementById("sbAyudaMenu")) {

            const acceso = document.createElement("a");

            acceso.id = "sbAyudaMenu";
            acceso.href = "#centro-ayuda";
            acceso.textContent = "❔ Centro de ayuda";

            acceso.addEventListener("click", (evento) => {
                evento.preventDefault();
                abrirAyuda();
            });

            const logout = menu.querySelector(".logout-link");

            if (logout) {
                menu.insertBefore(acceso, logout);
            } else {
                menu.appendChild(acceso);
            }
        }

        /* =============================================
           FUNCIONES AUXILIARES
           ============================================= */

        function normalizar(texto) {
            return String(texto)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .trim();
        }

        function obtenerModuloActual() {

            const panel = document.querySelector(
                ".panel.active[id^='panel-']"
            );

            if (!panel) return null;

            const id = panel.id.replace("panel-", "");

            return modulos.find(modulo => modulo.id === id) || null;
        }

        function limpiarResaltado() {

            clearTimeout(temporizadorResaltado);

            if (elementoResaltado) {
                elementoResaltado.classList.remove(
                    "sb-ayuda-resaltado"
                );
            }

            elementoResaltado = null;
        }

        /* =============================================
           ABRIR Y CERRAR AYUDA
           ============================================= */

        function abrirAyuda() {

            if (!overlay.hidden) return;

            limpiarResaltado();

            focoAnterior = document.activeElement;
            overflowAnterior = document.body.style.overflow;

            overlay.hidden = false;
            document.body.style.overflow = "hidden";

            buscador.value = "";
            moduloSeleccionado = null;
            pasoActual = 0;

            mostrarInicio();

            buscador.focus();
        }

        function cerrarAyuda() {

            if (overlay.hidden) return;

            overlay.hidden = true;

            document.body.style.overflow = overflowAnterior;

            if (focoAnterior && focoAnterior.isConnected) {
                focoAnterior.focus();
            }
        }

        /* =============================================
           PANTALLA PRINCIPAL Y BUSCADOR
           ============================================= */

        function mostrarInicio(consulta = "") {

            moduloSeleccionado = null;

            const termino = normalizar(consulta);
            const actual = obtenerModuloActual();

            const resultados = modulos.filter(modulo => {

                const texto = [
                    modulo.nombre,
                    modulo.descripcion,
                    ...modulo.pasos.map(
                        paso => paso.titulo + " " + paso.texto
                    )
                ].join(" ");

                return normalizar(texto).includes(termino);
            });

            const faqResultados = preguntas.filter(item =>
                normalizar(
                    item.pregunta + " " + item.respuesta
                ).includes(termino)
            );

            contenido.innerHTML = `

                ${actual && !termino ? `
                    <div class="sb-ayuda-contexto">
                        <strong>
                            💡 Ayuda del módulo actual
                        </strong>

                        <p>
                            Actualmente estás utilizando
                            <b>${actual.nombre}</b>.
                            Consulta su guía de funcionamiento.
                        </p>

                        <button
                            type="button"
                            class="sb-ayuda-btn"
                            data-guia="${actual.id}"
                        >
                            Ver ayuda de este módulo
                        </button>
                    </div>
                ` : ""}

                <h3 class="sb-ayuda-titulo">
                    ${termino
                        ? "Resultados de búsqueda"
                        : "Explorar módulos"}
                </h3>

                <p class="sb-ayuda-descripcion">
                    ${resultados.length} guías disponibles.
                    Selecciona una para comenzar.
                </p>

                <div class="sb-ayuda-grid">

                    ${resultados.length ? resultados.map(modulo => `

                        <button
                            type="button"
                            class="sb-ayuda-tarjeta"
                            data-guia="${modulo.id}"
                        >
                            <span class="sb-ayuda-icono">
                                ${modulo.icono}
                            </span>

                            <h3>${modulo.nombre}</h3>

                            <p>${modulo.descripcion}</p>

                            <span class="sb-ayuda-enlace">
                                Ver tutorial · ${modulo.pasos.length} pasos →
                            </span>
                        </button>

                    `).join("") : `

                        <div class="sb-ayuda-vacio">
                            No se encontraron módulos.
                            Intenta buscar con otras palabras.
                        </div>

                    `}

                </div>

                ${faqResultados.length ? `

                    <section class="sb-ayuda-faq">

                        <h3 class="sb-ayuda-titulo">
                            Preguntas frecuentes
                        </h3>

                        ${faqResultados.map(item => `
                            <details>
                                <summary>
                                    ${item.pregunta}
                                </summary>

                                <p>${item.respuesta}</p>
                            </details>
                        `).join("")}

                    </section>

                ` : ""}

                ${!termino ? `

                    <div class="sb-ayuda-manual">

                        <div>
                            <h3>📘 Manual de usuario</h3>

                            <p>
                                Consulta la documentación completa
                                del sistema administrativo.
                            </p>
                        </div>

                        ${CONFIG.manualDisponible ? `
                            <a
                                class="sb-ayuda-btn"
                                href="${CONFIG.manualPDF}"
                                download
                            >
                                ⬇ Descargar PDF
                            </a>
                        ` : `
                            <button
                                type="button"
                                class="sb-ayuda-btn"
                                disabled
                            >
                                PDF próximamente
                            </button>
                        `}

                    </div>

                ` : ""}

            `;

            contenido.scrollTop = 0;
        }

        /* =============================================
           ABRIR TUTORIAL
           ============================================= */

        function abrirTutorial(id) {

            const modulo = modulos.find(item => item.id === id);

            if (!modulo) return;

            moduloSeleccionado = modulo;
            pasoActual = 0;

            buscador.value = "";

            mostrarPaso();
        }

        /* =============================================
           MOSTRAR PASOS DEL TUTORIAL
           ============================================= */

        function mostrarPaso() {

            if (!moduloSeleccionado) return;

            const modulo = moduloSeleccionado;
            const paso = modulo.pasos[pasoActual];

            const total = modulo.pasos.length;
            const porcentaje = ((pasoActual + 1) / total) * 100;

            const ultimo = pasoActual === total - 1;

            contenido.innerHTML = `

                <button
                    type="button"
                    class="sb-ayuda-btn sb-ayuda-btn-secundario"
                    data-accion="inicio"
                    style="margin-bottom:18px;"
                >
                    ← Regresar a los módulos
                </button>

                <div class="sb-ayuda-tutorial">

                    <span class="sb-ayuda-icono">
                        ${modulo.icono}
                    </span>

                    <h2 class="sb-ayuda-titulo"
                        style="margin-top:15px;">
                        ${modulo.nombre}
                    </h2>

                    <p class="sb-ayuda-descripcion">
                        ${modulo.descripcion}
                    </p>

                    <span class="sb-ayuda-contador">
                        Paso ${pasoActual + 1} de ${total}
                    </span>

                    <div
                        class="sb-ayuda-progreso"
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="${Math.round(porcentaje)}"
                        aria-label="Progreso del tutorial"
                    >
                        <div
                            class="sb-ayuda-barra"
                            style="width:${porcentaje}%"
                        ></div>
                    </div>

                    <div class="sb-ayuda-paso">

                        <h3>
                            ${pasoActual + 1}. ${paso.titulo}
                        </h3>

                        <p>${paso.texto}</p>

                        ${paso.imagen ? `
                            <img
                                class="sb-ayuda-imagen"
                                src="${CONFIG.rutaImagenes}${paso.imagen}"
                                alt="Captura de ${paso.titulo}"
                            >
                        ` : ""}

                    </div>

                    ${paso.objetivo ? `

                        <div style="margin-top:16px;">

                            <button
                                type="button"
                                class="sb-ayuda-btn sb-ayuda-btn-secundario"
                                data-accion="ubicar"
                            >
                                📍 Ubicar en el sistema
                            </button>

                        </div>

                    ` : ""}

                    <div class="sb-ayuda-navegacion">

                        <button
                            type="button"
                            class="sb-ayuda-btn sb-ayuda-btn-secundario"
                            data-accion="anterior"
                            ${pasoActual === 0 ? "disabled" : ""}
                        >
                            ← Anterior
                        </button>

                        <button
                            type="button"
                            class="sb-ayuda-btn"
                            data-accion="${ultimo ? "finalizar" : "siguiente"}"
                        >
                            ${ultimo ? "✓ Finalizar" : "Siguiente →"}
                        </button>

                    </div>

                </div>

            `;

            const imagen = contenido.querySelector(".sb-ayuda-imagen");

            if (imagen) {
                imagen.addEventListener("error", () => {
                    imagen.hidden = true;
                }, { once: true });
            }

            contenido.scrollTop = 0;
        }

        /* =============================================
           UBICAR ELEMENTOS EN EL SISTEMA
           ============================================= */

        function ubicarElemento() {

            if (!moduloSeleccionado) return;

            const modulo = moduloSeleccionado;
            const paso = modulo.pasos[pasoActual];

            if (!paso.objetivo) return;

            limpiarResaltado();

            const panel = document.getElementById(
                "panel-" + modulo.id
            );

            const botonMenu = document.querySelector(
                '.menu-btn[data-panel="' + modulo.id + '"]'
            );

            if (panel && !panel.classList.contains("active")) {

                if (botonMenu) {
                    botonMenu.click();
                }
            }

            const elemento = document.querySelector(paso.objetivo);

            if (!elemento || elemento.getClientRects().length === 0) {

                const aviso = document.createElement("p");

                aviso.textContent =
                    "Este elemento todavía no está visible. " +
                    "Completa los pasos anteriores dentro del módulo.";

                aviso.style.color = "#865b13";
                aviso.setAttribute("role", "status");

                const anterior = contenido.querySelector(
                    ".sb-aviso-ubicacion"
                );

                if (anterior) anterior.remove();

                aviso.className = "sb-aviso-ubicacion";

                contenido.querySelector(
                    ".sb-ayuda-paso"
                ).appendChild(aviso);

                return;
            }

            cerrarAyuda();

            elementoResaltado = elemento;

            elemento.classList.add("sb-ayuda-resaltado");

            elemento.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            // Permitir continuar desde el mismo paso.
            flotante.textContent = "📘 Continuar tutorial";

            temporizadorResaltado = setTimeout(() => {
                limpiarResaltado();
            }, 7000);
        }

        /* =============================================
           FINALIZAR TUTORIAL
           ============================================= */

        function finalizarTutorial() {

            if (!moduloSeleccionado) return;

            const nombre = moduloSeleccionado.nombre;

            moduloSeleccionado = null;
            pasoActual = 0;

            contenido.innerHTML = `

                <div class="sb-ayuda-tutorial"
                    style="text-align:center;padding:40px 20px;">

                    <div style="font-size:55px;">✅</div>

                    <h2 class="sb-ayuda-titulo"
                        style="margin-top:20px;">
                        Tutorial completado
                    </h2>

                    <p>
                        Has terminado la guía de
                        <strong>${nombre}</strong>.
                    </p>

                    <p class="sb-ayuda-descripcion">
                        Puedes volver a consultar esta guía
                        cuando lo necesites.
                    </p>

                    <button
                        type="button"
                        class="sb-ayuda-btn"
                        data-accion="inicio"
                    >
                        Explorar otros módulos
                    </button>

                </div>

            `;

            contenido.scrollTop = 0;
        }

        /* =============================================
           EVENTOS Y NAVEGACIÓN
           ============================================= */

        flotante.addEventListener("click", () => {

            if (
                moduloSeleccionado &&
                flotante.textContent.includes("Continuar")
            ) {

                limpiarResaltado();

                focoAnterior = document.activeElement;
                overflowAnterior = document.body.style.overflow;

                overlay.hidden = false;
                document.body.style.overflow = "hidden";

                flotante.textContent = "❔ ¿Necesitas ayuda?";

                mostrarPaso();
                ventana.focus();

            } else {

                flotante.textContent = "❔ ¿Necesitas ayuda?";

                abrirAyuda();
            }
        });

        cerrar.addEventListener("click", cerrarAyuda);

        overlay.addEventListener("click", evento => {
            if (evento.target === overlay) {
                cerrarAyuda();
            }
        });

        buscador.addEventListener("input", () => {
            mostrarInicio(buscador.value);
        });

        contenido.addEventListener("click", evento => {

            const guia = evento.target.closest("[data-guia]");

            if (guia) {
                abrirTutorial(guia.dataset.guia);
                return;
            }

            const boton = evento.target.closest("[data-accion]");

            if (!boton || boton.disabled) return;

            switch (boton.dataset.accion) {

                case "inicio":
                    buscador.value = "";
                    mostrarInicio();
                    break;

                case "anterior":
                    if (moduloSeleccionado && pasoActual > 0) {
                        pasoActual--;
                        mostrarPaso();
                    }
                    break;

                case "siguiente":
                    if (
                        moduloSeleccionado &&
                        pasoActual < moduloSeleccionado.pasos.length - 1
                    ) {
                        pasoActual++;
                        mostrarPaso();
                    }
                    break;

                case "ubicar":
                    ubicarElemento();
                    break;

                case "finalizar":
                    finalizarTutorial();
                    break;
            }
        });

        /* =============================================
           ACCESIBILIDAD Y TECLADO
           ============================================= */

        document.addEventListener("keydown", evento => {

            if (overlay.hidden) return;

            if (evento.key === "Escape") {
                evento.preventDefault();
                cerrarAyuda();
                return;
            }

            if (evento.key === "Tab") {

                const elementos = Array.from(
                    ventana.querySelectorAll(
                        'button:not([disabled]), a[href], ' +
                        'input:not([disabled]), summary, [tabindex="0"]'
                    )
                ).filter(elemento =>
                    elemento.getClientRects().length > 0
                );

                if (!elementos.length) return;

                const primero = elementos[0];
                const ultimo = elementos[elementos.length - 1];

                if (
                    evento.shiftKey &&
                    document.activeElement === primero
                ) {
                    evento.preventDefault();
                    ultimo.focus();
                } else if (
                    !evento.shiftKey &&
                    document.activeElement === ultimo
                ) {
                    evento.preventDefault();
                    primero.focus();
                }
            }
        });

        console.info(
            "Centro de ayuda El Sabinal iniciado correctamente."
        );
    }

    /* =============================================
       INICIALIZACIÓN
       ============================================= */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarCentroAyuda,
            { once: true }
        );
    } else {
        iniciarCentroAyuda();
    }

})();
