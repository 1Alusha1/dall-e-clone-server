import express from "express";
import * as dotenv from "dotenv";

import Post from "../mongodb/models/post.js";

dotenv.config();
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json({ message: "Posts successfuly got", data: post });
  } catch (err) {
    res.status(500).json({ message: "Posts wasn't found" });
  }
});

router.post("/save-post", (req, res) => {
  const { dto } = req.body;

  try {
    const post = new Post({ ...dto });

    post.save();
    res.status(200).json({ message: "Your post was saved" });
  } catch (err) {
    if (err) throw err;
    res.status(500).json({ message: "Your post wasn't saved" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const posts = await Post.find({
      $or: [
        { name: { $regex: query.toLowerCase(), $options: "i" } },
        { prompt: { $regex: query.toLowerCase(), $options: "i" } },
      ],
    });
    res
      .status(200)
      .json({ message: "Records that have been found", data: posts });
  } catch (err) {
    if (err) console.log(err);
    res.status(500).json({ message: "There're nothing by your query" });
  }
});

export default router;
