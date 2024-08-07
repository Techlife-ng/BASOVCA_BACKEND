const cloudinary = require("cloudinary").v2;
const {
  CloudinaryStorage
} = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "youngTech/blog1",
    format: async (req, file) => "png",
    // forces png format
    public_id: (req, file) => {
      console.log(file);
      return file.originalname;
    }
  }
});
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
module.exports = {
  upload: multer({
    storage
  }),
  imageUpload: multer({
    storage: cloudStorage
  })
};
//# sourceMappingURL=multer.js.map