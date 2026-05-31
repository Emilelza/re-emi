import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /chat — redirect to login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in, don't show login/signup/home — go straight to chat
  if (user && ['/login', '/signup', '/home'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return response
}

export const config = {
  matcher: ['/chat/:path*', '/login', '/signup', '/home'],
}
