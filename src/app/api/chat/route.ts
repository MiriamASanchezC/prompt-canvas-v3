import { NextRequest, NextResponse } from 'next/server';
import { getGroqResponse } from '@/lib/groq-ai';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      );
    }
    
    console.log('📨 API recibió pregunta:', message);
    
    // USAR SOLO GROQ - IA REAL
    const aiResponse = await getGroqResponse(message);
    
    console.log('🤖 Respuesta de IA:', { success: aiResponse.success });
    
    return NextResponse.json(aiResponse);
    
  } catch (error) {
    console.error('❌ Error en API route:', error);
    return NextResponse.json(
      { 
        message: "Error interno del servidor. Intenta de nuevo.",
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}