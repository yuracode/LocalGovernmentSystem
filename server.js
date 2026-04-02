import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from 'dotenv'

config()

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const SYSTEM_PROMPT = `あなたは自治体の市民サポートAIアシスタントです。
住民からの行政サービスに関する質問に、日本語で丁寧かつ簡潔に回答してください。

【対応できる主な内容】
- ごみの分別・収集: 燃えるごみは月・水・金曜日、燃えないごみは第2・第4月曜日、プラスチック容器包装は毎週火曜日、缶・ビン・ペットボトルは毎週木曜日
- 粗大ごみ: 事前申込が必要。収集シール300円/枚。収集日の朝8時までに指定場所へ
- 住民票: 市役所1階の市民課または各地区の出張所で取得。マイナンバーカードでコンビニ取得可（手数料200円）
- 転入届: 引越し後14日以内に市役所市民課へ。転出証明書・本人確認書類・印鑑が必要
- 子育て支援: 認可保育所・認定こども園への入所支援、子育て支援センターの一時預かり、ファミリーサポートセンター、産後ヘルパー派遣など
- 防災・避難: ハザードマップ、避難場所の確認方法、クマ出没情報などの安全情報
- 各種手続き・窓口案内

【回答のルール】
- 回答は簡潔にまとめ、箇条書きを活用してください
- 具体的な数値・日程・場所は正確に伝えてください
- 情報が不明な場合は市役所（代表 000-000-0000）への問い合わせを案内してください
- 市の業務・行政に無関係な話題は丁重にお断りください`

// 接続確認エンドポイント
app.get('/api/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY
  res.json({ ok: hasKey, message: hasKey ? 'APIキー設定済み' : 'APIキー未設定' })
})

// チャットエンドポイント（SSEストリーミング）
app.post('/api/chat', async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY が設定されていません' })
  }

  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages が不正です' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      systemInstruction: SYSTEM_PROMPT,
    })

    // Gemini 形式に変換 (role: user/model)
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))
    const lastMessage = messages[messages.length - 1].content

    const chat = model.startChat({ history })
    const result = await chat.sendMessageStream(lastMessage)

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

app.listen(PORT, () => {
  const hasKey = !!process.env.GEMINI_API_KEY
  console.log(`APIサーバー起動: http://localhost:${PORT}`)
  console.log(`Gemini APIキー: ${hasKey ? '✅ 設定済み' : '❌ 未設定 (.env に GEMINI_API_KEY を追加してください)'}`)
})
