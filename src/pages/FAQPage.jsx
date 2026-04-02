import { useState, useRef, useEffect } from 'react'

const faqs = [
  { q: 'ごみの分別方法を教えてください', a: '燃えるごみは月・水・金曜日、燃えないごみは第2・第4月曜日に収集しています。プラスチック容器包装は毎週火曜日、缶・ビン・ペットボトルは毎週木曜日です。詳しくはごみ収集カレンダーをご確認ください。' },
  { q: '住民票はどこで取得できますか？', a: '住民票は市役所1階の市民課窓口、または各地区の出張所で取得できます。マイナンバーカードをお持ちの方はコンビニエンスストアのマルチコピー機でも取得可能です（手数料200円）。' },
  { q: '転入届の手続きについて教えてください', a: '転入届は引越し後14日以内に市役所市民課へお届けください。必要書類は①転出証明書（前住所地で発行）②本人確認書類（運転免許証など）③印鑑 です。' },
  { q: '子育て支援サービスにはどんなものがありますか？', a: '主な子育て支援サービスとして、①認可保育所・認定こども園への入所支援 ②子育て支援センターでの一時預かり ③ファミリーサポートセンター ④産後ヘルパー派遣サービス などがあります。詳しくは子ども育成課（内線456）までお問い合わせください。' },
  { q: '粗大ごみの処分方法を教えてください', a: '粗大ごみは事前に電話またはインターネットで申し込みが必要です。収集シールを購入（300円/枚）し、収集日の朝8時までに指定場所に出してください。インターネット申込みはポータルの「粗大ごみ収集申込み」からできます。' },
]

export default function FAQPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'こんにちは！市民向けAIアシスタントです。行政手続きや地域のサービスについてお気軽にご質問ください。' },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [apiStatus, setApiStatus] = useState(null) // null | 'ok' | 'error'
  const bottomRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // サーバー接続確認
  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(data => setApiStatus(data.ok ? 'ok' : 'no-key'))
      .catch(() => setApiStatus('error'))
  }, [])

  // APIメッセージ履歴を構築（aiロールをmodelに変換）
  const buildApiMessages = (msgs) =>
    msgs
      .filter(m => m.id !== 1) // 初期挨拶はシステムプロンプト側で対応
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))

  const sendMessage = async (userText) => {
    if (!userText.trim() || isStreaming) return

    const userMsg = { id: Date.now(), role: 'user', text: userText }
    setMessages(prev => {
      const next = [...prev, userMsg]

      // API呼び出しは次のレンダー後に行うため、ここで状態を返す
      return next
    })
    setInput('')
    setIsStreaming(true)

    // AIメッセージのプレースホルダー
    const aiId = Date.now() + 1
    setMessages(prev => [...prev, { id: aiId, role: 'ai', text: '' }])

    const apiMessages = buildApiMessages([...messages, userMsg])

    try {
      const controller = new AbortController()
      abortRef.current = controller

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'サーバーエラー' }))
        throw new Error(err.error || 'サーバーエラー')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiText = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // 未完結行はバッファに残す

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') break
          try {
            const { text, error } = JSON.parse(payload)
            if (error) throw new Error(error)
            if (text) {
              aiText += text
              setMessages(prev =>
                prev.map(m => m.id === aiId ? { ...m, text: aiText } : m)
              )
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
          } catch {
            // パースエラーは無視
          }
        }
      }

      if (!aiText) {
        setMessages(prev =>
          prev.map(m => m.id === aiId ? { ...m, text: '回答を取得できませんでした。' } : m)
        )
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      const errText = err.message.includes('GEMINI_API_KEY')
        ? 'APIキーが設定されていません。.env ファイルに GEMINI_API_KEY を追加してください。'
        : `エラーが発生しました：${err.message}\n市役所（代表 000-000-0000）にお問い合わせください。`
      setMessages(prev =>
        prev.map(m => m.id === aiId ? { ...m, text: errText, isError: true } : m)
      )
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  const handleFaqClick = (faq) => {
    if (isStreaming) return
    sendMessage(faq.q)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const statusLabel = {
    ok: { text: '● AI接続済み', cls: 'status-ok' },
    'no-key': { text: '● APIキー未設定', cls: 'status-warn' },
    error: { text: '● サーバー未起動', cls: 'status-error' },
    null: { text: '● 確認中...', cls: 'status-checking' },
  }[apiStatus] ?? { text: '● 確認中...', cls: 'status-checking' }

  return (
    <div className="page faq-page">
      <div className="faq-layout">
        <aside className="faq-sidebar">
          <h3 className="faq-sidebar-title">よくある質問</h3>
          <ul className="faq-list">
            {faqs.map((faq, i) => (
              <li key={i}>
                <button
                  className="faq-item-btn"
                  onClick={() => handleFaqClick(faq)}
                  disabled={isStreaming}
                >
                  <span className="faq-q-icon">Q</span>
                  {faq.q}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="chat-container">
          <div className="chat-header">
            <span className="ai-avatar">🤖</span>
            <div>
              <strong>AI市民サポート</strong>
              <p>Gemini が行政サービスについてお答えします</p>
            </div>
            <span className={`online-badge ${statusLabel.cls}`}>{statusLabel.text}</span>
          </div>

          {(apiStatus === 'no-key' || apiStatus === 'error') && (
            <div className="api-setup-notice">
              {apiStatus === 'error' ? (
                <>
                  <p className="api-notice-title">⚠️ APIサーバーが起動していません</p>
                  <p>別のターミナルで以下を実行してください：</p>
                  <code>node server.js</code>
                </>
              ) : (
                <>
                  <p className="api-notice-title">⚠️ Gemini APIキーが未設定です</p>
                  <p>プロジェクトルートに <code>.env</code> ファイルを作成し、以下を追加してください：</p>
                  <code>GEMINI_API_KEY=your_api_key_here</code>
                  <p className="api-notice-sub">
                    APIキーは <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">Google AI Studio</a> で取得できます。
                  </p>
                </>
              )}
            </div>
          )}

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.role}`}>
                {msg.role === 'ai' && <span className="msg-avatar">🤖</span>}
                <div className={`msg-bubble ${msg.isError ? 'msg-error' : ''}`}>
                  {msg.text || (msg.role === 'ai' && isStreaming
                    ? <span className="streaming-cursor" />
                    : ''
                  )}
                </div>
                {msg.role === 'user' && <span className="msg-avatar">👤</span>}
              </div>
            ))}
            {isStreaming && messages[messages.length - 1]?.role !== 'ai' && (
              <div className="message ai">
                <span className="msg-avatar">🤖</span>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              className="chat-input"
              placeholder={apiStatus === 'ok' ? '質問を入力してください... (Enterで送信)' : 'サーバーに接続するとご利用いただけます'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={isStreaming}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
            >
              {isStreaming ? '生成中' : '送信'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
