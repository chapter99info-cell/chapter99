/** Direct browser call to Gemini API — requires VITE_GEMINI_API_KEY in env */
const GEMINI_MODEL = 'gemini-2.5-flash'

export async function callGeminiApi(userPrompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? ''
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables.')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 2048 },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${err}`)
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>
    error?: { message?: string }
  }

  if (data.error?.message) {
    throw new Error(`Gemini API error: ${data.error.message}`)
  }

  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim()
  return text || '(No response text)'
}
