import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, hubId } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Mensajes requeridos' },
        { status: 400 }
      );
    }
    
    console.log('📨 API chat-with-context recibió:', {
      messageCount: messages.length,
      hubId,
      lastMessage: messages[messages.length - 1]?.content
    });
    
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
      stream: false,
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content || "";
    
    if (aiMessage && aiMessage.length > 5) {
      console.log('✅ Respuesta con contexto generada');
      return NextResponse.json({
        message: aiMessage.trim(),
        success: true
      });
    } else {
      throw new Error('Respuesta vacía de Groq');
    }
    
  } catch (error: any) {
    console.error('❌ Error en chat-with-context:', error.message);
    
    return NextResponse.json(
      { 
        message: "Error al procesar la pregunta con contexto.",
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}