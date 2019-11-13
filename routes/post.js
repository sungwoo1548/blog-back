const express = require("express");
const router = express.Router();

const auth = require("../common/auth")();

const { Post, validatePost } = require("../model/post");
const { Tag } = require("../model/tag");

const wrapper = require("../common/wrapper");

router.post("/", auth.authentication(), wrapper(async (req, res, next) => {
    if (!req.user.admin) {
        res.json({ error: "unauthorized" });
        next();
        return;
    }
    const { title, contents, tags } = req.body;
    // const { id, name, email } = req.user;

    if (validatePost(req.body).error) {
        res.status(400).json({ result: false, error: "양식에 맞지 않음" });
        next();
        return;
    }
    const post = new Post({
        title,
        author: req.user.id,
        contents,
        tags
    });
    await post.save();

    for (const tag_id of tags) { // 
        const tag = await Tag.findById(tag_id);
        tag.posts.push(post._id)
        await tag.save();
    }
    res.json({ result: true });
    next();
}));

router.get("/", wrapper(async (req, res, next) => {
    const { tag, page = "1" } = req.query;
    const skip = parseInt(page) * 5 - 5;

    if (tag) {
        const posts = await Post.find()
            .where("tags")
            .in(tag)
            .skip(skip)
            .limit(5)
            .sort("-date")
            .populate("tags");
        res.json({ posts });
    } else {
        const posts = await Post.find().limit(5).skip(skip).sort("-date").populate("tags");
        res.json({ posts });
    }
    next();
}));

router.get("/:id", wrapper(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate("tags");
    res.json(post);
    next();
}));

router.patch("/:id", auth.authentication(), wrapper(async (req, res, next) => {
    if (!req.user.admin) {
        res.json({ error: "unauthorized" });
        next();
        return;
    }
    await Post.updateOne({ _id: req.params.id }, req.body);
    res.json({ result: true });
    next();
}));

router.delete("/:id", auth.authentication(), wrapper(async (req, res, next) => {
    if (!req.user.admin) {
        res.json({ error: "unauthorized" });
        next();
        return;
    }
    await Post.deleteOne({ _id: req.params.id });
    res.json({ result: true });
    next();
}));
module.exports = router;