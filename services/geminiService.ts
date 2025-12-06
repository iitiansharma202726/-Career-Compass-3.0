import { GoogleGenAI, Schema, Type } from "@google/genai";
import { UserAnalysis, UploadedFile } from "../types";

// Helper to convert file to Base64
const fileToPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        // Remove the "data:*/*;base64," prefix
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    userSummary: {
      type: Type.STRING,
      description: "A 2-3 sentence summary of the user's professional profile based on inputs.",
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          level: { type: Type.INTEGER, description: "Skill level from 0 to 100" },
          category: { type: Type.STRING, enum: ['Language', 'Framework', 'Tool', 'Soft Skill', 'Concept'] },
          evidence: { type: Type.STRING, description: "Source of this skill inference" }
        },
        required: ["name", "level", "category"]
      }
    },
    careerPaths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          matchScore: { type: Type.INTEGER },
          salaryRange: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["role", "matchScore", "missingSkills"]
      }
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          duration: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['pending'] }
        },
        required: ["day", "title", "description", "duration"]
      }
    },
    cvSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "content"]
      }
    }
  },
  required: ["userSummary", "skills", "careerPaths", "roadmap", "cvSuggestions"]
};

export const analyzeProfile = async (
  files: UploadedFile[],
  githubUrl: string,
  linkedinUrl: string,
  interests: string
): Promise<UserAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare prompts
  const textPrompt = `
    You are Career Compass 3.0, an advanced AI career counselor.
    Analyze the provided multimodal data (marksheets, project screenshots, certificates) and text inputs.
    
    User Context:
    GitHub: ${githubUrl || "Not provided"}
    LinkedIn: ${linkedinUrl || "Not provided"}
    Stated Interests: ${interests || "General Tech"}

    Your Goal:
    1. Build a Personal Skill Graph: Extract hard/soft skills, inferring depth from grades/projects.
    2. Recommend Career Paths: Suggest 3 best-fit roles with match scores and estimated salaries (generic USD ranges).
    3. Create a Roadmap: A 5-item daily learning plan to bridge gaps for the top role.
    4. CV Suggestions: Generate bullet points for a 'Projects' and 'Skills' section of a CV.

    Be specific. If you see a screenshot of a React app, infer React, CSS, Frontend. If you see good math grades, infer Analytical skills.
  `;

  // Prepare file parts
  const fileParts = await Promise.all(files.map(f => fileToPart(f.file)));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          ...fileParts,
          { text: textPrompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert career coach and technical recruiter. Output strict JSON.",
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from AI");

    return JSON.parse(responseText) as UserAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
