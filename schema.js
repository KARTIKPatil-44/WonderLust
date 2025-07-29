const Joi = require("joi");

module.exports.ListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    price: Joi.number().required().min(0).strict(),
    image: Joi.string().uri().allow("", null)  // Only if you want to enforce URLs
  }).required()
});
