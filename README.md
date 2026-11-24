# Humanizer

sponsored by [cfo.ai](https://cfo.ai/?utm_source=github&utm_medium=sponsorship&utm_campaign=humanizer)

[![GitHub stars](https://img.shields.io/github/stars/blader/humanizer?style=flat)](https://github.com/blader/humanizer/stargazers) [![skills.sh installs](https://skills.sh/b/blader/humanizer)](https://skills.sh/blader/humanizer)

Humanizer makes AI-written text sound like a person wrote it, without changing what it says. It rewrites Chinese and English prose, keeping the writer's facts, viewpoint, register, and intended reader. The English rules are built on Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), and 24 Chinese rules cover the same tells in Chinese prose. It works in Claude Code, Codex, and any other agent that supports skills.

**Before:**
> I'm thrilled to announce that shared drafts are finally here! 🚀 For months, our own team was drowning in files named final_v7.docx — and we knew there had to be a better way. Now two people can edit the same doc at once, with every change appearing live for both of them. It's not just a feature; it's a whole new way to collaborate. Comments stay anchored to the exact sentence they reference, even as the text around them evolves. And the best part? It's available today on every plan, completely free. Let that sink in.

**After:**
> Shared drafts are out today. For months our own team passed around files named final_v7.docx, and we got sick of it. Now two people can edit the same doc at once and see each other's changes as they type. Comments stay attached to the sentence they're about, even when the text around it changes. It's free on every plan.

**Chinese before:**
> 随着云计算技术的不断发展，缓存对系统性能提升具有重要意义。缓存不仅能减少重复查询、避免重复访问数据库，更能赋能业务流程，体现了现代架构的核心价值。这一点充分说明，缓存非常重要。

**Chinese after:**
> 缓存能减少重复查询，避免重复访问数据库。

In a blind test, judges preferred Humanizer's rewrite over the original AI text 16 times out of 16 ([#229](https://github.com/blader/humanizer/issues/229)).

Humanizer edits for human readers. It does not try to get past AI detectors, and detectors still flag most of its output. A rewrite never invents data, cases, sources, experiences, or opinions to make a sentence specific.

## The five strongest tells

These are the most common signs of AI writing, and Humanizer rewrites any of them on sight:

1. **Not X but Y:** "It's not just a feature, it's a shift."
2. **One-line closers:** "Let that sink in."
3. **Sayings that sound deep:** "At its core, what really matters is..."
4. **A staged run-up:** "Here's the thing." "Honestly?" "The hard part is..."
5. **Arguing with no one:** "I'm not saying X, but..."

Humanizer checks for [50 patterns](#the-50-patterns) in all — 26 English and 24 Chinese.

## Installation

Once installed, run it with `/humanizer`.

### Claude Code

```text
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
```

The plugin requires Claude Code 2.1.142 or newer; on older versions, run `npx skills add blader/humanizer --global --agent claude-code`.

### Codex

```bash
npx skills add blader/humanizer --global --agent codex
```

### pi

```bash
pi install git:github.com/blader/humanizer
```

Add `-l` to install it only in the current project. `pi update --extensions` pulls new versions.

### Claude.ai and Claude Desktop

Download this repository as a ZIP (**Code → Download ZIP**) and upload it as a skill in Settings. The ZIP must include `references/`, because the Chinese and English rules load from there on demand.

### Other agents

```bash
npx skills add blader/humanizer --global --agent '*'
```

This installs Humanizer for every agent the Skills CLI supports. Omit `--global` in any command above to install it only in the current project. For an agent the Skills CLI does not cover, copy `SKILL.md` and the `references/` directory into its skill folder, keeping the relative paths.

## Usage

Call the skill directly:

```
/humanizer

[paste your text here]
```

Or ask in plain language:

```
Please humanize this text: [your text]
```

To rewrite a file, pass its path:

```
Humanize the prose in docs/launch-post.md
```

Humanizer reads the current file in full before editing, including files it wrote earlier in the session. It edits only the prose, leaving code blocks, inline code, commands, paths, YAML metadata, data, and link targets unchanged. By default it returns only the final text, with no score, draft, or before-and-after; ask for analysis to see it.

### Match your voice

To make the rewrite sound like you, include a writing sample:

```
/humanizer

Here's a sample of my writing for voice matching:
[paste 2-3 paragraphs of your own writing]

Now humanize this text:
[paste AI text to humanize]
```

Humanizer follows the sample's rhythm, word choice, punctuation, and deliberate quirks. The sample can override punctuation preferences, but not the facts.

### Mixed Chinese and English

Humanizer routes by the prose, not by the instruction language. It judges the main clause: an English term such as `API` or `cache` inside a Chinese sentence does not trigger English rules, and an independent English sentence does. English-only rules about hyphens, copulas, participles, title case, and quotation marks are never applied to Chinese, and neither language is translated unless asked.

## How it works

A language model writes whatever is most likely to come next, so by default it makes the choice that fits the widest range of readers and subjects. A person chooses for one reader and one subject. Every tell Humanizer looks for is a form of that default choice.

> "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."
> Wikipedia, ["Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

Humanizer works in five phases: it analyzes the text, evaluates each mark, rewrites only the problems, verifies facts and meaning against the original, and returns the result. It adds no unchecked data, keeps every claim the original made, and returns text unchanged when nothing needs editing.


## The 50 patterns

Rules are numbered globally. English keeps the original 1–26 and Chinese adds 27–50; within each language, patterns are ordered by strength and frequency. A pattern marked *weak alone* needs other tells nearby before you act.

### English patterns (1–26)

#### A. Staging instead of stating

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 1 | **Not X but Y** | “It's not just X, it's Y” | State the point directly; keep real corrections |
| 2 | **One-line closers and dramatic fragments** | “That is the real win.” after every section | Cut repetition; merge empty fragments |
| 3 | **Sayings that sound deep** | “At its core, what matters is...” | Replace empty depth with the actual claim |
| 4 | **Staged run-up before the point** | “Let's dive in”; “The hard part is...” | Remove the run-up and name the subject |
| 5 | **Arguing with no one** | “A tempting approach would be...” | Remove unraised objections; keep real alternatives |

#### B. Rhythm by rule

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 6 | **Forced triads** | “innovation, inspiration, and insights” | Use only the items the meaning needs |
| 7 | **Repeated sentence openings** | “She noted... She noted...” | Merge or vary only mechanical repetition |
| 8 | **Dashes as the universal connector** (*weak alone*) | Dashes between every clause | Use clearer punctuation; match the writer's sample |
| 9 | **Stacked qualifiers** (*weak alone*) | “could potentially possibly be argued” | Keep qualifiers supported by the evidence |
| 10 | **Hyphenated pairs everywhere** (*weak alone*) | “the report is high-quality” | Apply English compound-modifier grammar |
| 11 | **Passive voice and missing subjects** (*weak alone*) | “No configuration file needed” | Name the actor only when that improves clarity |

#### C. Inflation and borrowed authority

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 12 | **Overused AI words** | “delve... testament... landscape” | Use precise plain words; keep technical meanings |
| 13 | **Inflated significance** | “marking a pivotal moment” | Keep the fact; drop unsupported importance |
| 14 | **Vague connection or association** | “associated with the leadership” | Name the relationship only if known |
| 15 | **Shallow -ing phrases** | “symbolizing... reflecting...” | Keep only supported claims |
| 16 | **Sales language** | “nestled within the breathtaking region” | State concrete qualities |
| 17 | **Borrowed authority** | “Experts believe...” without a source | Use an available checked source or cut the claim |
| 18 | **Avoiding is, are, and has** | “serves as... boasts...” | Use simple verbs when they preserve the meaning |

#### D. Formatting by rule

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 19 | **Bold as decoration** | Every list item has a bold label | Keep useful emphasis; remove decoration |
| 20 | **Decorative headings** | “🚀 Launch Phase” | Name the content and follow the publication style |
| 21 | **Curly quotation marks** (*weak alone*) | Quotes differ from the target format | Match the format; do not apply this to Chinese |

#### E. Leftovers from the chat and the draft

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 22 | **Chatbot residue** | “Great question! ... I hope this helps!” | Keep the content; keep real message politeness |
| 23 | **Knowledge-limit disclaimers and guesses** | Missing sources followed by a plausible guess | State a relevant gap or cut the guess |
| 24 | **A heading repeated in the first sentence** | “## Performance” + “Speed matters.” | Remove only the repeated warm-up |
| 25 | **Writing about the document instead of its subject** | Narrating how the document was assembled | Describe the subject; keep useful source notes |

#### F. Writing for the wrong reader

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 26 | **Re-explaining what the reader knows** | A reply repeats all context before its decision | Lead with the decision and the decisive reason |

### Chinese patterns (27–50)

#### G. 套话、包装与虚假深度

| # | 规则 | 识别示例 | 处理方法 |
|---|------|----------|----------|
| 27 | **空泛套话与自我预告** | “随着……不断发展”“下面将介绍” | 删除没有背景或导航价值的开场 |
| 28 | **抽象包装与名词化** | “赋能”“打造闭环”“多维度协同” | 写出原文已有的动作、对象和结果 |
| 29 | **夸大意义与强行升华** | “重要意义”“为行业树立标杆” | 保留事实和有依据的评价，删去拔高 |
| 30 | **伪深刻与空泛判断** | “从本质上来说”“是一面镜子” | 用真实机制或普通判断替代深度外壳 |
| 31 | **营销化与赞美堆叠** | “震撼、细腻、极致” | 保留参数、功能和真实感受 |
| 32 | **模糊归因与借来的权威** | “业内普遍认为”“专家表示” | 使用已有来源；不编造权威或研究 |

#### H. 机械句式与节奏

| # | 规则 | 识别示例 | 处理方法 |
|---|------|----------|----------|
| 33 | **机械否定对照** | “不是简单……而是……” | 删除无人持有的否定；保留真实纠错 |
| 34 | **固定递进与并列** | “不仅……更……”“既……又……” | 按真实关系合并或陈述各项 |
| 35 | **强行三项与数字框架** | 所有主题都凑成三个关键词 | 项目数量服从内容，不刻意换数量 |
| 36 | **伪范围与万能过渡** | 无连续范围的“从……到……” | 直接列举；保留真实跨度和顺序 |
| 37 | **重复句首与连接词堆叠** | 连续“因此”“我们需要” | 合并、省略或调整语序，保留必要衔接 |
| 38 | **自问自答与教程腔** | “为什么……？答案是……” | 直接回答；保留真实问题和人物语气 |

#### I. 重复、冗余与信息不足

| # | 规则 | 识别示例 | 处理方法 |
|---|------|----------|----------|
| 39 | **同义反复与解释复述** | “复杂且繁琐”并反复总结 | 合并同义项，删除无新信息的复述 |
| 40 | **逐段小结与结尾复读** | 每段“由此可见”，结尾再总结 | 删除复述，保留新结论和行动建议 |
| 41 | **抽象代替具体** | “采取措施并取得显著成效” | 使用原文事实；缺失时不编造 |
| 42 | **过度对冲与无关免责声明** | “某种程度上或许可能” | 保留证据需要的一层限定和真实限制 |

#### J. 模板结构与装饰

| # | 规则 | 识别示例 | 处理方法 |
|---|------|----------|----------|
| 43 | **机械分点与编号** | 短句硬拆成“一是、二是、三是” | 保留步骤和条款，其他内容按需要成段 |
| 44 | **标题与 Markdown 过度** | 短文多层标题、逐词加粗 | 保留导航价值，删除装饰和标题复述 |
| 45 | **均匀节奏与过度对仗** | 句长一致、四字格和金句堆叠 | 按语义调整，不故意制造碎句或错误 |
| 46 | **伪书面与翻译腔** | “进行一个……的动作”“被”字堆叠 | 用自然中文；保留规范语和正常主语省略 |
| 47 | **标点装饰与插入过量** | 破折号、括号和叹号密集 | 按语义整理；不改代码和中文正常标点 |

#### K. 对话残留与错误读者

| # | 规则 | 识别示例 | 处理方法 |
|---|------|----------|----------|
| 48 | **AI 对话残留** | “希望这对你有帮助”“我可以继续” | 独立成稿时删除；保留真实邮件礼貌 |
| 49 | **知识边界与无来源猜测** | 没有资料却猜测童年或动机 | 说明真实缺口或删除猜测 |
| 50 | **复述读者已知背景** | 回复重述全部背景后才给决定 | 有上下文时先答复，保留关键理由 |

The full recognition criteria, rewrite examples, and the "do not edit" boundaries are in `references/en.md` and `references/zh-CN.md`. The research basis and limits of the Chinese rules are in `docs/research-zh-CN.md`.

## Testing

Package validation and the runner's unit tests need no third-party dependencies:

```bash
python3 scripts/validate-package.py
python3 tests/test_output_checks.py
python3 tests/run_behavior_tests.py --list
```

The 17 behavior cases cover Chinese technical articles, documentation, news, work reports, official documents, email, social media, opinion writing, academic text, chat, fiction, mixed Chinese-English text, and English regressions. The cases live in `tests/cases.json`; the runner calls a real agent and checks required facts, key numeric relations, expressions to remove, forbidden added numbers, wrong edits, and output format.

```bash
python3 tests/run_behavior_tests.py --agent-command "claude -p --tools=\\"\\""
```

The agent command must read a UTF-8 prompt from standard input and write UTF-8 final text to standard output. `--agent-command` uses POSIX quoting; on Windows, quote executable paths that contain spaces or backslashes. Any agent that meets the interface can replace the example command. The runner does not run with the skill automatically and is not a runtime dependency. Automated assertions cannot prove that two passages mean the same thing, so review facts, attribution, and the writer's stance by hand before publishing.

## Project structure

- `SKILL.md` — the shared five-phase process, language routing, output rules, and genre guidance.
- `references/en.md` — English patterns 1–26.
- `references/zh-CN.md` — Chinese patterns 27–50.
- `docs/research-zh-CN.md` — the research basis, grouping principles, and limits of the Chinese rules.
- `tests/` — behavior cases and the lightweight runner.
- `scripts/validate-package.py` — checks package structure, version, pattern numbering, and document sync.
- `.claude-plugin/`, `.cursor-plugin/`, `agents/`, `package.json` — the existing install entries.

## Sources

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) is the source for the English pattern list.
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup) maintains the page.
- El Attar, Dönmez, Maurer, and Falenska, ["A Systematic Analysis of Linguistic Features in AI-Generated English Text Detection Across Domains and Models"](https://arxiv.org/abs/2606.04177) (2026) is the source for the caution that most signals change with the model and the text type.
- The Chinese rules draw on Zhu Junhui et al., ["人工智能生成语言与人类语言对比研究——以 ChatGPT 为例"](https://aclanthology.org/2023.ccl-1.46/) (CCL 2023) and ["大模型生成回答与人类回答文本的语言特征比较研究"](http://jcip.cipsc.org.cn/cn/article/pdf/preview/zwxxxb_3707.pdf). These studies support checking vocabulary, syntax, cohesion, and repetition as dimensions, and do not support judging authorship from a single feature.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT

If Humanizer helps you, a star helps other people find it.
