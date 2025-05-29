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
const fs = require("fs");
const util = require("util");
const db = require("../models"); // Adjust path as needed

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

  app.delete("/uploads-delete/:filename", async (req, res) => {
    const filename = req.params.filename;
    const unlinkAsync = util.promisify(fs.unlink);

    const filePath = path.join(__dirname, "..", "uploads", filename);

    try {
      // Delete file from filesystem
      await unlinkAsync(filePath);

      // Delete file record from DB (assuming a 'Document' model with 'filename' field)
      // Use a raw query to select and then delete the document
      const [docs] = await db.sequelize.query(
        "SELECT * FROM document WHERE doc_url = :filename",
        { replacements: { filename }, type: db.sequelize.QueryTypes.SELECT }
      );

      if (!docs) {
        return res.status(404).json({ error: "File not found in database" });
      }

      const result = await db.sequelize.query(
        "DELETE FROM document WHERE doc_url = :filename",
        { replacements: { filename }, type: db.sequelize.QueryTypes.DELETE }
      );

      if (result === 0) {
        return res.status(404).json({ error: "File not found in database" });
      }

      res.json({ message: "File deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting file", details: err.message });
    }
  });
};
