const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");

const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
  ];
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",safetySettings: safetySettings });


const analyzeDocument = async (filePath, mimeType) => {
    try {
        const filePart = {
            inlineData: {
                data: fs.readFileSync(filePath).toString("base64"),
                mimeType,
            }
        };
        const prompt = `Analyze this medical document and extract the following information in the specified format:\n\n
        Hospital Name:  (Provide the name of the hospital where the document was issued)\n
        Health Issue: (If the health issue is related to the hand, only mention the body part, e.g., 'hand injury','head injury', 'heart injury')\n
        Summary: (Provide a concise overview of the document, including the main points and any relevant details.)`;
        
        const result = await model.generateContent([prompt, filePart]);
        const responseText = result.response.text();
        const hospitalMatch = responseText.match(/Hospital Name:\s*(.*)/i);
        const issueMatch = responseText.match(/Health Issue:\s*(.*)/i);
        const summaryMatch = responseText.match(/Summary:\s*(.*)/i);

        const hospitalName = hospitalMatch ? hospitalMatch[1].trim() : "Unknown Hospital";
        const healthIssue = issueMatch ? issueMatch[1].trim() : "Unknown Health Issue";
        const summary = summaryMatch ? summaryMatch[1].trim() : "No summary available.";
        return {
            hospitalName,
            healthIssue,
            summary,
        };
    } catch (error) {
        console.error('AI API Error:', error);
        throw new Error('Failed to analyze document with AI.');
    }
}
module.exports = { analyzeDocument };