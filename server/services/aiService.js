const { GoogleGenerativeAI } = require('@google/generative-ai');

function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
        return null;
    }
    return new GoogleGenerativeAI(apiKey);
}

/**
 * Explains and fixes a code compilation/runtime error.
 */
async function explainAndFixError({ language, code, error }) {
    const genAI = getGenAI();
    if (!genAI) {
        return {
            success: false,
            needsApiKey: true,
            explanation: "Gemini API key is not configured. Please add `GEMINI_API_KEY=your_key` in server/.env (free at https://aistudio.google.com/app/apikey).",
            fixedCode: code,
            changes: ["No changes applied - API key required."]
        };
    }

    try {
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `You are an expert software engineer and automated code debugger.
A user ran ${language} code that failed with an error.

=== SOURCE CODE (${language}) ===
${code}

=== ERROR / TERMINAL OUTPUT ===
${error}

Your task:
1. Explain concisely (2-3 sentences max) what caused the error in simple terms.
2. Provide the complete corrected source code that resolves the error while preserving the user's logic and style.
3. List 1-3 bullet points detailing exactly what changes were made.

Respond ONLY with valid JSON matching this schema:
{
  "explanation": "concise explanation of root cause",
  "fixedCode": "the full corrected source code",
  "changes": ["summary of change 1", "summary of change 2"]
}`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        // Clean markdown backticks if present
        if (responseText.includes('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '');
        } else if (responseText.includes('```')) {
            responseText = responseText.replace(/```/g, '');
        }

        const parsed = JSON.parse(responseText.trim());

        return {
            success: true,
            explanation: parsed.explanation || "Error resolved.",
            fixedCode: parsed.fixedCode || code,
            changes: parsed.changes || []
        };
    } catch (err) {
        console.error("AI Error Explanation failed:", err);
        return {
            success: false,
            error: err.message || "Failed to generate AI diagnosis.",
            explanation: `AI diagnosis failed: ${err.message || "Unknown error"}. Verify your GEMINI_API_KEY and network connection.`,
            fixedCode: code,
            changes: []
        };
    }
}

/**
 * Handles @ai queries in the collaborative chat.
 */
async function generateChatResponse({ prompt, code, language, username }) {
    const genAI = getGenAI();
    if (!genAI) {
        return `🤖 **CodeBot**: To activate AI responses for everyone in the room, please add a free **GEMINI_API_KEY** in \`server/.env\`! You can get one instantly at [Google AI Studio](https://aistudio.google.com/app/apikey).`;
    }

    try {
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const model = genAI.getGenerativeModel({ model: modelName });

        const systemPrompt = `You are CodeBot, an intelligent and friendly AI pair programmer embedded inside "Code Room", a real-time collaborative coding platform.
A collaborator named "${username || 'A team member'}" asked a question in the room chat.

CURRENT ROOM CONTEXT:
Language: ${language || 'unknown'}
Active Editor Code:
\`\`\`${language || ''}
${(code && code.trim()) ? code : '// (Editor is currently empty)'}
\`\`\`

USER'S CHAT QUESTION:
"${prompt}"

INSTRUCTIONS:
- Give a direct, concise, high-value answer.
- If referencing code from the editor, be specific.
- If providing code suggestions, use fenced code blocks with the correct language identifier.
- Keep the tone collaborative, encouraging, and clear. Avoid excessive greetings.`;

        const result = await model.generateContent(systemPrompt);
        return result.response.text();
    } catch (err) {
        console.error("AI Chat generation failed:", err);
        return `⚠️ **CodeBot**: I encountered an error formulating a response: ${err.message || 'Please check your API key / quota.'}`;
    }
}

module.exports = {
    explainAndFixError,
    generateChatResponse
};
