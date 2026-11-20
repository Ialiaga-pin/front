/*
Popups "Cómo se evalúa" para las páginas de instrucciones.
Reutiliza el modal de pergamino existente (window.ParchmentModal)
con un panel genérico (#method-panel) definido en index.html.
*/
document.addEventListener('DOMContentLoaded', () => {
    const METHOD_DATA = {
        url: {
            title: 'Cómo se evalúa una fuente web',
            html: `
<div class="parchment-subsection">
<h4>Qué mide el porcentaje</h4>
<p class="parchment-note">El número que ves es un puntaje de solidez documental entre 0 y 100. No dice si el contenido es verdadero: dice qué tan seria parece la construcción de la fuente según seis criterios observables y explicables.</p>
</div>
<div class="parchment-subsection">
<h4>Las seis lupas del análisis</h4>
<ul class="parchment-list">
<li><strong>Dominio (25 %).</strong> Los sitios educativos (.edu) y gubernamentales (.gov, .gob) parten con puntaje pleno; las organizaciones (.org) con la mitad; el resto con un cuarto.</li>
<li><strong>Autoría (25 %).</strong> Una fuente firmada por una persona o institución identificable vale mucho más que una anónima.</li>
<li><strong>Fecha (15 %).</strong> Una fecha reciente y válida suma pleno; la antigüedad descuenta de a poco; sin fecha, el puntaje es neutral y bajo.</li>
<li><strong>Extensión (15 %).</strong> Un texto desarrollado (más de 5 000 caracteres) puntúa pleno; los textos breves, parcial o nulo.</li>
<li><strong>Referencias (15 %).</strong> La presencia de bibliografía, citas o DOI es señal de trabajo verificable.</li>
<li><strong>Cuidado de escritura (5 %).</strong> Puntuación coherente, espacios correctos y cierre con punto suman; los descuidos tipográficos restan.</li>
</ul>
</div>
<div class="parchment-subsection">
<h4>Cómo se combinan</h4>
<p class="parchment-note">Cada lupa devuelve un puntaje de 0 a 100 que se multiplica por su peso; la suma de todos es el puntaje final. Ese valor se guarda en el momento del análisis: si vuelves a consultar la misma URL verás exactamente el mismo resultado, servido desde la base de datos sin volver a consultar la fuente.</p>
</div>
<div class="parchment-subsection">
<h4>De dónde salen los links recomendados</h4>
<p class="parchment-note">El sistema identifica el tópico de la página por frecuencia de palabras significativas y busca hasta cinco fuentes similares. Cada una se analiza con estas mismas seis lupas y se guarda; por eso cada tarjeta recomendada muestra su propio puntaje, su propio conteo de palabras y su propia cita APA.</p>
</div>
<div class="parchment-subsection">
<h4>Cómo leer el veredicto</h4>
<ul class="parchment-list">
<li><strong>80 % o más:</strong> fuente de alta confiabilidad documental.</li>
<li><strong>60 a 79 %:</strong> confiabilidad moderada: útil, pero conviene contrastarla.</li>
<li><strong>Menos de 60 %:</strong> se recomienda verificar con fuentes adicionales antes de citarla.</li>
</ul>
<p class="parchment-note">Recuerda: el puntaje mide solidez documental, no veracidad. Una página impecable puede contener afirmaciones falsas.</p>
</div>`
        },
        pdf: {
            title: 'Cómo se evalúa un documento PDF',
            html: `
<div class="parchment-subsection">
<h4>Qué mide el porcentaje</h4>
<p class="parchment-note">A diferencia del análisis de URL, aquí un porcentaje ALTO significa mayor compatibilidad con patrones de escritura automática, y uno BAJO, compatibilidad con escritura humana. Es una estimación estadística, nunca una prueba de autoría.</p>
</div>
<div class="parchment-subsection">
<h4>El proceso, paso a paso</h4>
<ul class="parchment-list">
<li><strong>1. Extracción.</strong> Se leen el texto y los metadatos del PDF: autor declarado, programa productor y fechas de creación y edición.</li>
<li><strong>2. Limpieza y puertas de calidad.</strong> Se normaliza el texto y se verifica que haya contenido suficiente (mínimo 100 palabras), que esté en español y que la extracción no venga fragmentada. Si algo falla, el sistema lo dice y no entrega veredicto.</li>
<li><strong>3. Los cinco pilares.</strong> Cada pilar mide un rasgo del texto y vota hacia un lado o hacia otro con un peso definido.</li>
<li><strong>4. Los tres testigos.</strong> Rasgos secundarios que no votan: acompañan el informe como contexto.</li>
<li><strong>5. La huella digital.</strong> Los metadatos del archivo ajustan el resultado hasta más o menos 10 puntos, solo cuando son confiables.</li>
<li><strong>6. Veredicto.</strong> El promedio ponderado de los pilares, más el ajuste de huella, da el índice final entre 0 y 100.</li>
</ul>
</div>
<div class="parchment-subsection">
<h4>Los pilares, en palabras simples</h4>
<ul class="parchment-list">
<li><strong>Anclaje empírico.</strong> ¿El texto se apoya en datos comprobables: fechas, cifras, citas, nombres propios? La investigación humana suele anclarse en evidencia; lo automático tiende a generalizar.</li>
<li><strong>Complejidad sintáctica.</strong> ¿La puntuación es variada (paréntesis, punto y coma, incisos, citas textuales) o plana y predecible? El pensamiento humano deja puntuación compleja.</li>
<li><strong>Burstiness (ritmo).</strong> ¿Las oraciones alternan largas y cortas, como el ritmo natural de una persona, o son todas del mismo largo, como suele producir una máquina?</li>
<li><strong>Voz autoral.</strong> ¿Aparece primera persona, preguntas propias, analogías personales? La voz propia es difícil de imitar para un modelo.</li>
<li><strong>Intensificadores vacíos.</strong> ¿Abunda el énfasis sin contenido ("profundamente", "innegablemente", "sinergia")? Ese relleno sofisticado es una firma típica de texto generado.</li>
</ul>
</div>
<div class="parchment-subsection">
<h4>Los testigos (contexto, no voto)</h4>
<ul class="parchment-list">
<li><strong>Repetición de bigramas.</strong> Los pares de términos técnicos que se repiten son propios de un dominio especializado: una señal humana.</li>
<li><strong>Conectores vacíos.</strong> El abuso de muletillas solemnes ("cabe destacar", "en el panorama actual") inclina hacia lo automático.</li>
<li><strong>Uniformidad de párrafos.</strong> Párrafos artificialmente simétricos sugieren plantilla; párrafos desiguales sugieren escritura orgánica.</li>
</ul>
</div>
<div class="parchment-subsection">
<h4>La huella digital del archivo</h4>
<p class="parchment-note">Si el propio PDF declara como autor a un modelo, o si un texto extenso fue creado y modificado en pocos minutos, eso suma compatibilidad con IA. Si muestra una cadena editorial profesional o un historial de edición de varios días, resta. Si el archivo fue re-procesado por herramientas que borran metadatos, la huella simplemente no se puntúa.</p>
</div>
<div class="parchment-subsection">
<h4>Las bandas del veredicto</h4>
<ul class="parchment-list">
<li><strong>Menos de 35 %:</strong> sin indicios significativos de generación automática.</li>
<li><strong>35 a 64 %:</strong> zona gris: patrones mixtos; revisa las evidencias marcadas.</li>
<li><strong>65 a 84 %:</strong> varios patrones compatibles con generación por IA.</li>
<li><strong>85 % o más:</strong> múltiples pilares y la huella digital coinciden en patrones de IA.</li>
</ul>
<p class="parchment-note">En todos los casos, el informe cita las evidencias concretas que motivaron el resultado: la decisión final siempre es tuya.</p>
</div>`
        }
    };

    const content = document.getElementById('method-content');

    function openMethod(key) {
        const data = METHOD_DATA[key];
        if (!data || !content || !window.ParchmentModal) return;
        content.innerHTML = data.html;
        window.ParchmentModal.open({ title: data.title, panelId: 'method-panel' });
    }

    document.getElementById('btn-url-method')?.addEventListener('click', (event) => {
        event.stopPropagation();
        openMethod('url');
    });
    document.getElementById('btn-pdf-method')?.addEventListener('click', (event) => {
        event.stopPropagation();
        openMethod('pdf');
    });
});