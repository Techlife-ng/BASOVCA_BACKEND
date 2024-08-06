import db from "../models";
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "yemight",
  api_key: process.env.CLOUDIARYAPI,
  api_secret: process.env.CLOUDIARYSECRETKEY,
});

const blog = (req, res) => {
  // console.log(req.body,"KSKKS")
  const {
    id = null,
    title = null,
    content = null,
    attechment = null,
    doc_type = "normal",
    query_type = "insert",
    created_at= null
  } = req.body.newForm;
  console.log(req.body.newForm);
  db.sequelize
    .query(`call blog(:query_type,:id,:title,:content,:attechment,:doc_type,:created_at)`, {
      replacements: {
        query_type,
        id,
        title,
        content,
        attechment,
        doc_type,
        created_at
      },
    })
    .then((resp) => res.status(200).json({ success: true, resp }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false });
    });
};



export {
  blog
}