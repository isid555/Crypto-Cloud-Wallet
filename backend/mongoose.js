const mongoose = require("mongoose");

const MONGO_URI =
    "mongodb+srv://fisid555:yKj1L5tz8y0hSQx8@cluster0.xpq0k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("⚡ MongoDB already connected.");
            return;
        }

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

// Define User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    privateKey: String,
    publicKey: String,
});

const userModel = mongoose.model("users", UserSchema);

module.exports = { userModel, connectDB };
