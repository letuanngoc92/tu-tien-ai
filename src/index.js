export default {
    async fetch(request) {
        const url = new URL(request.url);
        const text = url.searchParams.get("text");

        if (!text) {
            return new Response(JSON.stringify({ error: "Vui lòng nhập văn bản!" }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }

        const AI_URL = "https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/run/mistral/mistral-7b-instruct";
        const AI_KEY = "YOUR_CLOUDFLARE_API_KEY";  // Lấy API Key từ Cloudflare Dashboard

        const response = await fetch(AI_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${AI_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "Hãy chuyển đổi văn bản sau thành văn phong tu tiên." },
                    { role: "user", content: text }
                ],
                max_tokens: 200
            })
        });

        const result = await response.json();
        const convertedText = result?.result || "Lỗi khi chuyển đổi";

        return new Response(JSON.stringify({ original: text, converted: convertedText }), {
            headers: { "Content-Type": "application/json" }
        });
    }
};
