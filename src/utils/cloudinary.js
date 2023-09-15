const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async(localFilePath, filename) => {
    try {
        const folder = "test";
        const filePathOnCloudinary = folder + "/" + path.parse(filename).name;
        
        if (fs.existsSync(localFilePath)) {
            const result = await cloudinary.uploader.upload( 
                localFilePath, 
                { "public_id": filePathOnCloudinary }
            );
            return result;
        } else {
            console.error(`Archivo local no encontrado en la ruta: ${localFilePath}`);
            return { message: "Archivo local no encontrado" };
        }
    } catch (error) {
        console.error(error);
        return { message: "Upload to Cloudinary failed" };
    } finally {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
}


const deleteFromCloudinary = async(publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
        return { message: "Delete from cloudinary failed" }
    }
}

module.exports = { uploadToCloudinary, deleteFromCloudinary };