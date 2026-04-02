const services = [
  { id: 1,  icon: '📋', label: '手続き・届出', color: '#3b82f6', desc: '各種申請・届出' },
  { id: 2,  icon: '🏥', label: '医療・健康',   color: '#ef4444', desc: '医療機関・健診情報' },
  { id: 3,  icon: '👶', label: '子育て支援',   color: '#f97316', desc: '保育・子育て情報' },
  { id: 4,  icon: '🔥', label: '防災・安全',   color: '#eab308', desc: '避難所・ハザードマップ' },
  { id: 5,  icon: '🏛', label: '施設予約',     color: '#22c55e', desc: '公共施設の予約' },
  { id: 6,  icon: '🚌', label: '交通・バス',   color: '#14b8a6', desc: '路線バス・時刻表' },
  { id: 7,  icon: '♻️', label: 'ごみ・環境',  color: '#8b5cf6', desc: 'ごみ収集カレンダー' },
  { id: 8,  icon: '📅', label: 'イベント情報', color: '#ec4899', desc: '地域イベント一覧' },
  { id: 9,  icon: '💼', label: '求人・就労',   color: '#06b6d4', desc: '求人情報・相談窓口' },
  { id: 10, icon: '🏫', label: '教育・学校',   color: '#84cc16', desc: '学校・教育情報' },
  { id: 11, icon: '🌿', label: '公園・自然',   color: '#10b981', desc: '公園・緑地情報' },
  { id: 12, icon: '💬', label: 'お問い合わせ', color: '#6366f1', desc: '窓口・相談サービス' },
]

const notices = [
  { id: 1, date: '2026/04/01', category: '重要', title: '令和8年度 市民税・県民税の納税通知書を送付しました', badge: 'new' },
  { id: 2, date: '2026/03/28', category: 'お知らせ', title: '春の一斉清掃を4月12日(日)に実施します', badge: '' },
  { id: 3, date: '2026/03/25', category: '防災', title: '総合防災訓練のご案内（4月20日実施予定）', badge: '' },
]

export default function HomePage({ onNavigate }) {
  return (
    <div className="page home-page">
      <section className="welcome-banner">
        <div className="welcome-text">
          <h2>ようこそ、市民ポータルへ</h2>
          <p>各種行政サービスをオンラインで手軽に利用できます。</p>
        </div>
        <div className="quick-links">
          <button className="quick-btn" onClick={() => onNavigate('faq')}>🤖 AIに質問する</button>
          <button className="quick-btn" onClick={() => onNavigate('survey')}>📝 アンケートに答える</button>
        </div>
      </section>

      <section className="notice-bar">
        <h3 className="section-label">📢 新着情報</h3>
        <ul className="notice-list">
          {notices.map(n => (
            <li key={n.id} className="notice-item">
              <span className="notice-date">{n.date}</span>
              <span className={`notice-category cat-${n.category}`}>{n.category}</span>
              <span className="notice-title">{n.title}</span>
              {n.badge === 'new' && <span className="badge-new">NEW</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="services-section">
        <h3 className="section-title">行政サービス一覧</h3>
        <div className="services-grid">
          {services.map(s => (
            <button
              key={s.id}
              className="service-tile"
              style={{ '--tile-color': s.color }}
              onClick={() => onNavigate('service', { serviceId: s.id })}
            >
              <span className="tile-icon">{s.icon}</span>
              <span className="tile-label">{s.label}</span>
              <span className="tile-desc">{s.desc}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
