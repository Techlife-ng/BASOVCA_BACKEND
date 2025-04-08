// multer.js

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storages = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "youngTech/blog1",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "mp4", "ogg", "3gp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const parser = multer({ storage: storages });





const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure the 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Multer middleware for multiple file uploads
const upload = multer({ storage: storage }) // 'files' is the field name and 10 is the max number of files
module.exports = upload;