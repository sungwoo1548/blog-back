const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Joi = require("@hapi/joi");

const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    admin: Boolean
});

const User = model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
    });

    return schema.validate(user);
}

module.exports = { User, validateUser };