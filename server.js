const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// API route
app.post("/api/command", async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.json({ content: "❌ No input provided" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a Linux expert. Always give command + short explanation."
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

    res.json({ content: output });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);

    res.json({
      content: "❌ Error: " + (error.response?.data?.error?.message || error.message)
    });
  }
});

// start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});