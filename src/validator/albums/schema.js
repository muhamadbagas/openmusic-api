const Joi = require('joi');

// Mengantisipasi input tahun sembarang (Terlalu kecil tahunnya/melewati tahun ini)
const currentYear = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1800).max(currentYear).required(),
});

const AlbumLikesPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  albumId: Joi.string().required(),
});

module.exports = { AlbumPayloadSchema, AlbumLikesPayloadSchema };
