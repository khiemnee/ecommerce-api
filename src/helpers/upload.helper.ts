import cloudinary from "./cloudinary.helper";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "demo",
      allowedFormats: ["jpg", "png"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});
const upload = multer({ storage: storage });

export default upload;
