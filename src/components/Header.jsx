const APP_TITLE    = import.meta.env.VITE_APP_TITLE    ?? '市民ポータル'
const APP_SUBTITLE = import.meta.env.VITE_APP_SUBTITLE ?? '住民の暮らしが便利になる自治体とつながるアプリ'

export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <span className="brand-icon">🏛</span>
          <div className="brand-text">
            <h1>{APP_TITLE}</h1>
            <p>{APP_SUBTITLE}</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="welcome-text">山田 太郎 さん</span>
          <button className="logout-btn">ログアウト</button>
        </div>
      </div>
      <nav className="header-nav">
        {[
          { id: 'home', label: 'ホーム', icon: '🏠' },
          { id: 'news', label: '近隣情報', icon: '📰' },
          { id: 'faq', label: 'AI-FAQ', icon: '🤖' },
          { id: 'survey', label: '住民アンケート', icon: '📝' },
          { id: 'disaster', label: '災害情報報告', icon: '🚨' },
          { id: 'admin', label: '管理画面', icon: '⚙️' },
        ].map(item => (
          <button
            key={item.id}
            className={`nav-tab ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  )
}
