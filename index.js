import { Ai } from '@cloudflare/ai';

export default {
  async fetch(request, env) {
    const ai = new Ai(env.AI);
    const url = new URL(request.url);
    const sentence = url.searchParams.get('sentence') || 'Xin chào, bạn khỏe không?';

    // Bước 1: Dịch sang tiếng Anh (nếu cần)
    const translationInput = {
      text: sentence,
      source_lang: 'vi',
      target_lang: 'en'
    };
    const translated = await ai.run('@cf/meta/m2m100-1.2b', translationInput);
    const englishSentence = translated.translated_text;

    // Bước 2: Chuyển sang văn phong tu tiên (dùng AI sinh văn bản)
    const tuTienPrompt = `Convert this sentence into an ancient, mystical cultivator style: "${englishSentence}"`;
    const tuTienResponse = await ai.run('@cf/meta/llama-3-8b-instruct', {
      prompt: tuTienPrompt,
      max_tokens: 100
    });
    const tuTienSentence = tuTienResponse.response;

    // Bước 3: Dịch lại sang tiếng Việt
    const finalTranslation = {
      text: tuTienSentence,
      source_lang: 'en',
      target_lang: 'vi'
    };
    const finalResult = await ai.run('@cf/meta/m2m100-1.2b', finalTranslation);

    // Trả về kết quả
    return new Response(JSON.stringify({
      original: sentence,
      translated_en: englishSentence,
      tu_tien_en: tuTienSentence,
      tu_tien_vi: finalResult.translated_text
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
};
