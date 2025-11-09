'use client';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({ text, className = '' }: FormattedTextProps) {
  const formatText = (rawText: string) => {
    if (!rawText) return [];

    // Procesar el texto línea por línea
    const lines = rawText.split('\n');
    const processedElements: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      line = line.trim();
      if (!line) return;

      // Detectar títulos con **texto**
      if (line.includes('**') && line.match(/\*\*([^*]+)\*\*/)) {
        const titleMatch = line.match(/\*\*([^*]+)\*\*/);
        if (titleMatch) {
          processedElements.push(
            <h4 key={`title-${index}`} className="font-bold text-base text-gray-800 mt-4 mb-2 first:mt-0">
              {titleMatch[1]}
            </h4>
          );
          return;
        }
      }

      // Detectar listas que empiezan con "- "
      if (line.startsWith('- ')) {
        processedElements.push(
          <div key={`bullet-${index}`} className="flex items-start mb-2">
            <span className="text-blue-600 mr-2 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-700 text-sm leading-relaxed">
              {line.substring(2).trim()}
            </span>
          </div>
        );
        return;
      }

      // Párrafos normales
      if (line.length > 0) {
        processedElements.push(
          <p key={`para-${index}`} className="mb-3 text-gray-700 leading-relaxed text-sm">
            {line}
          </p>
        );
      }
    });

    // Si no se procesaron elementos, dividir por patrones comunes
    if (processedElements.length === 0) {
      return processTextWithPatterns(rawText);
    }

    return processedElements;
  };

  const processTextWithPatterns = (rawText: string) => {
    // Dividir por doble asterisco para encontrar títulos
    const sections = rawText.split(/(\*\*[^*]+\*\*)/);
    const elements: JSX.Element[] = [];
    
    sections.forEach((section, index) => {
      if (section.match(/^\*\*[^*]+\*\*$/)) {
        // Es un título
        const title = section.replace(/\*\*/g, '');
        elements.push(
          <h4 key={`section-title-${index}`} className="font-bold text-base text-gray-800 mt-4 mb-2 first:mt-0">
            {title}
          </h4>
        );
      } else if (section.trim()) {
        // Procesar contenido normal
        const paragraphs = section.split(/\n\s*\n/).filter(p => p.trim());
        
        paragraphs.forEach((paragraph, pIndex) => {
          // Detectar listas con guiones
          if (paragraph.includes(' - ')) {
            const listItems = paragraph.split(' - ').filter(item => item.trim());
            listItems.forEach((item, itemIndex) => {
              if (itemIndex > 0) { // Saltar el primer elemento que suele ser texto normal
                elements.push(
                  <div key={`list-${index}-${pIndex}-${itemIndex}`} className="flex items-start mb-2">
                    <span className="text-blue-600 mr-2 mt-1 flex-shrink-0">•</span>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item.trim()}
                    </span>
                  </div>
                );
              } else if (item.trim()) {
                elements.push(
                  <p key={`intro-${index}-${pIndex}`} className="mb-3 text-gray-700 leading-relaxed text-sm">
                    {item.trim()}
                  </p>
                );
              }
            });
          } else {
            // Párrafo normal
            elements.push(
              <p key={`normal-${index}-${pIndex}`} className="mb-3 text-gray-700 leading-relaxed text-sm">
                {paragraph.trim()}
              </p>
            );
          }
        });
      }
    });

    return elements;
  };

  const formattedContent = formatText(text);

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {formattedContent.length > 0 ? formattedContent : (
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      )}
    </div>
  );
}