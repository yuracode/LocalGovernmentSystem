import { useState } from 'react'

const initialApplications = [
  { id: 'A-2026-001', type: '住民票交付', applicant: '山田 太郎', date: '2026/04/01', status: '処理済', priority: 'normal' },
  { id: 'A-2026-002', type: '転入届', applicant: '鈴木 花子', date: '2026/04/01', status: '処理中', priority: 'high' },
  { id: 'A-2026-003', type: '印鑑登録', applicant: '田中 一郎', date: '2026/03/31', status: '待機中', priority: 'normal' },
  { id: 'A-2026-004', type: '粗大ごみ収集申込', applicant: '佐藤 美咲', date: '2026/03/31', status: '処理済', priority: 'normal' },
  { id: 'A-2026-005', type: '保育所入所申請', applicant: '伊藤 健二', date: '2026/03/30', status: '審査中', priority: 'high' },
  { id: 'A-2026-006', type: '施設予約', applicant: '渡辺 洋子', date: '2026/03/30', status: '処理済', priority: 'normal' },
  { id: 'A-2026-007', type: '特定健診申込', applicant: '中村 剛', date: '2026/03/29', status: '待機中', priority: 'low' },
  { id: 'A-2026-008', type: '転出届', applicant: '小林 さくら', date: '2026/03/29', status: '処理中', priority: 'normal' },
  { id: 'A-2026-009', type: '住民票交付', applicant: '加藤 誠', date: '2026/03/28', status: '処理済', priority: 'normal' },
  { id: 'A-2026-010', type: '子育て給付金申請', applicant: '松本 里奈', date: '2026/03/28', status: '審査中', priority: 'high' },
]

const statusConfig = {
  '処理済': { color: '#22c55e', bg: '#dcfce7' },
  '処理中': { color: '#3b82f6', bg: '#dbeafe' },
  '待機中': { color: '#f59e0b', bg: '#fef3c7' },
  '審査中': { color: '#8b5cf6', bg: '#ede9fe' },
}

const stats = [
  { label: '本日の申請数', value: '24', icon: '📋', color: '#3b82f6' },
  { label: '処理待ち', value: '8', icon: '⏳', color: '#f59e0b' },
  { label: '今月完了', value: '187', icon: '✅', color: '#22c55e' },
  { label: 'アンケート回答', value: '52', icon: '📝', color: '#8b5cf6' },
]

export default function AdminPage() {
  const [applications, setApplications] = useState(initialApplications)
  const [filter, setFilter] = useState('すべて')
  const [searchText, setSearchText] = useState('')

  const statuses = ['すべて', '待機中', '処理中', '審査中', '処理済']

  const filtered = applications.filter(a => {
    const matchStatus = filter === 'すべて' || a.status === filter
    const matchSearch = !searchText ||
      a.applicant.includes(searchText) ||
      a.type.includes(searchText) ||
      a.id.includes(searchText)
    return matchStatus && matchSearch
  })

  const updateStatus = (id, newStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
  }

  return (
    <div className="page admin-page">
      <h2 className="page-title">⚙️ 管理画面</h2>

      <div className="stats-row">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--stat-color': s.color }}>
            <span className="stat-icon">{s.icon}</span>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-table-section">
        <div className="table-toolbar">
          <h3>申請管理</h3>
          <div className="toolbar-right">
            <input
              type="text"
              className="search-input"
              placeholder="氏名・種類・ID で検索..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <div className="status-filters">
              {statuses.map(s => (
                <button
                  key={s}
                  className={`filter-btn ${filter === s ? 'active' : ''}`}
                  onClick={() => setFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>申請ID</th>
                <th>申請種類</th>
                <th>申請者</th>
                <th>申請日</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const sc = statusConfig[a.status]
                return (
                  <tr key={a.id} className={`priority-${a.priority}`}>
                    <td className="id-cell">{a.id}</td>
                    <td>{a.type}</td>
                    <td>{a.applicant}</td>
                    <td>{a.date}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ color: sc.color, background: sc.bg }}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={a.status}
                        onChange={e => updateStatus(a.id, e.target.value)}
                      >
                        {Object.keys(statusConfig).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="no-results">該当する申請が見つかりません</p>
          )}
        </div>
        <p className="table-count">{filtered.length} 件表示中 / 全 {applications.length} 件</p>
      </div>
    </div>
  )
}
