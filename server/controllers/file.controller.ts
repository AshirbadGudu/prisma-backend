import { RequestHandler } from "express";
import fs from "fs";
import sharp from "sharp";

export const fileController: {
  upload: RequestHandler;
  delete: RequestHandler;
  uploadWebp: RequestHandler;
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

  async uploadWebp(req, res, next) {
    try {
      // Explicitly specify the type for req.files
      const files = req.files as Express.Multer.File[];
      if (files) {
        const webpImages = await Promise.all(
          files.map(async (file) => {
            return sharp(file.path)
              .webp()
              .toBuffer()
              .then((webpBuffer) => {
                const webpFileName = "converted_" + file.originalname + ".webp";
                // Save the WebP file to a folder
                const outputPath = "./uploads/webp/" + webpFileName;
                fs.writeFileSync(outputPath, webpBuffer);
                return {
                  originalname: file.originalname,
                  webpFileName: webpFileName,
                };
              });
          })
        );

        res.json({
          success: true,
          msg: "Files uploaded and converted to WebP successfully",
          files: webpImages,
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
};
