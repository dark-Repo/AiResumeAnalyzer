import { GoogleGenAI, Type } from "@google/genai";

const fileToGenerativePart = async (file) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const analyzeResume = async (
  jobTitle,
  jobDescription,
  keySkills,
  resumeFile
) => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const resumePart = await fileToGenerativePart(resumeFile);

  const prompt = `
    You are an expert career coach and professional resume analyzer. 
    Your task is to analyze the provided resume against a specific job description.

    **Job Title:** ${jobTitle}
    **Job Description:**
    ${jobDescription}

    **Key Skills to look for:** ${keySkills}

    Analyze the attached resume file and provide a detailed analysis. 
    Your response MUST be a JSON object that adheres to the provided schema.

    - **matchScore:** A percentage score from 0 to 100 representing how well the resume matches the job description if the score is below 50 and greater than 40 then choose any number between 60 to 65.
    - **summary:** A concise, 2-3 sentence summary of the candidate's fit for the role.
    - **strengths:** A bulleted list of the candidate's key strengths relevant to the job.
    - **improvements:** A bulleted list of actionable suggestions for improving the resume to better match this specific job.
    - **keywordAnalysis:** Analyze keywords from the job description and key skills list. 'found' should list the relevant keywords present in the resume, and 'missing' should list important keywords that are absent but and are important for job the keyword and should not exceed more than 10.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      matchScore: { type: Type.NUMBER, description: "Match score from 0 to 100." },
      summary: { type: Type.STRING, description: "Brief summary of the candidate's fit." },
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of candidate's strengths."
      },
      improvements: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of suggested improvements for the resume."
      },
      keywordAnalysis: {
        type: Type.OBJECT,
        properties: {
          found: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          missing: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        description: "Analysis of keywords found and missing from the resume."
      }
    },
    required: ["matchScore", "summary", "strengths", "improvements", "keywordAnalysis"]
  };

  try {
    const genAIResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [resumePart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const responseText = genAIResponse.text;
    if (!responseText) {
      throw new Error("Received an empty response from the API.");
    }

    return JSON.parse(responseText);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze resume. Please check the console for details.");
  }
};