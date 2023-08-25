const Joi = require('joi');

// Mengantisipasi input tahun sembarang (Terlalu kecil tahunnya/melewati tahun ini)
const currentYear = new Date().getFullYear();

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1800).max(currentYear).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { SongPayloadSchema };
