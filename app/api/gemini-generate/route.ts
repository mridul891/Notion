import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
    }
    // Add a secondary prompt to instruct Gemini to return HTML
    const secondaryPrompt = " the output should be in the form of  HTML so that it can be rendered in a rich text editor  And it should only return the body tag content without any additional text or formatting. ";
    const fullPrompt = `${secondaryPrompt}\n${prompt}`;
    const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      }),
    });
    const geminiData = await geminiRes.json();
    // Debug log
    console.log("Gemini API response:", JSON.stringify(geminiData));
    let content = "";
    if (geminiData.candidates && geminiData.candidates.length > 0) {
      // Try the most common structure
      const candidate = geminiData.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0 && candidate.content.parts[0].text) {
        content = candidate.content.parts[0].text;
      } else if (candidate.output) {
        content = candidate.output;
      } else if (candidate.content && candidate.content.text) {
        content = candidate.content.text;
      }
    }
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
} 