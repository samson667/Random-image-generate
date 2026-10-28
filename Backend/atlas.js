import "dotenv/config";
import mongoose from "mongoose";

await mongoose.connect(process.env.DB_CONNECT_URL);

console.log("MongoDB Atlas connected!");

const validation = new mongoose.Schema({
    token: { 
        type: String, 
        required: true, 
        unique: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
       }
});
const data_base = mongoose.model(
    "token_model",
    validation,
    "user_tokens"
);


 export default data_base
// await mongoose.disconnect();