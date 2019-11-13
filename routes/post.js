const express = require("express");
const router = express.Router();

const auth = require("../common/auth")();

const { Post, validatePost } = require("../model/post");
const { Tag } = require("../model/tag");

router.post("/", auth.authentication(), async (req, res, next) => {
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
});

module.exports = router;