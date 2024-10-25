import mongoose from "mongoose";

const Image = new mongoose.Schema({
  src: { type: String, required: true },
});

const ImageSchema = mongoose.model("Image", Image);

export default ImageSchema;
