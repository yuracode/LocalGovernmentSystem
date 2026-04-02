import { useState } from 'react'

const questions = [
  {
    id: 'q1',
    type: 'radio',
    text: '現在お住まいの地域の住みやすさについて、どのようにお感じですか？',
    options: ['とても住みやすい', '住みやすい', '普通', '住みにくい', 'とても住みにくい'],
  },
  {
    id: 'q2',
    type: 'checkbox',
    text: '行政サービスの中で、特に充実してほしいと感じるものを選んでください（複数選択可）',
    options: ['子育て支援', '高齢者・介護サービス', '防災・安全対策', '公共交通機関', '医療・健康サービス', 'ごみ・環境', '道路・公園整備', '教育・文化'],
  },
  {
    id: 'q3',
    type: 'radio',
    text: '市のWebサービス・アプリの使いやすさについて教えてください',
    options: ['とても使いやすい', '使いやすい', '普通', '使いにくい', 'とても使いにくい'],
  },
  {
    id: 'q4',
    type: 'radio',
    text: '市役所窓口の対応についてはいかがでしたか？',
    options: ['とても満足', '満足', '普通', '不満', 'とても不満', '利用したことがない'],
  },
  {
    id: 'q5',
    type: 'textarea',
    text: '市政・行政サービスへのご意見・ご要望をご自由にお書きください',
    placeholder: 'ご意見・ご要望をご記入ください...',
  },
]

// 既存の集計データ（モック：自分の回答が加算される前のデータ）
const BASE_TOTALS = {
  q1: { 'とても住みやすい': 47, '住みやすい': 128, '普通': 89, '住みにくい': 31, 'とても住みにくい': 12 },
  q2: { '子育て支援': 134, '高齢者・介護サービス': 98, '防災・安全対策': 156, '公共交通機関': 112, '医療・健康サービス': 87, 'ごみ・環境': 63, '道路・公園整備': 79, '教育・文化': 44 },
  q3: { 'とても使いやすい': 23, '使いやすい': 95, '普通': 112, '使いにくい': 54, 'とても使いにくい': 18 },
  q4: { 'とても満足': 38, '満足': 102, '普通': 88, '不満': 42, 'とても不満': 19, '利用したことがない': 28 },
}

const RECENT_COMMENTS = [
  '防災訓練の通知をもっと早めにしてほしい。',
  'バスの本数が少なくて不便です。増便を希望します。',
  'ごみの分別が複雑で分かりにくい。案内を充実させてほしい。',
  '子育て支援センターのスタッフがとても親切です。',
  'オンライン手続きをもっと増やしてほしい。',
]

