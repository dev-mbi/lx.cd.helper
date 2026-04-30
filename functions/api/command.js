export async function onRequestPost(context) {
  const { request, env } = context;

  const body = await request.json();
  const userInput = body.message;

  if (!userInput) {
    return Response.json({ content: "❌ No input provided" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a Linux expert. Always give command + short explanation."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "❌ No response from AI";

    return Response.json({ content: output });

  } catch (error) {
    return Response.json({ content: "❌ Error: " + error.message });
  }
}