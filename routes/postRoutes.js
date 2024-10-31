import express from "express";
import * as dotenv from "dotenv";
import Post from "../mongodb/models/post.js";
import Image from "../mongodb/models/image.js";

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

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

router.post("/save-post", async (req, res) => {
  const { name, prompt } = req.body;
  const { photo } = req.files;

  try {
    if (!photo || Object.keys(photo).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    if (!name || !prompt) {
      return res.status(400).send("You must be enter name and prompt");
    }

    const base64 = photo.data.toString("base64");

    const image = await new Image({
      data: base64,
      contentType: photo.mimetype,
    }).save();

    const post = new Post({ name, prompt, photo: image._id });
    await post.save();

    res.status(200).json({ message: "Your post was saved" });
  } catch (err) {
    res.status(500).json({ message: "Your post wasn't saved" });
  }
});

router.get("/show-photo", async (req, res) => {
  const { id } = req.query;

  try {
    const image = await Image.findOne({ _id: id });

    if (!image) {
      return res.status(404).send("Image not found");
    }

    res.contentType(image.contentType);
    res.send(Buffer.from(image.data, "base64"));
  } catch (err) {
    res.status(500).send(err.message);
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
