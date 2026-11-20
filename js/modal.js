/*
 * Controlador central de modales y vistas auxiliares.
 * Mantiene una única lógica para apertura/cierre, foco y teclado.
 */
const ISO_POLICIES_DATA = {
security: {
title: "Política de seguridad de la información",
content: `
<h3>1. Propósito de esta política</h3>
<p>Esta política describe cómo Bibliography Search protege la información que toca durante su operación: la tuya, la de las fuentes que analizas y la del propio servicio. No es un texto decorativo: cada compromiso que sigue corresponde a una decisión técnica verificable en el código.</p>
<h3>2. Qué hacemos con el contenido que analizas</h3>
<p>Cuando analizas una página web, el sistema extrae su contenido en vivo y lo usa únicamente para calcular métricas. El texto completo no se guarda en ninguna base de datos: al terminar el cálculo se descarta. Lo único que se conserva son metadatos derivados (dominio, título, autoría, fecha, tópico, cantidad de palabras y puntaje), porque con ellos podemos volver a mostrarte el resultado sin volver a consultar la fuente.</p>
<p>Cuando analizas un PDF, el documento se procesa íntegramente en memoria y no se almacena: terminada la respuesta, no queda ninguna copia del archivo en el servidor.</p>
<h3>3. Credenciales y secretos</h3>
<p>La clave del motor de búsqueda externo se lee de una variable de entorno, de una propiedad de la máquina o de un archivo local que está excluido del control de versiones. Nunca se escribe en el código, nunca se incluye en una respuesta de la API y nunca se registra en los logs. Si la clave falta, el servicio responde con un mensaje genérico en lugar de revelar el detalle interno.</p>
<h3>4. Base de datos y consultas</h3>
<p>Todas las consultas a la base de datos usan sentencias preparadas con parámetros vinculados. Ningún dato proveniente del usuario se concatena directamente en una sentencia SQL, lo que descarta la vía clásica de inyección.</p>
<h3>5. Sanitización de salidas</h3>
<p>Todo texto proveniente del exterior (metadatos de una página, nombre de un archivo, campos de autoría) se escapa antes de renderizarse en la interfaz. Esto aplica tanto en el backend como en el frontend, y evita que un contenido malicioso se ejecute como código en tu navegador.</p>
<h3>6. Archivos que aceptamos</h3>
<p>Solo se admiten archivos cuya firma binaria corresponde a un PDF real, de hasta 25 MB y sin contraseña. Cada condición se verifica antes de procesar y, si no se cumple, se responde con un código de error específico y un mensaje claro, no con un fallo silencioso.</p>
<h3>7. Errores y trazabilidad</h3>
<p>Los errores técnicos nunca se muestran crudos al usuario: los fallos internos responden con un mensaje genérico, mientras el detalle completo queda en los logs del servidor, identificado por un código de correlación que también viaja en la respuesta (header X-Request-Id). Con ese código, cualquier incidente puede rastrearse de extremo a extremo.</p>
<h3>8. Disponibilidad y control de abuso</h3>
<p>El servicio limita cuántos análisis ocurren a la vez: tres de URL y dos de PDF. Si se supera el límite, se responde pidiendo reintentar en unos segundos en lugar de degradar a todos los usuarios. Las llamadas al motor externo tienen tiempos máximos definidos para que una caída ajena no cuelgue el sistema.</p>
<h3>9. Transporte y origen</h3>
<p>En producción, tanto el sitio como la API se sirven exclusivamente por HTTPS. El servidor acepta peticiones desde orígenes autorizados, configurables por variable de entorno, de modo que ningún sitio de terceros pueda consumir el servicio en nombre nuestro.</p>
<h3>10. Lo que esta política no cubre</h3>
<p>Bibliography Search es un proyecto académico: no ofrece autenticación de usuarios ni garantía de servicio. Si identificas una vulnerabilidad, te pedimos reportarla de forma responsable a cualquiera de los autores antes de hacerla pública.</p>`
},
quality: {
title: "Calidad de software y accesibilidad",
content: `
<h3>1. Cómo entendemos la calidad</h3>
<p>Para nosotros, calidad significa que el sistema haga exactamente lo que promete, que lo haga siempre igual y que, cuando no pueda hacerlo, lo diga con claridad. Por eso cada capa tiene una única responsabilidad: quien recibe peticiones no calcula métricas, quien calcula métricas no habla con la base de datos, y quien guarda datos no decide cómo se muestran.</p>
<h3>2. Un solo contrato de respuesta</h3>
<p>Todos los endpoints responden con la misma forma: un indicador de éxito, los datos o un mensaje. Esto permite que la interfaz trate todos los casos de la misma manera y que ningún error quede sin explicación visible para quien usa el sistema.</p>
<h3>3. Resultados reproducibles</h3>
<p>Una URL ya analizada devuelve siempre el mismo puntaje y el mismo conteo de palabras, porque esos valores se guardan en el momento del análisis. La caché no recalcula ni inventa: sirve exactamente lo que se midió. La cita APA sí se regenera en cada lectura, porque solo depende de metadatos ya guardados.</p>
<h3>4. Observabilidad</h3>
<p>Cada petición recibe un identificador de correlación que acompaña todos los registros de su ciclo de vida: inicio, consulta de caché, llamadas externas, persistencia y fin con duración total. El módulo de PDF registra además el puntaje de cada pilar en cada análisis, lo que permite auditar y recalibrar el modelo con evidencia en lugar de con intuición.</p>
<h3>5. Calibración documentada</h3>
<p>Los umbrales del análisis forense no fueron elegidos al azar: se ajustaron contra un corpus de documentos de referencia y viven en un único lugar del código, con nombres explícitos. Cambiar un umbral es una decisión consciente y trazable, nunca un efecto colateral.</p>
<h3>6. Errores honestos</h3>
<p>Si un documento está escaneado, en otro idioma o dañado, el sistema lo dice con un mensaje específico en lugar de entregar un veredicto falso. Si el backend no está disponible, la interfaz lo declara como demostración en vez de simular un resultado en silencio. Preferimos un "no puedo" claro a un número inventado.</p>
<h3>7. Accesibilidad</h3>
<p>El libro completo se opera con teclado: se abre con Enter o Espacio, se hojea con las flechas, se cierra con Escape y el tema visual cambia con Alt más T. Los modales atrapan el foco mientras están abiertos y lo devuelven al elemento original al cerrarse. Existen tres temas, incluido uno de alto contraste, y todas las animaciones se desactivan si tu sistema pide movimiento reducido.</p>
<h3>8. Diseño responsivo</h3>
<p>La interfaz se adapta desde escritorios hasta teléfonos estrechos: el libro, los controles y los informes reescalan su tipografía según el espacio real disponible, y en móviles los controles de navegación permanecen siempre dentro de la pantalla, sin recortar el contenido.</p>
<h3>9. Pruebas</h3>
<p>Cada cambio se verifica con un guion de pruebas que recorre el ciclo completo: análisis nuevo, análisis desde caché, listado, actualización y eliminación, más los casos de error de ambos módulos. Un cambio que rompe el guion no se publica.</p>`
},
terms: {
title: "Términos y condiciones de uso",
content: `
<h3>1. Qué es este servicio</h3>
<p>Bibliography Search es una herramienta académica desarrollada como proyecto de curso. Su propósito es ayudarte a evaluar fuentes y documentos con criterios explícitos y visibles, no reemplazar tu juicio ni el de tus docentes.</p>
<h3>2. Qué significan, y qué no, los resultados</h3>
<p>El puntaje de una página web mide solidez documental: dominio, autoría, fecha, extensión, referencias y cuidado de escritura. No afirma que el contenido sea verdadero. Una página bien construida puede contener afirmaciones falsas, y una página modesta puede contener verdad.</p>
<p>El porcentaje de un PDF mide compatibilidad con patrones estadísticos asociados a generación automática. No es una prueba de autoría ni un dictamen: textos humanos formales pueden mostrar patrones similares, y textos asistidos por IA pueden parecer humanos. Por eso cada veredicto se acompaña de las evidencias que lo motivaron, para que las revises tú.</p>
<h3>3. Uso responsable</h3>
<p>Las decisiones académicas que tomes con base en estos informes son tu responsabilidad. Te pedimos usarlos como punto de partida para la revisión manual, nunca como certificado automático para acusar, aprobar o descalificar un trabajo.</p>
<h3>4. Privacidad y datos personales</h3>
<p>El servicio no crea cuentas, no pide registro y no recolecta datos personales. De las páginas web conserva únicamente metadatos derivados del análisis; de los PDF no conserva nada. Los registros del servidor contienen solo información técnica (direcciones, tiempos, identificadores) con fines de operación y diagnóstico.</p>
<h3>5. Contenido de terceros</h3>
<p>Las páginas analizadas pertenecen a sus respectivos autores y sitios. El sistema las consulta para medirlas, no para redistribuirlas: el texto completo no se almacena ni se republica. Las citas en formato APA que genera el sistema son para tu uso académico; citar correctamente sigue siendo tu responsabilidad.</p>
<h3>6. Servicios externos</h3>
<p>La extracción de contenido web depende de un proveedor externo regido por sus propios términos. La disponibilidad y los límites de ese proveedor escapan a nuestro control; cuando falla, el sistema lo informa con un mensaje claro en lugar de entregar resultados parciales o falsos.</p>
<h3>7. Límites del servicio</h3>
<p>El análisis de PDF está calibrado únicamente para español y requiere documentos con capa de texto (no escaneados) de hasta 25 MB. El análisis de URL está pensado para noticias, blogs, sitios corporativos y enciclopedias; otros tipos de página pueden no producir métricas significativas.</p>
<h3>8. Disponibilidad y cambios</h3>
<p>Al ser un proyecto académico, no existe compromiso de nivel de servicio: puede haber interrupciones y los modelos de cálculo pueden recalibrarse con el tiempo. Los puntajes ya emitidos reflejan el criterio vigente en su momento y no se recalculan retroactivamente.</p>
<h3>9. Aceptación</h3>
<p>Al usar Bibliography Search aceptas estas condiciones. Si no estás de acuerdo con alguna, te pedimos no utilizar el servicio. Para consultas o reportes, contacta a cualquiera de los autores del proyecto.</p>`
}
};

