const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Joi = require("@hapi/joi");

const tagSchema = new Schema({
    name: String,
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }]
});

const Tag = model("Post", tagSchema);

function validateTag(tag) {
    const schema = Joi.object({
        name: Joi.string(),
        posts: Joi.array().items(Joi.string()),
    });

    return schema.validate(tag);
}

module.exports = { Tag, validateTag };