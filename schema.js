const Joi = require("joi");

module.exports.ListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().trim().required(),
    image: Joi.object({
      filename: Joi.string(),
      url: Joi.string().required(),
    }),
  }).required(),
});

module.exports.ReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
