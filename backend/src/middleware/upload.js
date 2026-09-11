const multer = require('multer');

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'));
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 10 }, // 8MB por imagen, hasta 10 imágenes
});

module.exports = { upload };
