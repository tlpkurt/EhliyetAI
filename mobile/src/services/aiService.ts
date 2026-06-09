import { knowledgeBase } from '../data/knowledgeBase';

// Çevresel değişkenden OpenAI API Key alınıyor
const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

function getRelevantContext(query: string): string {
  const queryLower = query.toLowerCase();
  
  const matches = knowledgeBase.map(item => {
    let score = 0;
    item.keywords.forEach(kw => {
      if (queryLower.includes(kw.toLowerCase())) {
        score++;
      }
    });
    return { ...item, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score);

  if (matches.length === 0) {
    return "Sistemde spesifik bir ehliyet sınavı bilgisi bulunamadı, ancak genel trafik kuralları çerçevesinde yanıtlayabilirsin.";
  }

  const topMatches = matches.slice(0, 3).map(m => `Kategori: ${m.category}\nBilgi: ${m.content}`);
  return topMatches.join('\n\n');
}

export async function askEhliyetAI(query: string, history: { role: string, parts: { text: string }[] }[] = []): Promise<string> {
  try {
    if (!API_KEY) {
      return "Sistem uyarısı: Lütfen geçerli bir OpenAI API Anahtarı (.env içerisinde EXPO_PUBLIC_OPENAI_API_KEY) sağlayın.";
    }

    const context = getRelevantContext(query);
    
    const systemPrompt = `Sen Türkiye Ehliyet Sınavı asistanı olan EhliyetAI'sın.
Kullanıcıların Trafik, Motor, İlk Yardım ve Trafik Adabı konularındaki sorularına yanıt verirsin.
Dostça, anlaşılır ve eğitici bir dil kullan.

Aşağıda kullanıcının sorusuyla eşleşen veritabanımızdaki bazı önemli trafik/ehliyet bilgileri (RAG Context) bulunmaktadır. 
Lütfen bu bağlamı kullanarak soruyu yanıtla. Eğer bağlam soruyu yanıtlamak için yetersizse, kendi ehliyet ve trafik bilgini kullanarak doğrudan yanıtla.

[SİSTEM BİLGİ TABANI (RAG CONTEXT)]
${context}
[SİSTEM BİLGİ TABANI SONU]`;

    // Gemini API history formatını OpenAI formatına çeviriyoruz
    const openAIHistory = history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.parts[0].text
    }));

    // System prompt'u en başa ekleyelim
    const messages = [
      { role: 'system', content: systemPrompt },
      ...openAIHistory,
      { role: 'user', content: query }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return `API Hatası: ${data.error.message}`;
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Üzgünüm, şu anda yanıt veremiyorum. Lütfen internet bağlantınızı ve API ayarlarınızı kontrol edin.";
  }
}
