const db = require("../models");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "yemight",
  api_key: process.env.CLOUDIARYAPI,
  api_secret: process.env.CLOUDIARYSECRETKEY,
});

module.exports.blog = (req, res) => {
  console.log(req.body);
  const {
    query_type = "insert",
    id = "",
    title = "",
    content = "",
    attechment = "",
  } = req.body;
  db.sequelize
    .query(`call blog(:query_type,:id,:title,:content,:attechment)`, {
      replacements: {
        query_type,
        id,
        title,
        content,
        attechment,
      },
    })
    .then((resp) => res.status(200).json({ success: true, resp }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false });
    });
};

module.exports.get_blog = (req, res) => {
  const {
    id = "",
    query_type = "select",
    title = "",
    content = "",
    attechment = "",
  } = req.query;
  console.log({ Q: req.query });
  db.sequelize
    .query(`call blog(:query_type,:id,:title,:content,:attechment)`, {
      replacements: {
        id: isNaN(parseInt(id)) ? null : parseInt(id),
        query_type,
        title,
        content,
        attechment,
      },
    })
    .then((resp) => res.status(200).json({ success: true, data: resp }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false });
    });
};
module.exports.delete_blog = (req, res) => {
  const {} = req.body;
  const {
    id = "",
    query_type = "delete",
    title = "",
    content = "",
    attechment = "",
  } = req.body;
  db.sequelize
    .query(`call blog(:query_type,:id,:title,:content,:attechment)`, {
      replacements: {
        id,
        query_type,
        title,
        content,
        attechment,
      },
    })
    .then((resp) => res.status(200).json({ success: true, data: resp }))
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
