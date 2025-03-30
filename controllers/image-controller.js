// import File from "../models/file.js";
// import dotenv from 'dotenv';

// dotenv.config();

// export const uploadImage = async(request, response) => {
//     const fileObj = {
//         path: request.file.path,
//         name: request.file.originalname,
//     }
//     try{
//         const file = await File.create(fileObj);
//         // Fix: Update the URL to include the correct path
//         response.status(200).json({path: `https://file-share-backend-x6yn.onrender.com/api/files/file/${file._id}` })
//     }catch(error){
//         console.error(error.message);
//         response.status(500).json({error: error.message})
//     }
// }

// export const downloadImage = async (request, response) => {
//     try{
//         const file = await File.findById(request.params.fileID);
//         const fileId = request.params.fileID;
//         console.log("File ID: ", fileId);
//         if (!file) {
//             return response.status(404).json({ error: 'File not found' });
//         }
//         file.downloadCount++;
//         await file.save();
//         response.download(file.path, file.name)
//     }catch(error){
//         console.error(error.message);
//         return response.status(500).json({error: error.message})
//     }
// }


import File from "../models/file.js";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const uploadImage = async(request, response) => {
    console.log("Upload request received");
    
    if (!request.file) {
        console.error("No file received in request");
        return response.status(400).json({ error: "No file received" });
    }
    
    console.log("File received:", {
        originalname: request.file.originalname,
        path: request.file.path,
        size: request.file.size,
        mimetype: request.file.mimetype
    });
    
    // Store absolute path for consistent access
    const absolutePath = path.resolve(request.file.path);
    
    const fileObj = {
        path: absolutePath,
        name: request.file.originalname,
        size: request.file.size,
        type: request.file.mimetype
    };
    
    try {
        console.log("Creating file record with:", fileObj);
        const file = await File.create(fileObj);
        console.log("File record created with ID:", file._id);
        
        // Use environment variable or fallback for base URL
        const baseUrl = process.env.BASE_URL || 'https://file-share-backend-iha5.onrender.com';
        const fileUrl = `${baseUrl}/api/files/file/${file._id}`;
        
        console.log("Returning file URL:", fileUrl);
        response.status(200).json({ path: fileUrl });
    } catch(error) {
        console.error("Error in uploadImage:", error.message);
        response.status(500).json({ error: error.message });
    }
}

export const downloadImage = async (request, response) => {
    try {
        const fileId = request.params.fileID;
        console.log("Download request for file ID:", fileId);
        
        const file = await File.findById(fileId);
        
        if (!file) {
            console.log("File not found in database");
            return response.status(404).json({ error: 'File not found' });
        }
        
        console.log("File found in database:", {
            id: file._id,
            name: file.name,
            path: file.path
        });
        
        // Verify file exists on disk
        const fs = await import('fs');
        if (!fs.existsSync(file.path)) {
            console.error(`File not found on disk at path: ${file.path}`);
            return response.status(404).json({ error: 'File not found on server disk' });
        }
        
        console.log(`File exists on disk, sending: ${file.path}`);
        
        // Update download count
        file.downloadCount++;
        await file.save();
        
        response.download(file.path, file.name, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                // Check if response has already been sent
                if (!response.headersSent) {
                    return response.status(500).json({ error: 'Error downloading file' });
                }
            }
        });
    } catch(error) {
        console.error("Error in downloadImage:", error.message);
        return response.status(500).json({ error: error.message });
    }
}
