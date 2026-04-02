import { useState, lazy, Suspense } from 'react'

const MapPicker = lazy(() => import('../components/MapPicker'))
const ReportMap = lazy(() => import('../components/ReportMap'))

const DISASTER_TYPES = [
  { value: 'bear',      label: '🐻 クマ出没',           color: '#dc2626' },
  { value: 'flood',     label: '🌊 浸水・冠水',          color: '#3b82f6' },
  { value: 'landslide', label: '⛰️ 土砂崩れ・崖崩れ',   color: '#92400e' },
  { value: 'fire',      label: '🔥 火災',                color: '#ef4444' },
  { value: 'road',      label: '🚧 道路損壊・陥没',      color: '#f97316' },
  { value: 'tree',      label: '🌳 倒木・倒壊',          color: '#22c55e' },
  { value: 'wind',      label: '🌀 強風・突風被害',       color: '#8b5cf6' },
  { value: 'other',     label: '📋 その他',              color: '#6b7280' },
]

const TYPE_MAP = Object.fromEntries(DISASTER_TYPES.map(t => [t.value, t]))

const STATUS_STYLE = {
  '受付済':   { bg: '#dbeafe', color: '#1d4ed8' },
  '確認済':   { bg: '#fef3c7', color: '#d97706' },
  '対応中':   { bg: '#fed7aa', color: '#ea580c' },
  '対応完了': { bg: '#d1fae5', color: '#059669' },
}

