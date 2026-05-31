import Groq from 'groq-sdk'
import { createClient } from '../../../lib/supabase-server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, systemPrompt } = await request.json()
  if (!messages?.length) return Response.json({ error: 'No messages' }, { status: 400 })

  try {
    const groqMessages = [
      { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
      ...messages
    ]

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: groqMessages,
      stream: true,
    })

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

  } catch (err) {
    console.error('GROQ ERROR:', err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}