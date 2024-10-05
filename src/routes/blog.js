const parser = require("../config/multer");
const { blog } = require("../controllers/blog");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
// const config = require("../config/config");

cloudinary.config({
  cloud_name: "yemight",
  api_key: "437383159175644",
  api_secret: "_dim6imoS_SCIgc915dy8aud-Ns",
});
const upload = parser;

module.exports = (app) => {
  app.post("/blog", blog);
  app.post("/blog-pictures", upload.single("media"), (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    // Upload the file to Cloudinary
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (result && result.secure_url) {
          // Upload to Cloudinary is successful
          res.json({ success: true, url: result.secure_url });
        } else {
          // Error occurred during file upload to Cloudinary
          console.error("Error uploading to Cloudinary:", error || result);
          res
            .status(500)
            .json({ success: false, error: "Error uploading to Cloudinary" });
        }
      })
      .end(req.file.buffer);
  });
};
