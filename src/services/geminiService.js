import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

export async function askEducator(question, userProfile) {
  const prompt = `
    You are a friendly and didactic financial educator.
    Answer clearly and practically, avoiding complex technical terms.
    Keep your answer concise (max 3 paragraphs).
    
    User profile:
    - Name: ${userProfile.name}
    - Monthly income: $${userProfile.income}
    - Total debt: $${userProfile.debt}
    - Dependents: ${userProfile.dependents}
    - Goal: ${userProfile.goal}
    
    Question: ${question}
  `
  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function generateDailyTip(userProfile) {
  const prompt = `
    You are a friendly and didactic financial educator.
    Based on the profile below, generate ONE short and practical financial tip (max 2 lines).
    Be direct and motivating. Do not use markdown or bullet points.
    
    Profile:
    - Monthly income: $${userProfile.income}
    - Total debt: $${userProfile.debt}
    - Goal: ${userProfile.goal}
  `
  const result = await model.generateContent(prompt)
  return result.response.text()
}