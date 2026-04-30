const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(require("cors")());
app.use(express.static("public"));

/**
 * AI Linux Command API
 */
app.post("/api/command", async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.json({ content: "❌ No input provided" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a Linux expert. Always respond with: 1) Command 2) Short explanation."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const output =
      response.data.choices?.[0]?.message?.content ||
      "❌ No response from AI";

    return res.json({ content: output });
  } catch (error) {
    console.log("❌ FULL ERROR:", error.response?.data || error.message);

    return res.json({
      content:
        "❌ Error: " +
        (error.response?.data?.error?.message || error.message)
    });
  }
});

/**
 * Start server
 */
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});