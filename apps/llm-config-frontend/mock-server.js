// Simple mock server for testing the frontend
import http from 'http';

const PORT = 8844;

// Simple PII masking simulation
function mockMask(text) {
  const patterns = [
    { regex: /[\w.-]+@[\w.-]+\.\w+/g, type: 'EMAIL_ADDRESS' },
    { regex: /1[3-9]\d{9}/g, type: 'PHONE_NUMBER' },
    { regex: /(?:张|李|王|刘|陈|杨|赵|黄|周|吴|徐|孙|胡|朱|高|林|何|郭|马|罗|梁|宋|郑|谢|韩|唐|冯|于|董|萧|程|曹|袁|邓|许|傅|沈|曾|彭|吕|苏|卢|蒋|蔡|贾|丁|魏|薛|叶|阎|余|潘|杜|戴|夏|钟|汪|田|任|姜|范|方|石|姚|谭|廖|邹|熊|金|陆|郝|孔|白|崔|康|毛|邱|秦|江|史|顾|侯|邵|孟|龙|万|段|漕|钱|汤|尹|黎|易|常|武|乔|贺|赖|龚|文)[\u4e00-\u9fa5]{1,3}/g, type: 'PERSON' },
  ];

  let maskedText = text;
  const placeholders = {};
  let counter = 1;

  for (const { regex, type } of patterns) {
    maskedText = maskedText.replace(regex, (match) => {
      const placeholder = `__PII_${type}_${counter}__`;
      placeholders[placeholder] = match;
      counter++;
      return placeholder;
    });
  }

  // Base64 encode the placeholders map
  const maskMeta = Buffer.from(JSON.stringify(placeholders)).toString('base64');

  return { text: maskedText, maskMeta };
}

function mockRestore(text, maskMeta) {
  try {
    const placeholders = JSON.parse(Buffer.from(maskMeta, 'base64').toString());
    let restoredText = text;
    for (const [placeholder, original] of Object.entries(placeholders)) {
      restoredText = restoredText.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), original);
    }
    return restoredText;
  } catch {
    return text;
  }
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const url = req.url;

    // Health check
    if (url === '/api/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    // Config
    if (url === '/api/config' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ output: { status: 'ok' }, error: null }));
      return;
    }

    // Mask text
    if (url === '/api/mask_text' && req.method === 'POST') {
      try {
        const { text } = JSON.parse(body);
        const result = mockMask(text || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ output: result, error: null }));
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ output: null, error: { message: e.message, code: null } }));
      }
      return;
    }

    // Restore text
    if (url === '/api/restore_text' && req.method === 'POST') {
      try {
        const { text, maskMeta } = JSON.parse(body);
        const restored = mockRestore(text || '', maskMeta || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ output: { text: restored }, error: null }));
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ output: null, error: { message: e.message, code: null } }));
      }
      return;
    }

    // Call LLM (mock response)
    if (url === '/api/call' && req.method === 'POST') {
      try {
        const { text } = JSON.parse(body);
        // Simulate LLM response
        const mockResponse = `收到您的消息: "${text}"\n\n这是一个模拟的 LLM 响应，用于测试前端功能。在实际使用中，这里会显示真正的 LLM 回复。`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ output: { text: mockResponse }, error: null }));
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ output: null, error: { message: e.message, code: null } }));
      }
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock server running at http://127.0.0.1:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/health');
  console.log('  POST /api/config');
  console.log('  POST /api/mask_text');
  console.log('  POST /api/restore_text');
  console.log('  POST /api/call');
});
