import Groq from 'groq-sdk'
import { createClient } from '../../../lib/supabase-server'

// This runs on the SERVER - your API key is never sent to the browser
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  // 1. Check user is logged in
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Get messages from request
  const { messages, systemPrompt } = await request.json()
  if (!messages?.length) return Response.json({ error: 'No messages' }, { status: 400 })

  // 3. Build messages array with system prompt for Groq
  const groqMessages = [
    { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
    ...messages
  ]

  // 4. Stream response from Groq (FREE!)
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile', // Free, fast, very capable model
    max_tokens: 1024,
    messages: groqMessages,
    stream: true,
  })

  // 5. Stream back to client
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
