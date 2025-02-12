const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Comment = require("./models/Comment");

const app = express();
app.use(express.json());

// Configure CORS (Restrict in Production)
app.use(cors({ origin: "http://127.0.0.1:5500" }));

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if MongoDB connection fails
    });

// API Route to Add a Comment
app.post("/api/comments", async (req, res) => {
    try {
        const { text } = req.body;

        // Validate text input
        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Comment text cannot be empty." });
        }

        const newComment = new Comment({ text: text.trim() });
        await newComment.save();

        res.status(201).json({ message: "✅ Comment added!", comment: newComment });
    } catch (err) {
        console.error("❌ Error adding comment:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// API Route to Get All Comments
app.get("/api/comments", async (req, res) => {
    try {
        const comments = await CommentModel.find();
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
