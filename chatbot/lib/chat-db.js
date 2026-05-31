// lib/chat-db.js
// ─────────────────────────────────────────────────────────
//  All Supabase database calls for persistent chat history.
//  Import createClient from supabase-browser when calling
//  from the client, or supabase-server from API routes.
// ─────────────────────────────────────────────────────────

/**
 * Fetch all conversations for the logged-in user, newest first.
 * Returns: [{ id, title, updated_at }]
 */
export async function getConversations(supabase) {
    const { data, error } = await supabase
        .from('conversations')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false })

    if (error) throw error
    return data ?? []
}

/**
 * Create a new conversation row. Returns the new conversation object.
 */
export async function createConversation(supabase, userId, title = 'New chat') {
    const { data, error } = await supabase
        .from('conversations')
        .insert({ user_id: userId, title })
        .select('id, title, updated_at')
        .single()

    if (error) throw error
    return data
}

/**
 * Rename a conversation (called once the first user message is known).
 */
export async function updateConversationTitle(supabase, conversationId, title) {
    const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId)

    if (error) throw error
}

/**
 * Delete a conversation (cascades to its messages via FK).
 */
export async function deleteConversation(supabase, conversationId) {
    const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

    if (error) throw error
}

/**
 * Fetch all messages for a conversation, in chronological order.
 * Returns: [{ id, role, content, created_at }]
 */
export async function getMessages(supabase, conversationId) {
    const { data, error } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data ?? []
}

/**
 * Save a single message to the database.
 */
export async function saveMessage(supabase, { conversationId, userId, role, content }) {
    const { error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, user_id: userId, role, content })

    if (error) throw error
}

/**
 * Delete all conversations for the logged-in user (cascades to messages).
 */
export async function clearAllConversations(supabase, userId) {
    const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('user_id', userId)

    if (error) throw error
}