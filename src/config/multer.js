const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import multer from "multer";

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "youngTech/blog1",
    format: "png", // supports promises as well
    public_id: (req, file) => {
      console.log(file);
      return file.originalname;
    },
  },
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
    // cb(null, '/config')
  },

  // destination: '/tmp/my-uploads', .single('avatar')

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
export const imageUpload = multer({ storage: cloudStorage });
