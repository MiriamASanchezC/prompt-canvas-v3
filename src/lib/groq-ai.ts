// src/lib/groq-ai.ts
import Groq from 'groq-sdk';
import { AIResponse } from '@/types/chat';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getGroqResponse(question: string): Promise<AIResponse> {
  try {
    console.log('🤖 Enviando pregunta a Groq (IA REAL):', question);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Eres un asistente de IA experto en programación y desarrollo web. Responde de manera clara, concisa y útil en español. Si la pregunta es sobre programación, incluye ejemplos de código cuando sea apropiado."
        },
        {
          role: "user",
          content: question
        }
      ],
      // MODELO ACTUALIZADO Y ACTIVO (2024)
      model: "llama-3.1-8b-instant", // ← ESTE ESTÁ ACTIVO Y ES RÁPIDO
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      stream: false,
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content || "";
    
    if (aiMessage && aiMessage.length > 5) {
      console.log('✅ ¡RESPUESTA REAL DE IA GENERADA CON ÉXITO!');
      return {
        message: aiMessage.trim(),
        success: true
      };
    } else {
      throw new Error('Respuesta vacía de Groq');
    }
    
  } catch (error: any) {
    console.error('❌ Error Groq:', error.message);
    
    // Si falla, intentar con mixtral (backup)
    try {
      console.log('🔄 Probando con mixtral-8x7b-32768...');
      
      const backupCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Responde en español de manera clara y útil."
          },
          {
            role: "user",
            content: question
          }
        ],
        model: "mixtral-8x7b-32768", // ← BACKUP
        temperature: 0.7,
        max_tokens: 300,
      });

      const backupMessage = backupCompletion.choices[0]?.message?.content || "";
      
      if (backupMessage && backupMessage.length > 5) {
        console.log('✅ ¡ÉXITO con modelo backup!');
        return {
          message: backupMessage.trim(),
          success: true
        };
      }
    } catch (backupError: any) {
      console.error('❌ Modelo backup también falló:', backupError.message);
    }
    
    return {
      message: `Lo siento, no pude procesar tu pregunta en este momento. ${
        error.message?.includes('rate limit') || error.message?.includes('quota')
          ? 'He alcanzado el límite de requests gratuitos de Groq.'
          : 'El servicio de IA podría estar temporalmente no disponible.'
      } Intenta de nuevo en unos momentos.`,
      success: false,
      error: error.message
    };
  }
}