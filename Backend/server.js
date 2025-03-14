require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyAfgfFWxhhVs9nX8dvtk1FO4zNTw06BOno";

// API to check if the URL is safe
app.post("/check-url", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const googleResponse = await axios.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`,
            {
                client: { clientId: "fraud-detector", clientVersion: "1.0" },
                threatInfo: {
                    threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                    platformTypes: ["ANY_PLATFORM"],
                    threatEntryTypes: ["URL"],
                    threatEntries: [{ url }]
                }
            }
        );

        if (googleResponse.data.matches) {
            return res.json({ safe: false, message: "🚨 Warning! This link is fraudulent." });
        } else {
            return res.json({ safe: true, message: "✅ This link is safe." });
        }
    } catch (error) {
        console.error("Error checking URL:", error);
        return res.status(500).json({ error: "Failed to check URL. Try again later." });
    }
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
