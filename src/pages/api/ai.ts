export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, data, context, system_prompt } = body;
    
    // 读取 Cloudflare 后台配置的密码
    const apiKey = import.meta.env.DEEPSEEK_API_KEY;

    if (!apiKey) return new Response(JSON.stringify({ error: "Server: API Key missing" }), { status: 500 });

    let messages = [];
    
    if (action === 'hint') {
      messages = [
        { role: "system", content: "你是一个直觉敏锐的人生导师。简短引导用户，不要废话。" },
        { role: "user", content: `问题：${data.question}\n背景：${context}\n${data.theory_context}` }
      ];
    } else if (action === 'refine') {
      messages = [
        { role: "system", content: "专业编辑。只返回润色后的文字，不要解释。" },
        { role: "user", content: `请润色：${data.text}` }
      ];
    } else if (action === 'analyze') {
      messages = [
        { role: "system", content: system_prompt },
        { role: "user", content: `用户：${body.user_name}\n回答：${JSON.stringify(body.answers)}` }
      ];
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: action === 'analyze' ? 1.0 : 0.7,
        response_format: action === 'analyze' ? { type: 'json_object' } : { type: 'text' }
      })
    });

    const result = await response.json();
    let finalData = result.choices?.[0]?.message?.content || "";
    
    if (action === 'analyze') {
       try { finalData = JSON.parse(finalData); } catch(e) { console.error(e); }
    }

    return new Response(JSON.stringify({ success: true, data: finalData }));

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
