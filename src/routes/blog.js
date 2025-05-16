// blog.js

const {
  blog,
  media,
  profile,
  insertDocument,
  getDocuments,
  selectDoc,
} = require("../controllers/blog");
const { upload } = require("../config/multer");
const path = require("path");

module.exports = (app) => {
  app.use(
    "/uploads",
    require("express").static(path.join(__dirname, "..", "uploads"))
  );
  app.post("/blog", blog);

  app.post("/media", media);
  app.post("/profile", profile);

  app.post(
    "/insert/document",
    upload.fields([{ name: "document", maxCount: 20 }]),
    insertDocument
  );
  app.get("/select/document", selectDoc);
  app.get("/get/file", getDocuments);
  app.get("/uploads/:filename", (req, res) => {
    // Only use the filename, not the full path from DB
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "..", "uploads", filename);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ error: "File not found" });
      }
    });
  });
};
