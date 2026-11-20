window.APP_CONFIG = Object.freeze({
    API_BASE_URL: (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
        ? 'http://127.0.0.1:8080'                     // desarrollo local
        : 'https://backend-bli.onrender.com'            // producción: tu URL real de Render
});