document.addEventListener('DOMContentLoaded', () => {
  const mainBookView = document.getElementById('main-book-view');
  const isoView = document.getElementById('iso-policy-view');
  const isoTitle = document.getElementById('iso-section-title');
  const isoContent = document.getElementById('iso-section-content');
  const btnBack = document.getElementById('btn-back-to-book');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const modal = document.getElementById('parchment-modal');
  const modalTitle = document.getElementById('parchment-title');
  const closeButton = document.getElementById('btn-close-parchment');
  let lastFocusedElement = null;

  const getFocusable = () => {
    if (!modal) return [];
    return [...modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.offsetParent !== null);
  };

  function closeParchment() {
    if (!modal || modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    modal.classList.remove('details-ready');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    const target = lastFocusedElement;
    lastFocusedElement = null;
    if (target && document.contains(target)) {
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
  }

  function openParchment({ title, panelId }) {
    if (!modal) return;
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (modalTitle && title) modalTitle.textContent = title;
    modal.querySelectorAll('[data-parchment-panel]').forEach((panel) => panel.classList.add('hidden'));
    const panel = panelId ? document.getElementById(panelId) : null;
    if (panel) panel.classList.remove('hidden');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => {
      const target = closeButton || getFocusable()[0];
      target?.focus({ preventScroll: true });
    });
  }

  window.ParchmentModal = { open: openParchment, close: closeParchment };

  closeButton?.addEventListener('click', closeParchment);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeParchment();
  });

  document.addEventListener('keydown', (event) => {
    if (!modal || modal.classList.contains('hidden')) return;
    if (event.code === 'Escape') {
      event.preventDefault();
      closeParchment();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function navigateToIsoSection(sectionKey) {
    if (!ISO_POLICIES_DATA[sectionKey]) return;
    isoTitle.textContent = ISO_POLICIES_DATA[sectionKey].title;
    isoContent.innerHTML = ISO_POLICIES_DATA[sectionKey].content;
    mainBookView?.classList.add('hidden');
    isoView?.classList.remove('hidden');
  }

  function returnToBookView() {
    isoView?.classList.add('hidden');
    mainBookView?.classList.remove('hidden');
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const sectionKey = link.getAttribute('data-iso');
      navigateToIsoSection(sectionKey);
      history.replaceState(null, '', `#iso-${sectionKey}`);
    });
  });

  btnBack?.addEventListener('click', returnToBookView);

  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    const matchedKey = Object.keys(ISO_POLICIES_DATA).find((key) => initialHash.includes(key));
    if (matchedKey) navigateToIsoSection(matchedKey);
  }
});
