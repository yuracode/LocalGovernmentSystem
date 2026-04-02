import { useState } from 'react'

const NEWS_ITEMS = [
  {
    id: 1,
    category: '防災・緊急',
    title: '令和8年度 総合防災訓練のご案内',
    date: '2026/03/28',
    summary: '4月20日（日）に市内各地域で総合防災訓練を実施します。地震発生時の避難手順や初期消火訓練など、実践的な内容で行います。',
    body: `4月20日（日）午前9時より、市内各地域において令和8年度総合防災訓練を実施します。

【訓練内容】
・地震体験車による震度体験
・避難所開設・運営訓練
・初期消火訓練（消火器の使い方）
・AED・心肺蘇生法講習
・炊き出し訓練（非常食の試食）

【参加方法】
事前申込は不要です。お近くの避難所または公民館にお越しください。

【持ち物】
動きやすい服装・運動靴でご参加ください。非常用持ち出し袋をお持ちの方はぜひご持参ください。

地域の防災力向上のため、ぜひ多くの市民の皆さまのご参加をお待ちしております。`,
    colorBg: '#fee2e2',
    colorAccent: '#dc2626',
    emoji: '🔥',
    tag: '防災',
    urgent: true,
  },
  {
    id: 2,
    category: '防災・緊急',
    title: '土砂災害警戒区域マップ更新のお知らせ',
    date: '2026/03/20',
    summary: '令和8年度版ハザードマップを更新しました。新たに指定された土砂災害警戒区域と避難経路を必ずご確認ください。',
    body: `県の調査結果に基づき、市内の土砂災害警戒区域の指定が一部変更されました。

【主な変更点】
・北山地区：新たに3箇所を土砂災害特別警戒区域に指定
・西山林道沿い：急傾斜地崩壊危険箇所を追加
・桜川上流域：洪水浸水想定区域の範囲を拡大

【確認方法】
最新のハザードマップは市役所窓口および市公式サイトからダウンロードできます。

【注意事項】
大雨・台風の際は早めの避難を心がけ、気象情報・避難情報に注意してください。
避難場所・避難経路は事前に家族で確認しておきましょう。`,
    colorBg: '#fef3c7',
    colorAccent: '#d97706',
    emoji: '🗾',
    tag: '防災',
    urgent: true,
  },
  {
    id: 3,
    category: '地域情報',
    title: '商店街リニューアルオープン！新しい店舗が続々登場',
    date: '2026/04/01',
    summary: '駅前商店街が大規模リニューアルを実施。飲食店や雑貨店など20店舗以上が新規出店し、地域の新たな賑わいを創出しています。',
    body: `駅前商店街が創立50周年を機に大規模リニューアルを実施しました。

【新規出店店舗（一部）】
・地元野菜のデリカテッセン「ベジテーブル」
・フレッシュジュース専門店「ジューサリー北山」
・子供向けおもちゃ・絵本の「えほんや」
・コワーキングスペース併設カフェ「マチノイエ」

【リニューアルポイント】
屋根付きアーケードを整備し、雨の日も快適にお買い物いただけます。
バリアフリー対応のスロープ・多目的トイレも設置しました。

【営業時間】
10:00〜20:00（店舗により異なります）
毎週水曜日は定休日の店舗が多いのでご注意ください。`,
    colorBg: '#dbeafe',
    colorAccent: '#2563eb',
    emoji: '🏪',
    tag: '商業',
    urgent: false,
  },
  {
    id: 4,
    category: '子育て',
    title: '春の子育て広場 イベント開催のお知らせ',
    date: '2026/03/25',
    summary: '市立子育て支援センターにて、親子で楽しめる春のイベントを開催します。工作体験や読み聞かせ、育児相談コーナーもご利用いただけます。',
    body: `市立子育て支援センター「すくすく広場」では、春の特別イベントを開催します。

【開催日程】
4月12日（土）・4月19日（土）
各日 10:00〜15:00（入退場自由）

【プログラム】
・手形アートで作るこいのぼり（要材料費200円）
・絵本の読み聞かせタイム（11:00・13:30）
・保育士による育児相談（随時受付）
・離乳食・幼児食の試食コーナー

【対象】
0歳〜就学前のお子さんと保護者

【場所】
市立子育て支援センター（市役所東棟1階）

申込不要・参加無料です。動きやすい服装でお越しください。`,
    colorBg: '#fef3c7',
    colorAccent: '#d97706',
    emoji: '👶',
    tag: '子育て',
    urgent: false,
  },
  {
    id: 5,
    category: '環境',
    title: '市内公園の桜の開花状況をお知らせします',
    date: '2026/03/22',
    summary: '中央公園・川沿い緑地など市内主要公園の桜が見頃を迎えています。各公園の開花状況はポータルサイトでリアルタイムに確認できます。',
    body: `市内の桜の開花状況についてお知らせします。

【主要公園の開花状況（4月2日時点）】
・中央公園（約200本）：満開 ★★★★★
・川沿い緑地（約120本）：満開 ★★★★★
・北山公園（約80本）：七分咲き ★★★★☆
・東部運動公園（約50本）：五分咲き ★★★☆☆

【ライトアップ情報】
中央公園では4月6日（日）まで日没後〜21:00にライトアップを実施中です。

【注意事項】
・バーベキューは禁止エリアがあります。事前に管理事務所へご確認ください。
・ゴミは必ずお持ち帰りください。
・北山公園周辺でクマの目撃情報があります。早朝・夕方の単独行動はご注意ください。`,
    colorBg: '#fce7f3',
    colorAccent: '#db2777',
    emoji: '🌸',
    tag: '環境',
    urgent: false,
  },
  {
    id: 6,
    category: '交通',
    title: '路線バスのダイヤ改正について（4月1日より）',
    date: '2026/03/20',
    summary: '令和8年4月1日よりコミュニティバス「まちめぐり号」のダイヤ改正を行います。一部系統の増便と時刻変更がございます。',
    body: `令和8年4月1日より、コミュニティバス「まちめぐり号」のダイヤ改正を実施します。

【主な変更点】
＜増便＞
・北山ルート：平日の朝夕ラッシュ時に各2本増便
・商店街ルート：土日の日中時間帯に1時間間隔から30分間隔に変更

＜時刻変更＞
・東部病院前停留所発：現行7:32 → 改正後7:40
・市役所前停留所発：現行17:55 → 改正後18:05

【新時刻表の入手方法】
・市役所1階インフォメーション
・各バス停への掲示
・市公式サイトよりダウンロード

詳細は市公共交通課（内線：245）までお問い合わせください。`,
    colorBg: '#d1fae5',
    colorAccent: '#059669',
    emoji: '🚌',
    tag: '交通',
    urgent: false,
  },
  {
    id: 7,
    category: '健康',
    title: '特定健診・がん検診の受付を開始しました',
    date: '2026/03/15',
    summary: '令和8年度の特定健康診査および各種がん検診の申込受付を開始しました。対象の方は受診票をご確認のうえ、お早めにお申し込みください。',
    body: `令和8年度の特定健康診査（メタボ健診）および各種がん検診の受付を開始しました。

【対象者】
・特定健診：40〜74歳の国民健康保険加入者
・各種がん検診：対象年齢は検診の種類により異なります

【実施期間】
令和8年5月1日〜令和9年2月28日

【検診の種類と対象年齢】
・胃がん検診：40歳以上（偶数年齢）
・大腸がん検診：40歳以上
・肺がん検診：40歳以上
・乳がん検診：40歳以上（偶数年齢）
・子宮頸がん検診：20歳以上（偶数年齢）

【申込方法】
受診票に同封の申込書を返送するか、市公式サイトからオンライン申込が可能です。

定期的な検診で早期発見・早期治療を心がけましょう。`,
    colorBg: '#ede9fe',
    colorAccent: '#7c3aed',
    emoji: '🏥',
    tag: '健康',
    urgent: false,
  },
]

