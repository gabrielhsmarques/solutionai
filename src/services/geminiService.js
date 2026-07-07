import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

// Helper function that retries the request up to 3 times if it fails
async function generateWithRetry(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      const isLastAttempt = i === retries - 1
      if (isLastAttempt) throw error

      // Waits 2 seconds before trying again
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

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
  return generateWithRetry(prompt)
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
  return generateWithRetry(prompt)
}