import File from "../models/file.js";
import dotenv from 'dotenv';

dotenv.config();

export const uploadImage = async(request, response) => {
    const fileObj = {
        path: request.file.path,
        name: request.file.originalname,
    }
    try{
        const file = await File.create(fileObj);
        // Fix: Update the URL to include the correct path
        response.status(200).json({path: `https://file-share-backend-x6yn.onrender.com/api/files/file/${file._id}` })
    }catch(error){
        console.error(error.message);
        response.status(500).json({error: error.message})
    }
}

export const downloadImage = async (request, response) => {
    try{
        const file = await File.findById(request.params.fileID);
        const fileId = request.params.fileID;
        console.log("File ID: ", fileId);
        if (!file) {
            return response.status(404).json({ error: 'File not found' });
        }
        file.downloadCount++;
        await file.save();
        response.download(file.path, file.name)
    }catch(error){
        console.error(error.message);
        return response.status(500).json({error: error.message})
    }
}
