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

module.exports = (app) => {
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
};
