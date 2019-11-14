const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Joi = require("@hapi/joi");

const commentSchema = new Schema({
    post_id : { type: mongoose.Types.ObjectId, ref: "Post" },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    contents: String,
});

const Comment = model("Comment", commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        post_id: Joi.string(),
        author: Joi.string(),
        date: Joi.date(),
        contents: Joi.string(),
    });

    return schema.validate(comment);
}

module.exports = { Comment, validateComment };