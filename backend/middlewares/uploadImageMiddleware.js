const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Optional: specify the folder name in Cloudinary
    format: async (req, file) => 'png', // Optional: format of the file in Cloudinary
    public_id: (req, file) => file.fieldname + '-' + Date.now(), // Optional: public ID of the file in Cloudinary
  },
});


const upload = multer({ storage: storage });

module.exports = upload;
