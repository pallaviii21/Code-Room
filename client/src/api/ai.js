export const requestAiFix = async (language, sourceCode, errorMessage) => {
    try {
        const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000").replace(/\/$/, '');
        const response = await fetch(`${BACKEND_URL}/api/ai/fix-error`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language,
                code: sourceCode,
                error: errorMessage
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("AI Fix Request Error:", error);
        throw error;
    }
};
