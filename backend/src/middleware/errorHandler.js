function notFound(req, res, next) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'El archivo es demasiado grande.' });
  }

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor.';

  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
