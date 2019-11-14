const express = require("express");
const router = express.Router();

const auth = require("../common/auth")();
const wrrapper = require("../common/wrapper");

const { Comment, validateComment } = require("../model/comment");
const { Post } = require("../model/post");

router.post("/", auth.authentication(), wrrapper(async (req, res, next) => { // 글쓰기
    const { post_id, contents } = req.body;
    if (validateComment(req.body).error) {
        res.json({ error: "양식에 맞지 않음" });
        next();
        return;
    };
    const comment = new Comment({
        post_id,
        contents,
        author: req.user.id
    });
    await comment.save();

    const post = await Post.findById(post_id);
    post.comments.push(comment._id);
    await post.save();

    res.json({ result: true });
    next();
}));

router.get("/", wrrapper(async (req, res, next) => { // 해당 post의 댓글 불러오기
    const { post_id } = req.query;   // query ;   url?post_id="123123123"
    const comments = await Post.findById(post_id)
        .select("commemts")
        .populate("comments", "author contents date");

    res.json({ comments });
    next();
}));

router.delete("/:id", auth.authentication(), wrrapper(async (req, res, next) => { // 댓글 주인만 삭제가능
    const comment = await Comment.findById(req.params.id);
    if (req.user.id.toString() !== comment.author.toString()) {
        res.json({ error: "unAuthorized", result: false });
    } else {
        const post = await Post.findById(comment.post_id);
        const index = post.comments.indexOf(comment._id);
        post.comments.splice(index,1); // array.splice(ix,num) ix부터 num개 삭제된 array반환
        await post.save();

        await Comment.deleteOne({ _id: req.params.id });
        res.json({ result: true });
    }
    next();
}));

module.exports = router;