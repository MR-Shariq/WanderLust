const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,

});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        transformation: [
            { width: 500, height: 500, crop: 'fill' }, // Set height and width
          ],
    },
});

module.exports = { cloudinary, storage };



