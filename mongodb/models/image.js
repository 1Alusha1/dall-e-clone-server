import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  data: { type: String, required: true },  // Base64 строка
  contentType: { type: String, required: true }  // MIME-тип файла (например, image/png)
});

const Image = mongoose.model('Image', imageSchema);

export default Image;