function ResultBar({ label, count, total, isMyAnswer }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className={`result-row ${isMyAnswer ? 'result-row-mine' : ''}`}>
      <div className="result-label">
        {isMyAnswer && <span className="my-answer-mark">あなた</span>}
        <span>{label}</span>
      </div>
      <div className="result-bar-wrap">
        <div
          className={`result-bar-fill ${isMyAnswer ? 'result-bar-mine' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="result-stats">
        <span className="result-pct">{pct}%</span>
        <span className="result-count">{count}票</span>
      </div>
    </div>
  )
}

export default function SurveyPage() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(0)

  const totalSteps = questions.length

  const handleRadio    = (qid, val) => setAnswers(prev => ({ ...prev, [qid]: val }))
  const handleTextarea = (qid, val) => setAnswers(prev => ({ ...prev, [qid]: val }))
  const handleCheckbox = (qid, val) => {
    setAnswers(prev => {
      const cur = prev[qid] || []
      return { ...prev, [qid]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] }
    })
  }

  const canProceed = () => {
    const q = questions[step]
    if (q.type === 'textarea') return true
    return !!answers[q.id] && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true)
  }

  const handleSubmit = () => setSubmitted(true)

  // 自分の回答を加算した集計
  const getTotals = (qid, options) => {
    const base = { ...BASE_TOTALS[qid] }
    const myAns = answers[qid]
    if (Array.isArray(myAns)) {
      myAns.forEach(v => { if (base[v] !== undefined) base[v] += 1 })
    } else if (myAns && base[myAns] !== undefined) {
      base[myAns] += 1
    }
    const total = options.reduce((s, o) => s + (base[o] || 0), 0)
    return { counts: base, total }
  }

  if (submitted) {
    return (
      <div className="page survey-page">
        <div className="survey-results-wrap">
          <div className="results-header">
            <div className="results-check">✅</div>
            <h2 className="results-title">ご回答ありがとうございました</h2>
            <p className="results-sub">
              いただいたご意見は今後の市政運営に活かしてまいります。<br />
              現在の集計結果をご覧いただけます。
            </p>
            <div className="results-total-badge">回答者数：{307 + 1} 人</div>
          </div>

          {questions.filter(q => q.type !== 'textarea').map(q => {
            const { counts, total } = getTotals(q.id, q.options)
            const myAns = answers[q.id]
            return (
              <div key={q.id} className="result-card">
                <p className="result-q-text">{q.text}</p>
                <div className="result-bars">
                  {q.options.map(opt => {
                    const isMyAnswer = Array.isArray(myAns) ? myAns.includes(opt) : myAns === opt
                    return (
                      <ResultBar
                        key={opt}
                        label={opt}
                        count={counts[opt] || 0}
                        total={total}
                        isMyAnswer={isMyAnswer}
                      />
                    )
                  })}
                </div>
                <p className="result-total-note">集計対象：{total} 票</p>
              </div>
            )
          })}

          {/* 自由回答 */}
          <div className="result-card">
            <p className="result-q-text">市政・行政サービスへのご意見・ご要望</p>
            {answers.q5 && (
              <div className="my-comment-box">
                <span className="my-answer-mark">あなたの回答</span>
                <p>{answers.q5}</p>
              </div>
            )}
            <p className="recent-comments-label">他の方のご意見（一部）</p>
            <ul className="recent-comments-list">
              {RECENT_COMMENTS.map((c, i) => (
                <li key={i} className="recent-comment-item">「{c}」</li>
              ))}
            </ul>
          </div>

          <div className="results-footer">
            <button
              className="btn-primary"
              onClick={() => { setSubmitted(false); setStep(0); setAnswers({}) }}
            >
              もう一度回答する
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[step]

  return (
    <div className="page survey-page">
      <div className="survey-container">
        <div className="survey-header">
          <h2 className="survey-title">📝 住民アンケート</h2>
          <p className="survey-subtitle">令和8年度 市民満足度調査</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
          </div>
          <p className="progress-text">質問 {step + 1} / {totalSteps}</p>
        </div>

        <div className="question-card">
          <p className="question-number">Q{step + 1}</p>
          <p className="question-text">{q.text}</p>

          {q.type === 'radio' && (
            <div className="options-list">
              {q.options.map(opt => (
                <label key={opt} className={`option-label ${answers[q.id] === opt ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleRadio(q.id, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'checkbox' && (
            <div className="options-list">
              {q.options.map(opt => (
                <label key={opt} className={`option-label ${(answers[q.id] || []).includes(opt) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    value={opt}
                    checked={(answers[q.id] || []).includes(opt)}
                    onChange={() => handleCheckbox(q.id, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'textarea' && (
            <textarea
              className="survey-textarea"
              placeholder={q.placeholder}
              value={answers[q.id] || ''}
              onChange={e => handleTextarea(q.id, e.target.value)}
              rows={5}
            />
          )}
        </div>

        <div className="survey-nav">
          <button
            className="btn-secondary"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            ← 前へ
          </button>

          {step < totalSteps - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              次へ →
            </button>
          ) : (
            <button className="btn-submit" onClick={handleSubmit}>
              送信する ✓
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