const FILTERS = ['すべて', '防災・緊急', '地域情報', '子育て', '健康', '交通', '環境', '住民報告']

const DISASTER_TYPE_COLOR = {
  bear:      { bg: '#fee2e2', accent: '#dc2626', emoji: '🐻' },
  flood:     { bg: '#dbeafe', accent: '#3b82f6', emoji: '🌊' },
  landslide: { bg: '#fef3c7', accent: '#92400e', emoji: '⛰️' },
  fire:      { bg: '#fee2e2', accent: '#ef4444', emoji: '🔥' },
  road:      { bg: '#ffedd5', accent: '#f97316', emoji: '🚧' },
  tree:      { bg: '#dcfce7', accent: '#22c55e', emoji: '🌳' },
  wind:      { bg: '#ede9fe', accent: '#8b5cf6', emoji: '🌀' },
  other:     { bg: '#f3f4f6', accent: '#6b7280', emoji: '📋' },
}

const STATUS_STYLE = {
  '受付済':   { bg: '#dbeafe', color: '#1d4ed8' },
  '確認済':   { bg: '#fef3c7', color: '#d97706' },
  '対応中':   { bg: '#fed7aa', color: '#ea580c' },
  '対応完了': { bg: '#d1fae5', color: '#059669' },
}

export default function NewsPage({ disasterReports = [], onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('すべて')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const activeReports = disasterReports.filter(r => r.status !== '対応完了')
  const bearReports   = activeReports.filter(r => r.type === 'bear')

  const filteredNews = activeFilter === 'すべて'
    ? NEWS_ITEMS
    : activeFilter === '住民報告'
    ? []
    : NEWS_ITEMS.filter(n => n.category === activeFilter)

  const showDisasterSection = activeFilter === 'すべて' || activeFilter === '防災・緊急' || activeFilter === '住民報告'
  const showNewsGrid = activeFilter !== '住民報告' && filteredNews.length > 0

  return (
    <div className="page news-page">
      {/* ヘッダー */}
      <div className="page-header">
        <h2 className="page-title">📰 近隣情報・お知らせ</h2>
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-tab ${activeFilter === f ? 'active' : ''} ${f === '防災・緊急' || f === '住民報告' ? 'filter-tab-alert' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === '防災・緊急' && '🚨 '}{f === '住民報告' && '📣 '}{f}
              {f === '住民報告' && activeReports.length > 0 && (
                <span className="filter-badge">{activeReports.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* クマ緊急バナー */}
      {bearReports.length > 0 && (activeFilter === 'すべて' || activeFilter === '防災・緊急' || activeFilter === '住民報告') && (
        <div className="bear-news-banner">
          <span className="bear-news-icon">🐻</span>
          <div className="bear-news-content">
            <p className="bear-news-title">【緊急】クマ出没情報 — 現在 {bearReports.length} 件対応中</p>
            <p className="bear-news-sub">
              {bearReports.map(r => r.location).join('、')} 付近で目撃情報があります。
              該当エリアへの立入りはご注意ください。
            </p>
          </div>
          <button className="bear-news-btn" onClick={() => onNavigate('disaster')}>
            地図で確認 →
          </button>
        </div>
      )}

      {/* 住民からの最新報告セクション */}
      {showDisasterSection && activeReports.length > 0 && (
        <section className="disaster-news-section">
          <div className="disaster-news-header">
            <h3 className="disaster-news-title">📣 住民からの最新報告</h3>
            <button className="disaster-news-more" onClick={() => onNavigate('disaster')}>
              すべて見る・報告する →
            </button>
          </div>
          <div className="disaster-report-cards">
            {activeReports.slice(0, 4).map(r => {
              const style = DISASTER_TYPE_COLOR[r.type] || DISASTER_TYPE_COLOR.other
              const statusStyle = STATUS_STYLE[r.status] || STATUS_STYLE['受付済']
              return (
                <div
                  key={r.id}
                  className={`disaster-news-card ${r.type === 'bear' ? 'disaster-news-card-bear' : ''}`}
                  style={{ borderLeftColor: style.accent }}
                >
                  <div className="disaster-news-card-top">
                    <span className="disaster-news-card-type" style={{ background: style.bg, color: style.accent }}>
                      {style.emoji} {r.typeLabel.replace(/^[^\s]+\s/, '')}
                    </span>
                    <span className="disaster-news-card-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                      {r.status}
                    </span>
                    <span className="disaster-news-card-time">{r.submittedAt}</span>
                  </div>
                  <p className="disaster-news-card-location">📍 {r.location}</p>
                  <p className="disaster-news-card-desc">{r.description}</p>
                </div>
              )
            })}
          </div>
          {activeReports.length > 4 && (
            <p className="disaster-news-overflow">
              他 {activeReports.length - 4} 件の報告があります。
              <button className="link-btn" onClick={() => onNavigate('disaster')}>すべて確認する</button>
            </p>
          )}
        </section>
      )}

      {/* 通常ニュースグリッド */}
      {showNewsGrid && (
        <div className="news-grid">
          {filteredNews.map(item => (
            <article key={item.id} className={`news-card ${item.urgent ? 'news-card-urgent' : ''}`}>
              <div className="news-image" style={{ background: item.colorBg, color: item.colorAccent }}>
                <span className="news-emoji">{item.emoji}</span>
                <span className="news-tag" style={{ background: item.colorAccent }}>{item.tag}</span>
                {item.urgent && <span className="news-urgent-badge">緊急</span>}
              </div>
              <div className="news-body">
                <div className="news-meta">
                  <span className="news-category" style={{ color: item.colorAccent }}>{item.category}</span>
                  <span className="news-date">{item.date}</span>
                </div>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-summary">{item.summary}</p>
                <button className="news-read-more" onClick={() => setSelectedArticle(item)}>
                  続きを読む →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 住民報告フィルター時・記事なし */}
      {activeFilter === '住民報告' && activeReports.length === 0 && (
        <div className="news-empty">
          <p>現在、対応中の住民報告はありません。</p>
        </div>
      )}

      {!showDisasterSection && !showNewsGrid && (
        <div className="news-empty">
          <p>このカテゴリの記事はありません。</p>
        </div>
      )}

      {/* 記事詳細モーダル */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-hero" style={{ background: selectedArticle.colorBg }}>
              <span className="modal-hero-emoji">{selectedArticle.emoji}</span>
              <span className="modal-hero-tag" style={{ background: selectedArticle.colorAccent }}>
                {selectedArticle.tag}
              </span>
              {selectedArticle.urgent && (
                <span className="modal-urgent-badge">緊急</span>
              )}
            </div>
            <div className="modal-body">
              <div className="modal-meta">
                <span className="modal-category" style={{ color: selectedArticle.colorAccent }}>
                  {selectedArticle.category}
                </span>
                <span className="modal-date">{selectedArticle.date}</span>
              </div>
              <h2 className="modal-title">{selectedArticle.title}</h2>
              <div className="modal-article-body">
                {selectedArticle.body.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedArticle(null)}>
                ✕ 閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
