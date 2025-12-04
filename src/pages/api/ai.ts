import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { type, prompt, history } = body;
    const apiKey = import.meta.env.MOONSHOT_API_KEY;

    let systemPrompt = "";
    let userContent = "";

    // ==========================================
    // 场景 A: 用户点击“没思路” (老高引导模式)
    // ==========================================
    if (type === 'hint') {
        systemPrompt = `你现在是精通八木仁平理论的生涯规划师“老高”。
        
        【你的任务】
        针对用户当前卡住的这一道题，提供直击人心、打破思维定势的引导。
        
        【风格要求】
        1. 语气通俗、直接、有穿透力（像老高视频里那样）。
        2. **绝对禁止**输出 HTML 标签（如 <li>, <strong>, <br>）。
        3. **绝对禁止**输出 Markdown 格式。
        4. 请输出纯文本。如果要分点，请直接使用 "• " 符号开头，每点一行。
        5. 不要讲大道理，不要解释理论，直接给操作指令（例如：“别瞎猜，直接发微信问朋友”）。`;
        
        userContent = prompt; 
    } 

    // ==========================================
    // 场景 B: 最终报告生成 (四步法核心逻辑)
    // ==========================================
    else {
        systemPrompt = `你是一个精通八木仁平《做自己擅长的事，才是人生的真谛》体系的生涯规划大师。请严格按照以下【四步法】对用户的回答进行深度分析，并生成一份HTML格式的人生使用说明书。

        【分析逻辑核心】
        不要被用户的长句子迷惑，要像拿着红笔改作业一样，从回答中**提取重复出现的关键词**。

        ---
        【步骤一：提取关键词 (Keyword Extraction)】
        通读用户所有回答，寻找重复出现的词汇或深层含义一致的词。
        * 价值观线索：来自关于尊敬的人、青春期、社会不满的回答。
        * 才能线索：来自关于别人做不好、不耐烦、无意识习惯的回答。
        * 热情线索：来自关于花钱、书架、感谢的人的回答。

        【步骤二：三圆圈分类 (The Three Circles)】
        将提取的关键词填入三个圈：
        1. **价值观 (Values / 状态)**: 用户无论做什么都想保持的状态（如：自由、诚实、助人）。
        2. **才能 (Talents / 手段)**: 用户无意识的、比别人做得好的动作（如：逻辑梳理、倾听、视觉表达）。
        3. **热情 (Passion / 领域)**: 用户感兴趣的具体领域（如：心理学、科技、教育）。

        【步骤三：组合人生公式 (The Formula)】
        严格按照此句式造句：
        "我想在【热情领域】，利用我的【才能手段】，去实现【价值观状态】。"
        (请尝试生成 1 个核心公式和 2 个变体)

        【步骤四：职业载体匹配 (Career Matching)】
        基于上述公式，寻找现实世界中的职业载体。如果现有职业不存在，请鼓励用户创造一个。

        ---
        【输出格式要求 - 必须严格遵守 HTML 结构】
        请直接输出以下 HTML 代码结构，**不要**包含 \`\`\`html 标记，**不要**包含 markdown：

        <div class="report-container">
            <h2 class="report-title">🔍 第一步：你的核心关键词</h2>
            <div class="keywords-box">
                <p>通过分析你的回答，这几个词反复出现：</p>
                <div class="tags-cloud">
                    <span class="tag">[关键词1]</span><span class="tag">[关键词2]</span><span class="tag">[关键词3]</span><span class="tag">[关键词4]</span>
                </div>
            </div>

            <h2 class="report-title">🎯 第二步：自我认知三圆圈</h2>
            <div class="circles-grid">
                <div class="circle-card value">
                    <h3>价值观 (Values)</h3>
                    <p class="subtitle">无论何时都想保持的状态</p>
                    <ul class="circle-list">
                        <li>[关键词1]</li>
                        <li>[关键词2]</li>
                    </ul>
                </div>
                <div class="circle-card talent">
                    <h3>才能 (Talents)</h3>
                    <p class="subtitle">无意识的“出厂设置”</p>
                    <ul class="circle-list">
                        <li>[关键词1]</li>
                        <li>[关键词2]</li>
                    </ul>
                </div>
                <div class="circle-card passion">
                    <h3>热情 (Passion)</h3>
                    <p class="subtitle">愿意投入的领域</p>
                    <ul class="circle-list">
                        <li>[关键词1]</li>
                        <li>[关键词2]</li>
                    </ul>
                </div>
            </div>

            <h2 class="report-title">✨ 第三步：你的人生真谛公式</h2>
            <div class="formula-box">
                <p class="formula-main">我想在 <span class="highlight">[热情领域]</span>，利用我的 <span class="highlight">[才能]</span>，去实现 <span class="highlight">[价值观]</span>。</p>
            </div>

            <h2 class="report-title">🚀 第四步：建议的职业载体</h2>
            <div class="career-suggestions">
                <ul class="career-list">
                    <li><strong>[职业方向A]</strong>: [简短解释为什么匹配]</li>
                    <li><strong>[职业方向B]</strong>: [简短解释为什么匹配]</li>
                    <li><strong>[职业方向C]</strong>: [简短解释为什么匹配]</li>
                </ul>
            </div>
        </div>`;

        // 整理历史回答
        userContent = "用户的回答历史如下：\n" + history.map((h: any) => `问题：${h.question}\n回答：${h.answer}`).join("\n\n");
    }

    // --- 发送请求给 Moonshot AI ---
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify({ 
        reply: data.choices[0].message.content 
    }));

  } catch (error) {
    return new Response(JSON.stringify({ error: 'API Error' }), { status: 500 });
  }
}
