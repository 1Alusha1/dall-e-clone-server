import express from "express";
import * as dotenv from "dotenv";
import Post from "../mongodb/models/post.js";
import Image from "../mongodb/models/image.js";

import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
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
    const uploadPath = path.join(
      __dirname,
      "..",
      "uploads",
      generateUUID() + photo.name
    );

    await photo.mv(uploadPath, (err) => {
      if (err) {
        console.log('Error moving file:', err);
        return res.status(500).json({ message: "File upload error" });
      }
    });

    const image = await new Image({ src: uploadPath }).save();


    const post = new Post({ name, prompt, photo: image._id });
    await post.save();

    res.status(200).json({ message: "Your post was saved" });
  } catch (err) {
    res.status(500).json({ message: "Your post wasn't saved" });
  }
});

router.get("/show-photo", async (req, res) => {
  const { id } = req.query;

  const image = await Image.findOne({ _id: id });

  if (image && image.src) {
    return res.sendFile(image.src, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).send('Error sending image');
      }
    });
  }

  res.status(404).send('Image not found');
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
