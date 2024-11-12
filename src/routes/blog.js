// blog.js

const { blog, media, profile } = require("../controllers/blog");
const parser = require("../config/multer");

module.exports = (app) => {
  app.post("/blog", blog);
  app.post("/blog-pictures", parser.single("media"), (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    // The file is already uploaded to Cloudinary via the parser middleware
    res.json({ success: true, url: req.file.path });
  });
  app.post("/media", media);
  app.post("/profile", profile);
};
