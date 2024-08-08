const db = require("../models");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports.blog = (req, res) => {
   const {
     id = null,
     title = null,
     content = null,
     attechment = null,
     doc_type = "normal",
     query_type = "insert",
     created_at = null,
   } = req.body.newForm;
  //  console.log(req.body.newForm);
   db.sequelize
     .query(
       `call blog(:query_type,:id,:title,:content,:attechment,:doc_type,:created_at)`,
       {
         replacements: {
           query_type,
           id,
           title,
           content,
           attechment,
           doc_type,
           created_at,
         },
       }
     )
     .then((resp) => res.status(200).json({ success: true, resp }))
     .catch((err) => {
       console.log(err);
       res.status(500).json({ success: false });
     });
};

module.exports.postAttachments = (req, res) => {
  const attachment = req.body.media; // Assuming req.body.media is a single file
  console.log({ attachment, cloud: cloudinary.config().cloud_name });
  // Upload the file to Cloudinary
  uploadToCloudinary(attachment)
    .then((result) => {
      // Upload to Cloudinary is successful
      // Send response with success status and attachment URL
      res.json({ success: true, attachment: result.secure_url });
    })
    .catch((error) => {
      // Error occurred during file upload to Cloudinary
      console.error("Error uploading to Cloudinary:", error);
      res
        .status(500)
        .json({ success: false, error: "Error uploading to Cloudinary" });
    });
};
// Function to upload a file to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (result) => {
      if (result.secure_url) {
        resolve(result);
      } else {
        reject("Upload to Cloudinary failed");
      }
    });
  });
};
