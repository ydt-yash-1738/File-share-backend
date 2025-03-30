import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DBConnection = async() => {

    const USERNAME = process.env.DB_USERNAME;
    const PASSWORD = process.env.DB_PASSWORD;
    try{
        await mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.pbu4g.mongodb.net/`);
        console.log("Database connected successfully");
    }catch(error){
        console.error('Error while connecting the database', error.message);
    }
}

export default DBConnection;