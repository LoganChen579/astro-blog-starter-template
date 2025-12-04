import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { type, prompt, history } = body;
    const apiKey = import.meta.env.MOONSHOT_API_KEY;

    let systemPrompt = "";
    let userContent = "";

    // ==========================================
    // 场景 A: 引导模式 (保持不变，只做轻微优化)
    // ==========================================
    if (type === 'hint') {
        systemPrompt = `你是一位犀利的生涯规划师“老高”。
        用户正在进行自我挖掘，但他卡住了。
        请给出简短、直击要害的引导。
        不要讲大道理，直接告诉他怎么想（例如：“别想那些虚的，就想你最烦谁？”）。
        只输出纯文本，不要HTML。`;
        userContent = prompt; 
    } 

    // ==========================================
    // 场景 B: 最终报告生成 (★ 核心重构：完全按照你的逻辑书写)
    // ==========================================
    else {
        // 这里我们将你提供的逻辑原封不动地作为“核心算法”
        const logicScript = `
        【核心任务】
        你不是一个聊天机器人，你是一个“人生逻辑算法引擎”。
        请阅读用户的回答，严格按照以下流程进行数据处理和推理，最后输出HTML报告。

        【阶段一：数据清洗与关键词提取】
        1. **价值观 (Values)** (Q1-Q6): 提取核心关键词 (如: 独立、公平、美感...)。
        2. **才能 (Talents)** (Q7-Q11): 提取核心关键词 (如: 色彩敏感、逻辑梳理...)。
           * **特殊算法**: 如果用户提到缺点，必须进行“天赋反转”。
           * (例如: "反应慢" -> 标记为 "深度沉浸能力"; "注意力不集中" -> 标记为 "思维跳跃/高创意")。
        3. **热情 (Passion)** (Q12-Q16): 提取核心关键词 (如: 帮助他人、历史研究...)。

        【阶段二：合成与演算 (Step 1)】
        *   算法: [热情关键词] + [才能关键词] = 初步职业/方向选项。
        *   请生成 2-3 个初步方向 (不管是否合适，先生成)。

        【阶段三：价值观过滤 (Step 2 - 最关键)】
        *   算法: 拿着【初步方向】去撞击【价值观关键词】。
        *   **审核逻辑**:
            *   如果方向违背价值观 -> **淘汰 (REJECT)**。
            *   如果方向符合价值观 -> **通过 (PASS)**。
            *   如果方向部分符合但有冲突 -> **修正 (MODIFY)** (例如: 既然不喜欢开会，那就把"规划师"修正为"独立开发者")。

        【阶段四：输出结论】
        *   通过过滤的那个选项，就是“人生使用说明书”。
        *   附带动态调整提示和金钱观提示。
        `;

        systemPrompt = `你是一个严格执行上述逻辑的AI。
        ${logicScript}

        【输出格式要求】
        请**只输出**以下结构的 HTML 代码 (不要Markdown，不要废话)：

        <div class="report-container">
            
            <!-- 1. 关键词汇总展示 -->
            <div class="step-section">
                <h2 class="report-title">📊 核心关键词提取 (Key Data)</h2>
                <div class="keywords-grid">
                    <div class="keyword-col">
                        <h3>🧭 价值观 (Values)</h3>
                        <p class="subtitle">你的底线与原则</p>
                        <div class="tags-list">
                            <!-- 列出价值观关键词 -->
                            <span class="tag-pill">[关键词1]</span>
                            <span class="tag-pill">[关键词2]</span>
                        </div>
                    </div>
                    <div class="keyword-col">
                        <h3>🔧 才能 (Talents)</h3>
                        <p class="subtitle">你的天赋工具</p>
                        <div class="tags-list">
                            <!-- 列出才能关键词 (包含缺点转化后的优点) -->
                            <span class="tag-pill">[关键词1]</span>
                            <span class="tag-pill">[关键词2]</span>
                        </div>
                        <p class="small-tip">💡 挖掘逻辑：已将你提到的部分“缺点”反转为天赋 (如：反应慢=深度沉浸)。</p>
                    </div>
                    <div class="keyword-col">
                        <h3>🔥 热情 (Passion)</h3>
                        <p class="subtitle">你的精神燃料</p>
                        <div class="tags-list">
                            <!-- 列出热情关键词 -->
                            <span class="tag-pill">[关键词1]</span>
                            <span class="tag-pill">[关键词2]</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. 第一步：组合推演 -->
            <div class="step-section">
                <h2 class="report-title">🧪 第一步：合成初步选项</h2>
                <p class="section-intro">我们将你的 <strong>[热情]</strong> 与 <strong>[才能]</strong> 进行化合反应，生成初步方向：</p>
                <div class="calc-box">
                    <p>
                        <span class="math-item">🔥 [热情关键词]</span> 
                        + 
                        <span class="math-item">🔧 [才能关键词]</span> 
                        = 
                        <strong>[初步生成的职业方向/事情 A]</strong>, <strong>[初步生成的职业方向/事情 B]</strong>
                    </p>
                </div>
            </div>

            <!-- 3. 第二步：价值观过滤 (核心) -->
            <div class="step-section">
                <h2 class="report-title">⚖️ 第二步：价值观过滤 (Filter)</h2>
                <p class="section-intro">现在，用你的 <strong>[价值观]</strong> (如: [核心价值观]) 对上述选项进行严格审核：</p>
                
                <div class="filter-process">
                    <!-- 模拟审核过程 1：淘汰/冲突 -->
                    <div class="filter-row fail">
                        <div class="filter-header">🚫 审核选项：[某个初步方向]</div>
                        <div class="filter-reason">
                            <strong>结果：淘汰/冲突</strong><br>
                            原因：这个方向虽然发挥了才能，但它违背了你看重的 <strong>[某价值观]</strong> (例如需要大量社交/不自由)。
                        </div>
                    </div>

                    <!-- 模拟审核过程 2：通过/修正 -->
                    <div class="filter-row pass">
                        <div class="filter-header">✅ 修正与通过：[最终确定的方向]</div>
                        <div class="filter-reason">
                            <strong>结果：完美匹配</strong><br>
                            原因：为了符合 <strong>[某价值观]</strong>，我们将方向修正为 <strong>[修正后的具体做法]</strong>。这样既发挥了才能，又保护了你的内核。
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. 最终结论 -->
            <div class="step-section final-conclusion">
                <h2 class="report-title">🚀 最终结论：你的人生使用说明书</h2>
                <div class="final-card">
                    <h3>你的“正确选择”是：</h3>
                    <p class="final-statement">
                        去做 <strong>[最终筛选出的事情/职业]</strong>。
                    </p>
                    <p class="logic-summary">
                        ( 逻辑：在 <strong>[热情领域]</strong> 利用 <strong>[才能优势]</strong>，且完全符合 <strong>[价值观]</strong> )
                    </p>
                </div>

                <div class="laogao-notes">
                    <p><strong>💡 动态调整法则：</strong></p>
                    <ul>
                        <li>人生之路不是只有一条。随着时代变化（如AI出现），具体职业形式会变，但只要符合上述内核，就是正确的路。</li>
                    </ul>
                    <p><strong>💰 关于金钱：</strong></p>
                    <ul>
                        <li>不要先考虑钱。钱是结果。做自己擅长且热爱的事，大概率会比做不擅长的事赚得多且幸福。</li>
                    </ul>
                </div>
            </div>

        </div>`;

        // 整理用户回答
        userContent = "用户提交的所有回答历史：\n" + history.map((h: any) => 
            `【问题Q${h.id}】: ${h.question}\n用户回答: ${h.answer}`
        ).join("\n\n");
    }

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
        // 适当提高温度，让它在“合成职业”时有一点点想象力，但在过滤时保持严谨
        temperature: 0.4 
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
