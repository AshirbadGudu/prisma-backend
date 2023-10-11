import { RequestHandler } from "express";
import fs from "fs";

export const fileController: {
  upload: RequestHandler;
  delete: RequestHandler;
} = {
  upload(req, res, next) {
    try {
      if (req.files) {
        // Files have been uploaded successfully, you can access them in req.files
        res.json({
          success: true,
          msg: "Files uploaded successfully",
          files: req.files,
        });
      } else {
        res.status(400).json({
          success: false,
          msg: "No files uploaded",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  delete(req, res, next) {
    try {
      const { filename } = req.query;
      if (!filename) {
        res.status(400).json({
          success: false,
          msg: "Filename is missing in the query parameters",
        });
        return;
      }

      // Construct the path to the file in the 'uploads' directory
      const filePath = `uploads/${filename}`;

      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlinkSync(filePath);
        res.json({
          success: true,
          msg: "File deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          msg: "File not found",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
