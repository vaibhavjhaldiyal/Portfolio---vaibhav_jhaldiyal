async function submitComment() {
    let commentText = document.getElementById("commentText").value.trim();

    if (!commentText) {
        alert("⚠️ Please enter a comment!");
        return;
    }

    try {
        let response = await fetch('http://localhost:5000/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: commentText })
        });

        let result = await response.json();

        if (response.ok) {
            alert("✅ Comment submitted!");
            document.getElementById("commentText").value = "";
            loadComments(); // Refresh comments
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
        const response = await fetch("http://localhost:5000/api/comments");
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Comments loaded:", data);
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

loadComments();

document.addEventListener("DOMContentLoaded", loadComments);
