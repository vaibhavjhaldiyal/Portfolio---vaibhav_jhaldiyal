const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const Comment = require("./models/Comment");

const app = express();
app.use(express.json());

// ✅ Improved CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL, // Allow frontend from .env
    "http://localhost:3000" // Allow localhost for development
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("❌ Not allowed by CORS"));
        }
    },
    credentials: true
}));

console.log("✅ Allowed Origins:", allowedOrigins);

// ✅ Ensure MongoDB URI is loaded
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing! Set it in .env file.");
    process.exit(1);
}

// ✅ Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// ✅ API Route: Add a Comment
app.post("/api/comments", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "❌ Comment text cannot be empty." });
        }

        const newComment = new Comment({ text: text.trim() });
        await newComment.save();

        res.status(201).json({ message: "✅ Comment added!", comment: newComment });
    } catch (err) {
        console.error("❌ Error adding comment:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// ✅ API Route: Get All Comments
app.get("/api/comments", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


