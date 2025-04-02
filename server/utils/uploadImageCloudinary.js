import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET_KEY
})

const uploadImageClodinary = async(image)=>{
    if (!image || !image.buffer) {
        throw new Error("Invalid image file");
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "binkeyit" },
            (error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                resolve(uploadResult);
            }
        );

        uploadStream.end(image.buffer);
    });
}
export default uploadImageClodinary
