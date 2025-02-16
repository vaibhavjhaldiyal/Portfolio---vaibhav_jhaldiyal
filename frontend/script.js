const BACKEND_URL = "https://portfolio-vaibhav-jhaldiyalw.onrender.com"; // ✅ Update with actual backend URL

// ✅ Function to Submit a Comment
async function submitComment() {
    const commentInput = document.getElementById("commentText");
    if (!commentInput) {
        console.error("❌ Element #commentText not found!");
        return;
    }

    let commentText = commentInput.value.trim();

    if (!commentText) {
        alert("⚠️ Please enter a comment!");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: commentText }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ Comment submitted!");
            commentInput.value = ""; // ✅ Clear input after submission
            loadComments();
        } else {
            alert(`❌ Error: ${result.error || "Failed to submit comment"}`);
        }
    } catch (error) {
        console.error("❌ Network Error:", error);
        alert("❌ Failed to submit comment. Please try again.");
    }
}

// ✅ Function to Load Comments
async function loadComments() {
    const commentList = document.getElementById("commentList");
    if (!commentList) {
        console.error("❌ Element #commentList not found!");
        return;
    }

    commentList.innerHTML = "<p>🔄 Loading comments...</p>"; // ✅ Show loading message

    try {
        const response = await fetch(`${BACKEND_URL}/api/comments`);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("✅ Comments loaded:", data);

        commentList.innerHTML = ""; // ✅ Clear list before adding new comments

        if (data.length === 0) {
            commentList.innerHTML = "<p>🚫 No comments yet. Be the first to comment!</p>";
            return;
        }

        data.forEach(comment => {
            let li = document.createElement("li");
            li.textContent = comment.text;
            commentList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        commentList.innerHTML = "<p>❌ Failed to load comments. Please try again.</p>";
    }
}

// ✅ Ensure the DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM Loaded");
    
    loadComments(); // Load comments on page load

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitComment);
    } else {
        console.error("❌ Element #submitBtn not found!");
    }
});

