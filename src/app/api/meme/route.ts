import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { statement, level, score } = await req.json()

    const groqKey = process.env.GROQ_API_KEY
    const giphyKey = process.env.GIPHY_API_KEY

    if (!groqKey) return NextResponse.json({ error: 'GROQ_API_KEY not set' }, { status: 500 })
    if (!giphyKey) return NextResponse.json({ error: 'GIPHY_API_KEY not set' }, { status: 500 })

    // Step 1: Ask Groq to generate the perfect Giphy search query
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 60,
        temperature: 0.9,
        messages: [{
          role: 'user',
          content: `Someone is ${score}% cooked. Their situation: "${statement}". Their verdict level: "${level}".
          
Generate a SHORT Giphy search query (3-6 words max) that finds the most perfect, funny, relatable reaction meme GIF for this exact situation.
Think about the emotion: panic, regret, denial, existential crisis, etc.
Only return the search query, nothing else. No quotes, no explanation.
Examples: "sweating nervous guy", "this is fine fire dog", "crying laughing chaos", "man screaming mirror"`
        }],
      }),
    })

    if (!groqRes.ok) throw new Error('Groq failed to generate search query')
    const groqData = await groqRes.json()
    const searchQuery = groqData.choices?.[0]?.message?.content?.trim() ?? 'this is fine fire'

    // Step 2: Search Giphy with that query
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${encodeURIComponent(searchQuery)}&limit=10&rating=pg-13&lang=en`
    const giphyRes = await fetch(giphyUrl)

    if (!giphyRes.ok) throw new Error('Giphy search failed')
    const giphyData = await giphyRes.json()

    const gifs = giphyData.data
    if (!gifs || gifs.length === 0) {
      // Fallback search
      const fallbackUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=this+is+fine&limit=1&rating=pg-13`
      const fallbackRes = await fetch(fallbackUrl)
      const fallbackData = await fallbackRes.json()
      const gif = fallbackData.data?.[0]
      return NextResponse.json({
        url: gif?.images?.downsized_medium?.url ?? gif?.images?.original?.url,
        query: searchQuery,
        title: gif?.title ?? 'This is fine',
      })
    }

    // Pick a random one from top 5 for variety
    const pick = gifs[Math.floor(Math.random() * Math.min(5, gifs.length))]

    return NextResponse.json({
      url: pick.images?.downsized_medium?.url ?? pick.images?.original?.url,
      query: searchQuery,
      title: pick.title,
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Meme not found'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