export default function DisasterReportPage({ reports, setReports }) {
  const [tab, setTab]         = useState('report')
  const [submitted, setSubmitted]   = useState(false)
  const [newReportId, setNewReportId] = useState('')
  const [listView, setListView] = useState('map') // 'map' | 'cards'

  const [form, setForm] = useState({
    type: '', location: '', datetime: '',
    description: '', name: '', contact: '',
    anonymous: false, lat: null, lng: null,
  })
  const [errors, setErrors] = useState({})

  const bearCount = reports.filter(r => r.type === 'bear' && r.status !== '対応完了').length

  const validate = () => {
    const e = {}
    if (!form.type)               e.type        = '災害種別を選択してください'
    if (!form.location.trim())    e.location    = '発生場所を入力してください'
    if (!form.datetime)           e.datetime    = '発生日時を入力してください'
    if (!form.description.trim()) e.description = '状況説明を入力してください'
    if (!form.anonymous && !form.name.trim())
                                  e.name        = '氏名を入力してください（匿名の場合はチェックを入れてください）'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const id = `DR-2026-${String(45 + reports.length).padStart(4, '0')}`
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    const submittedAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    const typeInfo = TYPE_MAP[form.type]
    const newReport = {
      id,
      type: form.type,
      typeLabel: typeInfo.label,
      location: form.location,
      datetime: form.datetime,
      description: form.description,
      name: form.anonymous ? '匿名' : form.name,
      contact: form.anonymous ? '' : form.contact,
      status: '受付済',
      submittedAt,
      lat: form.lat,
      lng: form.lng,
    }
    setReports([newReport, ...reports])
    setNewReportId(id)
    setSubmitted(true)
  }

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  const handleMapPick = (lat, lng) => {
    setForm(f => ({ ...f, lat, lng }))
  }

  const resetForm = () => {
    setForm({ type: '', location: '', datetime: '', description: '', name: '', contact: '', anonymous: false, lat: null, lng: null })
    setErrors({})
    setSubmitted(false)
    setNewReportId('')
  }

  return (
    <div className="page disaster-page">
      {/* ヘッダー */}
      <div className="disaster-header">
        <div className="disaster-title-row">
          <h2 className="page-title">🚨 災害情報の報告・受付</h2>
          {bearCount > 0 && (
            <div className="bear-alert-badge">
              🐻 クマ出没情報 {bearCount}件 対応中
            </div>
          )}
        </div>
        <p className="disaster-desc">
          浸水・倒木・クマ出没など、地域の被害・危険情報をお知らせください。担当部署が確認し、迅速に対応します。
        </p>
        <div className="disaster-alert">
          <span className="alert-icon">⚠️</span>
          <span>生命に関わる緊急事態は、まず <strong>119番（火災・救急）</strong> または <strong>110番（警察）</strong> に連絡してください。</span>
        </div>
      </div>

      {/* タブ */}
      <div className="disaster-tabs">
        <button className={`disaster-tab ${tab === 'report' ? 'active' : ''}`} onClick={() => setTab('report')}>
          📝 災害情報を報告する
        </button>
        <button className={`disaster-tab ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>
          🗺️ 受付一覧・地図 <span className="tab-count">{reports.length}</span>
        </button>
      </div>

      {/* ======== 報告フォーム ======== */}
      {tab === 'report' && (
        <div className="disaster-form-wrap">
          {submitted ? (
            <div className="report-complete">
              <div className="complete-icon">✅</div>
              <h3>報告を受け付けました</h3>
              <p>受付番号：<strong className="receipt-id">{newReportId}</strong></p>
              <p className="complete-sub">
                担当部署が内容を確認し、対応いたします。<br />
                受付番号はお問い合わせの際にお使いください。
              </p>
              <div className="complete-actions">
                <button className="btn-primary" onClick={resetForm}>続けて報告する</button>
                <button className="btn-secondary" onClick={() => { resetForm(); setTab('list') }}>
                  地図で確認する
                </button>
              </div>
            </div>
          ) : (
            <form className="disaster-form" onSubmit={handleSubmit} noValidate>

              {/* 災害種別 */}
              <div className="form-group">
                <label className="form-label required">災害種別</label>
                <div className="type-grid">
                  {DISASTER_TYPES.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      className={`type-btn ${form.type === t.value ? 'selected' : ''} ${t.value === 'bear' ? 'type-btn-bear' : ''}`}
                      style={{ '--type-color': t.color }}
                      onClick={() => handleChange('type', t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {errors.type && <p className="form-error">{errors.type}</p>}
              </div>

              {/* クマ注意喚起 */}
              {form.type === 'bear' && (
                <div className="bear-caution">
                  <p className="bear-caution-title">🐻 クマ出没を報告される方へ</p>
                  <ul className="bear-caution-list">
                    <li>クマを見かけても絶対に近づかないでください</li>
                    <li>その場から静かに離れ、安全な場所に移動してください</li>
                    <li>クマに遭遇した場合は 警察（110番）または市役所へご連絡ください</li>
                  </ul>
                </div>
              )}

              {/* 発生場所（テキスト） */}
              <div className="form-group">
                <label className="form-label required" htmlFor="location">発生場所</label>
                <input
                  id="location"
                  type="text"
                  className={`form-input ${errors.location ? 'error' : ''}`}
                  placeholder="例：北山公園 第2駐車場付近"
                  value={form.location}
                  onChange={e => handleChange('location', e.target.value)}
                />
                {errors.location && <p className="form-error">{errors.location}</p>}
              </div>

              {/* 地図ピッカー */}
              <div className="form-group">
                <label className="form-label">地図で場所を指定（任意）</label>
                <Suspense fallback={<div className="map-loading">地図を読み込み中...</div>}>
                  <MapPicker
                    lat={form.lat}
                    lng={form.lng}
                    onPick={handleMapPick}
                  />
                </Suspense>
              </div>

              {/* 発生日時 */}
              <div className="form-group">
                <label className="form-label required" htmlFor="datetime">発生日時（おおよそ）</label>
                <input
                  id="datetime"
                  type="datetime-local"
                  className={`form-input ${errors.datetime ? 'error' : ''}`}
                  value={form.datetime}
                  onChange={e => handleChange('datetime', e.target.value)}
                />
                {errors.datetime && <p className="form-error">{errors.datetime}</p>}
              </div>

              {/* 状況説明 */}
              <div className="form-group">
                <label className="form-label required" htmlFor="description">状況の説明</label>
                <textarea
                  id="description"
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  rows={4}
                  placeholder={form.type === 'bear'
                    ? 'クマの頭数・大きさ・行動・子連れかどうかなどをお書きください。'
                    : '被害の状況、範囲、危険度など、できるだけ詳しくお書きください。'}
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                />
                <p className="form-hint">{form.description.length} 文字</p>
                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>

              {/* 写真添付 */}
              <div className="form-group">
                <label className="form-label">写真の添付（任意）</label>
                <div className="file-upload-area">
                  <span className="file-upload-icon">📷</span>
                  <span className="file-upload-text">クリックまたはドラッグで写真を追加</span>
                  <span className="file-upload-hint">JPG・PNG・HEIC ／ 最大10MB ／ 最大5枚</span>
                  <input type="file" accept="image/*" multiple className="file-input" disabled title="デモ用のため無効" />
                </div>
              </div>

              {/* 報告者情報 */}
              <div className="form-group">
                <label className="form-label">報告者情報</label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.anonymous} onChange={e => handleChange('anonymous', e.target.checked)} />
                  匿名で報告する
                </label>
              </div>

              {!form.anonymous && (
                <>
                  <div className="form-group">
                    <label className="form-label required" htmlFor="name">氏名</label>
                    <input
                      id="name"
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="山田 太郎"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact">連絡先電話番号（任意）</label>
                    <input
                      id="contact"
                      type="tel"
                      className="form-input"
                      placeholder="090-0000-0000"
                      value={form.contact}
                      onChange={e => handleChange('contact', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-submit">
                <button type="submit" className={`btn-report ${form.type === 'bear' ? 'btn-report-bear' : ''}`}>
                  {form.type === 'bear' ? '🐻 クマ出没を報告する' : '🚨 災害情報を報告する'}
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* ======== 一覧・地図 ======== */}
      {tab === 'list' && (
        <div className="report-list-wrap">
          {/* ビュー切替 */}
          <div className="list-view-toggle">
            <button className={`view-toggle-btn ${listView === 'map' ? 'active' : ''}`} onClick={() => setListView('map')}>
              🗺️ 地図
            </button>
            <button className={`view-toggle-btn ${listView === 'cards' ? 'active' : ''}`} onClick={() => setListView('cards')}>
              📋 カード一覧
            </button>
          </div>

          {/* クマ出没サマリー */}
          {bearCount > 0 && (
            <div className="bear-summary">
              <span className="bear-summary-icon">🐻</span>
              <div>
                <p className="bear-summary-title">クマ出没情報 — 現在 {bearCount} 件対応中</p>
                <p className="bear-summary-sub">地図上の赤いマーカーで出没地点を確認できます。該当エリアへの立入りはご注意ください。</p>
              </div>
            </div>
          )}

          {/* 地図ビュー */}
          {listView === 'map' && (
            <>
              <Suspense fallback={<div className="map-loading">地図を読み込み中...</div>}>
                <ReportMap reports={reports} />
              </Suspense>
              <div className="map-legend">
                {[
                  { color: '#dc2626', label: 'クマ出没' },
                  { color: '#3b82f6', label: '浸水・冠水' },
                  { color: '#ef4444', label: '火災' },
                  { color: '#f97316', label: '道路損壊' },
                  { color: '#22c55e', label: '倒木' },
                  { color: '#6b7280', label: 'その他' },
                ].map(l => (
                  <span key={l.label} className="legend-item">
                    <span className="legend-dot" style={{ background: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* カードビュー */}
          {listView === 'cards' && (
            <>
              <div className="report-list-header">
                <span className="list-count">全 {reports.length} 件</span>
                <div className="status-legend">
                  {Object.entries(STATUS_STYLE).map(([s, style]) => (
                    <span key={s} className="legend-badge" style={{ background: style.bg, color: style.color }}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="report-cards">
                {reports.map(r => {
                  const typeInfo = TYPE_MAP[r.type] || TYPE_MAP.other
                  const statusStyle = STATUS_STYLE[r.status] || STATUS_STYLE['受付済']
                  return (
                    <div
                      key={r.id}
                      className={`report-card ${r.type === 'bear' ? 'report-card-bear' : ''}`}
                      style={{ '--rtype-color': typeInfo.color }}
                    >
                      <div className="report-card-head">
                        <span className="report-type-badge" style={{ background: typeInfo.color + '20', color: typeInfo.color }}>
                          {typeInfo.label}
                        </span>
                        <span className="report-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                          {r.status}
                        </span>
                        <span className="report-id">{r.id}</span>
                      </div>
                      <div className="report-location">📍 {r.location}</div>
                      {r.lat && r.lng && (
                        <div className="report-coords-badge">🗺️ 位置情報あり ({r.lat.toFixed(4)}, {r.lng.toFixed(4)})</div>
                      )}
                      <div className="report-datetime">🕐 発生日時：{r.datetime.replace('T', ' ')}</div>
                      <p className="report-description">{r.description}</p>
                      <div className="report-footer">
                        <span>報告者：{r.name}</span>
                        <span className="report-submitted">受付：{r.submittedAt}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
