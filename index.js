addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Lấy dữ liệu từ request
  const url = new URL(request.url);
  const sentence = url.searchParams.get('sentence') || 'Xin chào, bạn khỏe không?';

  // Chuyển đổi sang văn phong tu tiên
  const tuTienSentence = convertToTuTien(sentence);

  // Trả về phản hồi dạng JSON
  return new Response(JSON.stringify({ original: sentence, converted: tuTienSentence }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

function convertToTuTien(sentence) {
  // Bảng từ điển thay thế đơn giản
  const dictionary = {
    'xin chào': 'bái kiến đạo hữu',
    'bạn': 'các hạ',
    'khỏe không': 'tu vi khả ổn',
    'tôi': 'bản tọa',
    'cảm ơn': 'đa tạ',
    'tạm biệt': 'hữu duyên tái hội'
  };

  let converted = sentence;
  for (const [key, value] of Object.entries(dictionary)) {
    converted = converted.replace(new RegExp(key, 'gi'), value);
  }

  // Thêm phong cách tu tiên nếu không có từ khớp
  if (converted === sentence) {
    converted = `Tại hạ nghe nói: "${sentence}", quả là kỳ diệu!`;
  }

  return converted;
}
