import db from "../models";
export const attachmentsApi = ({
  query_type = null,
  filename = null,
  source_id = null,
  file_location = null,
  created_by = null,
  created_at = null,
  file_format = null,
  file_type = null,
  society_id = ""
}, callback = f => f, error = f => f) => {
  db.sequelize.query(`CALL query_attachments (:query_type, :filename, :source_id, 
    :file_location, :created_by, :created_at, :file_format, :file_type, :society_id)`, {
    replacements: {
      query_type,
      filename,
      source_id,
      file_location,
      created_by,
      created_at,
      file_format,
      file_type,
      society_id
    }
  }).then(callback).catch(error);
};
//# sourceMappingURL=config.js.map