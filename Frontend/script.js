async function checkURL() {
    const url = document.getElementById("urlInput").value;
    const result = document.getElementById("result");

    if (!url) {
        result.innerHTML = "❌ Please enter a URL!";
        result.className = "fraud";
        return;
    }

    result.innerHTML = "🔄 Checking...";
    result.className = "";

    try {
        const response = await fetch("http://localhost:9000/check-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        result.innerHTML = data.message;
        result.className = data.safe ? "safe" : "fraud";
    } catch (error) {
        result.innerHTML = "❌ Error checking URL. Try again.";
        result.className = "fraud";
    }
}
