import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { statement } = await req.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'GROQ_API_KEY not set' }, { status: 500 })

    const prompt = `You are Judge Maximus, the most dramatic, unhinged, and hilarious AI judge on the internet. You're a mix of a strict courtroom judge and an internet meme lord.

A defendant has come before your court with this situation:
"${statement}"

Respond in this EXACT JSON format only (no markdown, no extra text):
{
  "score": <0-100, how cooked they are>,
  "level": "<Barely Warm | Lightly Toasted | Medium Cooked | Well Done | Extra Crispy | Absolutely Incinerated | BEYOND COOKED>",
  "survival": <0-100, survival chance>,
  "verdict": "<2-3 sentences of dramatic courtroom verdict>",
  "roast": "<2-3 sentences brutally roasting them about their specific situation>",
  "evidence": ["<specific evidence 1>", "<specific evidence 2>", "<specific evidence 3>"],
  "sentence": "<absurd creative punishment>",
  "emoji": "<1-2 relevant emojis>",
  "category": "<Work | Academic | Relationship | Financial | Life Choices | Social | Health | Family | Other>",
  "categoryEmoji": "<single emoji for the category>"
}

Rules:
- Be DRAMATIC and SAVAGE but funny
- Roast based on THEIR SPECIFIC situation
- Score 0-20=barely warm, 21-40=lightly toasted, 41-60=medium, 61-80=well done, 81-95=incinerated, 96-100=beyond cooked
- ONLY return valid JSON`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 900,
        temperature: 0.9,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: (err as { error?: { message?: string } })?.error?.message ?? 'Groq error' },
        { status: res.status }
      )
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid response format')
    const verdict = JSON.parse(jsonMatch[0])
    return NextResponse.json(verdict)

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Court is in recess'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
