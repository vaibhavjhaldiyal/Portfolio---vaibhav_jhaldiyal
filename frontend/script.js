const BACKEND_URL = "https://portfolio-vaibhav-jhaldiyalw.onrender.com"; // Replace with actual backend URL

async function submitComment() {
    let commentText = document.getElementById("commentText").value.trim();

    if (!commentText) {
        alert("⚠️ Please enter a comment!");
        return;
    }

    try {
        let response = await fetch(`${BACKEND_URL}/api/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: commentText })
        });

        let result = await response.json();

        if (response.ok) {
            alert("✅ Comment submitted!");
            document.getElementById("commentText").value = "";
            loadComments();
        } else {
            alert(`❌ Error: ${result.error || "Failed to submit comment"}`);
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("❌ Failed to submit comment. Please try again.");
    }
}

async function loadComments() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/comments`);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Comments loaded:", data);

        let commentList = document.getElementById("commentList");
        commentList.innerHTML = "";

        data.forEach(comment => {
            let li = document.createElement("li");
            li.textContent = comment.text;
            commentList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    loadComments();
    document.getElementById("submitBtn").addEventListener("click", submitComment);
});
