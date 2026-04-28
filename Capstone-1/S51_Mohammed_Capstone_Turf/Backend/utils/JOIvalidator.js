const Joi = require('joi');

const validator = (schema) => (data) => 
  schema.validate(data, { abortEarly: false });

const turfUploadSchema = Joi.object({
  turfThumbnail: Joi.string().required(),
  turfImages: Joi.array().items(Joi.string().required()).min(1).required(),
  turfName: Joi.string().required().min(4).max(30),
  turfDescription: Joi.string().required().min(4).max(500),
  ownerContact: Joi.number().required(),
  ownerName: Joi.string().required().min(2).max(60),
  ownerEmail: Joi.string().email({ tlds: { allow: false } }).required(),
  address: Joi.string().required().max(200),
  turfDistrict: Joi.string().required(),
  turfTimings: Joi.array().items(Joi.object({
    day: Joi.string().required(),
    start: Joi.string().required(),
    end: Joi.string().required(),
  })).required(),
  turfSportCategory: Joi.string().required(),
  turfPrice: Joi.number().required().max(9999),
  userID: Joi.string().optional(), // Set by backend from req.user.appwriteId
});

const turfUploadValidator = validator(turfUploadSchema);

module.exports = turfUploadValidator;
