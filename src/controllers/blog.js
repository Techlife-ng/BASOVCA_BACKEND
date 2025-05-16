const db = require("../models");
const cloudinary = require("cloudinary");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

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
    query_type = "select",
    created_at = null,
  } = req.body.newForm;
  console.log(req.body.newForm);
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

module.exports.media = (req, res) => {
  const {
    title = null,
    url = null,
    image_url = null,
    type = "music",
    duration = "",
    description = "",
  } = req.body.newForm;
  const { query_type = "select" } = req.query;
  db.sequelize
    .query(
      `call media(:query_type,:title,:type,:image_url,:url,:description,:duration)`,
      {
        replacements: {
          query_type,
          url,
          title,
          type,
          image_url,
          duration,
          description,
        },
      }
    )
    .then((resp) => res.status(200).json({ success: true, resp }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false });
    });
};

module.exports.profile = (req, res) => {
  const {
    description = "",
    full_name = "",
    image_url = "",
    title = "",
  } = req.body.newForm;
  const { query_type = "select" } = req.query;
  db.sequelize
    .query(
      `call profile(:query_type,:full_name,:description,:title,:image_url)`,
      {
        replacements: {
          query_type,
          full_name,
          title,
          image_url,
          description,
        },
      }
    )
    .then((resp) => res.status(200).json({ success: true, resp }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false });
    });
};

module.exports.insertDocument = async (req, res) => {
  // Validate request
  if (!req.files || !req.files.document) {
    return res.status(400).json({ message: "No document file uploaded" });
  }

  // Parse form data with defaults
  const formData = req.body.form ? JSON.parse(req.body.form) : {};
  const {
    docType = null,
    remark = null, // Using null instead of empty string for database
    user_id = null,
    department = null,
  } = formData;
  const req_id = uuidv4();
  // Get uploaded files (handles single file or array)
  const documents = Array.isArray(req.files.document)
    ? req.files.document
    : [req.files.document];

  try {
    // Process each uploaded file
    for (const file of documents) {
      await db.sequelize.query(
        `INSERT INTO document(doc_url, doc_type, remark, user_id, department, req_id) 
         VALUES (:doc_url, :doc_type, :remark, :user_id, :department, :req_id)`,
        {
          replacements: {
            doc_url: file.path.replace("src/", ""),
            doc_type: docType || null,
            remark: remark || null,
            user_id: user_id || null,
            department: department || null,
            req_id: req_id || null,
          },
          type: db.sequelize.QueryTypes.INSERT,
        }
      );
    }

    res.status(201).json({ message: "Document(s) inserted successfully" });
  } catch (error) {
    console.error("Error inserting document:", error);
    res.status(500).json({
      message: "Error inserting document",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports.selectDoc = (req, res) => {
  const today = moment().format("YYYY-MM-DD");
  const monthAgo = moment(today).subtract(5, "months").format("YYYY-MM-DD");
  const {
    query_type = "by_department",
    from = monthAgo,
    to = today,
    department = null,
  } = req.query;
  db.sequelize
    .query(`call document(:from, :to, :department, :query_type)`, {
      replacements: {
        from,
        to,
        department,
        query_type,
      },
    })
    .then((resp) => res.status(200).json({ success: true, data: resp }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false });
    });
};

module.exports.getDocuments = async (req, res) => {
  const { req_id } = req.query;

  try {
    const documents = await db.sequelize.query(
      `SELECT * FROM document WHERE req_id = :req_id`,
      {
        replacements: { req_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    res.status(200).json({ success: true, data:documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      message: "Error fetching documents",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};
