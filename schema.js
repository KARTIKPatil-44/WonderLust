const Joi = require("joi");
const review = require("./models/review");

module.exports.ListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().uri().allow("", null), // Only if you want to enforce URLs
  }).required(),
});

module.exports.ReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
