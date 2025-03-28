export default {
  async fetch(request, env) {
    const ai = env.AI; // Binding AI từ Cloudflare
    const url = new URL(request.url);
    const sentence = url.searchParams.get('sentence') || 'Xin chào, bạn khỏe không?';

    // Prompt yêu cầu chuyển đổi trực tiếp sang văn phong tu tiên tiếng Việt
    const tuTienPrompt = `
      Bạn là một bậc tiên nhân am hiểu văn phong tu tiên cổ kính. 
      Hãy chuyển câu sau thành văn phong tu tiên bằng tiếng Việt: 
      "${sentence}"
    `;
    
    // Gọi mô hình LLaMA 3
    const tuTienResponse = await ai.run('@cf/meta/llama-3-8b-instruct', {
      prompt: tuTienPrompt,
      max_tokens: 150, // Tăng để có câu dài và chi tiết hơn
      temperature: 0.7 // Điều chỉnh độ sáng tạo
    });
    const tuTienSentence = tuTienResponse.response;

    // Trả về kết quả
    return new Response(JSON.stringify({
      original: sentence,
      tu_tien_vi: tuTienSentence
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
};
