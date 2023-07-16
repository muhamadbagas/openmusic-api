const Joi = require('joi');

// Mengantisipasi input tahun yang asal-asalan (Terlalu kecil tahunnya atau melewati angka tahun ini)
const currentYear = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1800).max(currentYear).required(),
});

module.exports = { AlbumPayloadSchema };
