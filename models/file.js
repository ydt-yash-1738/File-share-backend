// import mongoose from "mongoose";

// const FileSchema = new mongoose.Schema({
//     path: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     downloadCount: {
//         type: Number,
//         required: true,
//         default: 0
//     }
// })

// const File = mongoose.model('file', FileSchema);

// export default File;

import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        default: 0
    },
    type: {
        type: String
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const File = mongoose.model('file', FileSchema);

export default File;
