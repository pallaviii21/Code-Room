export const executeCode = async (language, sourceCode) => {
    // Map Monaco languages to Piston API languages
    const languageMap = {
        javascript: { language: 'javascript', version: '18.15.0' },
        python: { language: 'python', version: '3.10.0' },
        cpp: { language: 'cpp', version: '10.2.0' },
        java: { language: 'java', version: '15.0.2' },
        typescript: { language: 'typescript', version: '5.0.3' },
        rust: { language: 'rust', version: '1.68.2' },
        go: { language: 'go', version: '1.16.2' },
    };

    if (language === 'html' || language === 'css') {
        throw new Error('HTML and CSS cannot be executed in the server terminal environment. Standard web outputs apply directly.');
    }

    const runConfig = languageMap[language];
    if (!runConfig) {
        throw new Error(`Execution is not supported for ${language}.`);
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/api/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: runConfig.language,
                files: [
                    {
                        content: sourceCode
                    }
                ]
            })
        });

        const result = await response.json();
        
        if (result.message) {
            // Error from API itself
            throw new Error(result.message);
        }
        
        return result.run; // { stdout, stderr, code, output }
    } catch (error) {
        console.error("Piston API Error:", error);
        throw error;
    }
};
