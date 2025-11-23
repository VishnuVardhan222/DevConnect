const express = require('express');
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
    try{
        const post = new Post({ user:req.user.id, content: req.body.content});
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: "Error creating post"});
    }
}
);

router.get("/", auth, async (req, res) => {
    try{
        const posts = await Post.find().populate("user", "name email").sort({createdAt: -1});
        res.json(posts);
    }catch (err) {
        res.status(500).json({ message: "Error fetching posts"});
    }
});

router.put("/:id", auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ message: "Post not found"});
        if(post.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized"});


        post.content = req.body.content;
        await post.save();
        res.json(post);

    } catch (err) {
        res.status(500).json({ message: "Error updating post"});
    }
});

router.delete("/:id", auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ message: "Post not found"});
        if (post.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized"});  

        await post.deleteOne();
        res.json({ message: "Post deleted"});
    }catch (err) {
        res.status(500).json({ message: "Error deleting post"});
    }

});

router.put("/:id/like", auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ message: "post not found"});

        if(!post.likes.includes(req.user.id)){
            post.likes.push(req.user.id);
            await post.save();
        }

        const updated = await post.populate("user","name");
        res.json(updated);
    }catch (err) {
        res.status(500).json({ message: "Error liking post"});
    }
});

router.put("/:id/unlike", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
        await post.save();

        const updated = await post.populate("user", "name");
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error unliking post" });
    }
});

router.post("/:id/comment", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { user: req.user.id, text: req.body.text };
    post.comments.push(newComment);
    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("user", "name")
      .populate("comments.user", "name");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name")
      .populate("comments.user", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post details" });
  }
});

module.exports = router;