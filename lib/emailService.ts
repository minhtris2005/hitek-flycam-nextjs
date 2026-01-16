// lib/emailService.ts
import type { ContactFormData } from '@/types/contact'

// Response từ Edge Function (dựa vào code bạn gửi)
interface EdgeFunctionResponse {
  success?: boolean
  message?: string
  error?: string
}

export async function sendContactEmail(formData: ContactFormData): Promise<{
  success: boolean
  data?: EdgeFunctionResponse
  error?: string
}> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const functionUrl = `${supabaseUrl}/functions/v1/send-contact-email`

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(formData),
    })

    const responseText = await response.text()

    let result: EdgeFunctionResponse
    try {
      result = JSON.parse(responseText) as EdgeFunctionResponse
    } catch {
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`)
    }

    if (!response.ok) {
      // Edge function của bạn trả về { error: string } khi có lỗi
      throw new Error(result.error || `HTTP ${response.status}: ${responseText}`)
    }

    // Edge function thành công trả về { success: true }
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Email sending error:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}