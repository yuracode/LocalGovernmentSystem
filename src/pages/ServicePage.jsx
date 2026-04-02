import { useState } from 'react'

/* ===== 各サービスのデータ定義 ===== */
const SERVICES = {
  1: {
    icon: '📋', label: '手続き・届出', color: '#3b82f6',
    desc: '住民登録・戸籍・印鑑登録など各種申請・届出の手続きをご案内します。',
  },
  2: {
    icon: '🏥', label: '医療・健康', color: '#ef4444',
    desc: '市内の医療機関情報、各種健康診断・がん検診のご案内です。',
  },
  3: {
    icon: '👶', label: '子育て支援', color: '#f97316',
    desc: '保育所入所から子育て相談まで、子育て家庭を全力でサポートします。',
  },
  4: {
    icon: '🔥', label: '防災・安全', color: '#eab308',
    desc: '避難所・ハザードマップ・防災グッズ準備など、いざという時の備えを確認しましょう。',
  },
  5: {
    icon: '🏛', label: '施設予約', color: '#22c55e',
    desc: '市民ホール・会議室・体育館など公共施設のオンライン予約ができます。',
  },
  6: {
    icon: '🚌', label: '交通・バス', color: '#14b8a6',
    desc: 'コミュニティバスの路線・時刻表・乗り場情報をご確認いただけます。',
  },
  7: {
    icon: '♻️', label: 'ごみ・環境', color: '#8b5cf6',
    desc: 'ごみの分別方法・収集曜日・粗大ごみ申込など環境関連情報です。',
  },
  8: {
    icon: '📅', label: 'イベント情報', color: '#ec4899',
    desc: '市内で開催される地域イベント・祭り・講座などの情報をお届けします。',
  },
  9: {
    icon: '💼', label: '求人・就労', color: '#06b6d4',
    desc: '市内事業者の求人情報と就労支援サービスをご案内します。',
  },
  10: {
    icon: '🏫', label: '教育・学校', color: '#84cc16',
    desc: '市立学校・図書館・生涯学習講座などの教育情報をお届けします。',
  },
  11: {
    icon: '🌿', label: '公園・自然', color: '#10b981',
    desc: '市内の公園・緑地・自然スポットの情報と施設案内です。',
  },
  12: {
    icon: '💬', label: 'お問い合わせ', color: '#6366f1',
    desc: '各担当窓口への連絡先・オンライン問い合わせフォームはこちらです。',
  },
}

/* ===== 共通部品 ===== */
function InfoCard({ icon, title, items, color }) {
  return (
    <div className="svc-info-card" style={{ '--svc-c': color }}>
      <h4 className="svc-info-card-title"><span>{icon}</span>{title}</h4>
      <ul className="svc-info-list">
        {items.map((item, i) => (
          <li key={i} className="svc-info-item">
            {typeof item === 'string' ? item : (
              <span className="svc-info-kv">
                <span className="svc-info-key">{item.label}</span>
                <span className="svc-info-val">{item.value}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProcedureCard({ icon, title, time, place, docs, online }) {
  return (
    <div className="proc-card">
      <div className="proc-card-head">
        <span className="proc-icon">{icon}</span>
        <div>
          <p className="proc-title">{title}</p>
          <p className="proc-place">📍 {place}</p>
        </div>
        {online && <span className="proc-online-badge">オンライン可</span>}
      </div>
      <div className="proc-meta">
        <span>⏱ 所要時間：{time}</span>
      </div>
      <div className="proc-docs">
        <p className="proc-docs-label">必要書類</p>
        <ul>{docs.map((d, i) => <li key={i}>{d}</li>)}</ul>
      </div>
    </div>
  )
}

function FacilityCard({ icon, name, capacity, fee, hours, available }) {
  return (
    <div className="facility-card">
      <div className="facility-head">
        <span className="facility-icon">{icon}</span>
        <div>
          <p className="facility-name">{name}</p>
          <p className="facility-hours">🕐 {hours}</p>
        </div>
        <span className={`facility-badge ${available ? 'avail' : 'full'}`}>
          {available ? '空きあり' : '満室'}
        </span>
      </div>
      <div className="facility-meta">
        <span>👥 定員 {capacity}人</span>
        <span>💴 {fee}</span>
      </div>
    </div>
  )
}

function EventCard({ date, title, place, category, color }) {
  return (
    <div className="event-card" style={{ borderLeftColor: color }}>
      <div className="event-date-box" style={{ background: color + '15', color }}>
        <span className="event-month">{date.split('/')[1]}月</span>
        <span className="event-day">{date.split('/')[2]}</span>
      </div>
      <div className="event-body">
        <span className="event-category" style={{ color }}>{category}</span>
        <p className="event-title">{title}</p>
        <p className="event-place">📍 {place}</p>
      </div>
    </div>
  )
}

function JobCard({ company, title, type, salary, location, deadline }) {
  return (
    <div className="job-card">
      <div className="job-head">
        <div>
          <p className="job-title">{title}</p>
          <p className="job-company">{company}</p>
        </div>
        <span className="job-type-badge">{type}</span>
      </div>
      <div className="job-meta">
        <span>💴 {salary}</span>
        <span>📍 {location}</span>
        <span>📅 締切：{deadline}</span>
      </div>
    </div>
  )
}

/* ===== 各ページ内容 ===== */

function ServiceProcedures() {
  const procedures = [
    { icon: '🏠', title: '転入届', place: '市役所 市民課（1F）', time: '30〜60分', docs: ['転出証明書', '本人確認書類（運転免許証等）', '印鑑'], online: false },
    { icon: '🚚', title: '転出届', place: '市役所 市民課（1F）/ オンライン', time: '15〜30分', docs: ['本人確認書類', '印鑑'], online: true },
    { icon: '💍', title: '婚姻届', place: '市役所 市民課（1F）※24時間受付', time: '15〜30分', docs: ['婚姻届（証人2名の署名）', '戸籍謄本（本籍地以外の場合）', '本人確認書類', '印鑑'], online: false },
    { icon: '📄', title: '住民票の写し', place: '市役所 市民課・各出張所・コンビニ', time: '5〜15分', docs: ['本人確認書類', '（コンビニ）マイナンバーカード'], online: true },
    { icon: '🔏', title: '印鑑登録', place: '市役所 市民課（1F）', time: '15〜30分', docs: ['登録する印鑑', '本人確認書類（顔写真付き）'], online: false },
    { icon: '🪪', title: 'マイナンバーカード申請', place: '市役所 マイナンバー窓口（2F）/ オンライン', time: '30〜45分', docs: ['通知カードまたは個人番号通知書', '本人確認書類2点', '顔写真（証明写真）'], online: true },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">よくある手続き一覧</h3>
      <div className="proc-grid">
        {procedures.map((p, i) => <ProcedureCard key={i} {...p} />)}
      </div>
      <div className="svc-note">
        <p>💡 窓口受付時間：平日 8:30〜17:15（第2・第4土曜日 8:30〜12:00）</p>
        <p>💡 マイナンバーカードをお持ちの方はコンビニでの証明書取得が便利です（手数料200円）</p>
      </div>
    </div>
  )
}

function ServiceHealth() {
  const checkups = [
    { label: '特定健診（メタボ健診）', value: '40〜74歳の国保加入者 ／ 5〜2月' },
    { label: '胃がん検診', value: '40歳以上（偶数年齢）／ 6〜11月' },
    { label: '大腸がん検診', value: '40歳以上 ／ 5〜12月' },
    { label: '肺がん検診', value: '40歳以上 ／ 6〜11月' },
    { label: '乳がん検診（女性）', value: '40歳以上（偶数年齢）／ 7〜2月' },
    { label: '子宮頸がん検診（女性）', value: '20歳以上（偶数年齢）／ 6〜2月' },
  ]
  const facilities = [
    { label: '北山総合病院', value: '内科・外科・整形・救急 ／ 024-xxx-xxxx' },
    { label: '市立桜川クリニック', value: '内科・小児科 ／ 024-xxx-xxxx' },
    { label: '緑区歯科センター', value: '歯科・口腔外科 ／ 024-xxx-xxxx' },
    { label: '休日急患センター（市役所隣）', value: '日曜・祝日 9:00〜17:00' },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">健康診断・がん検診</h3>
      <InfoCard icon="📋" title="令和8年度 検診スケジュール" items={checkups} color="#ef4444" />
      <p className="svc-note-inline">申込みは市公式サイトまたは同封の申込書でお手続きください。</p>
      <h3 className="svc-section-title" style={{ marginTop: 24 }}>市内医療機関</h3>
      <InfoCard icon="🏥" title="主な医療機関" items={facilities} color="#ef4444" />
      <div className="svc-note">
        <p>🚑 救急・夜間は 北山総合病院（024-xxx-xxxx）または 119番にご連絡ください</p>
        <p>💊 かかりつけ薬局の活用で、薬の管理と医療費節約につながります</p>
      </div>
    </div>
  )
}

function ServiceChildcare() {
  const supports = [
    { icon: '🏫', title: '保育所・認定こども園', desc: '0〜5歳のお子さんを対象。入所申込みは10月〜11月に受付。', tag: '申込受付中' },
    { icon: '🤱', title: '子育て支援センター', desc: '就学前のお子さんと保護者が自由に遊べる場所。育児相談も実施。', tag: '予約不要' },
    { icon: '👨‍👩‍👧', title: 'ファミリーサポートセンター', desc: '地域の会員が子どもの送迎・一時預かりをサポート。', tag: '会員登録要' },
    { icon: '🍼', title: '産後ヘルパー派遣', desc: '産後8週間以内のお母さんに家事・育児サポートを派遣（最大10回）。', tag: '要申請' },
    { icon: '💰', title: '児童手当', desc: '0〜中学3年生まで支給。3歳未満：15,000円/月、3歳〜：10,000円/月。', tag: '毎年現況届要' },
    { icon: '🏥', title: '子ども医療費助成', desc: '中学3年生まで通院・入院の自己負担額を全額助成。', tag: '自動適用' },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">子育て支援サービス一覧</h3>
      <div className="support-grid">
        {supports.map((s, i) => (
          <div key={i} className="support-card">
            <div className="support-head">
              <span className="support-icon">{s.icon}</span>
              <span className="support-tag">{s.tag}</span>
            </div>
            <p className="support-title">{s.title}</p>
            <p className="support-desc">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="svc-note">
        <p>📞 子ども育成課（内線 456）平日 8:30〜17:15</p>
        <p>💻 保育所の空き状況・入所申込みはオンラインでもご確認いただけます</p>
      </div>
    </div>
  )
}

function ServiceDisaster({ onNavigate }) {
  const shelters = [
    { label: '北山小学校体育館', value: '収容800人 ／ ペット同伴可（屋外）' },
    { label: '市民ホール', value: '収容500人 ／ 車いす・バリアフリー対応' },
    { label: '桜川中学校', value: '収容600人 ／ 福祉避難室あり' },
    { label: '緑区コミュニティセンター', value: '収容200人' },
  ]
  const checklist = ['飲料水（1人3日分・2L×3本/日）', '食料品（3日分）', '携帯ラジオ・懐中電灯・電池', '救急セット・常備薬・処方薬', 'マスク・消毒液', '現金（小銭含む）', '防寒具・着替え', '貴重品のコピー（保険証・通帳等）']
  return (
    <div className="svc-section">
      <div className="disaster-link-banner" onClick={() => onNavigate('disaster')}>
        <span>🚨</span>
        <div>
          <p className="dlb-title">住民からの災害情報を報告・確認する</p>
          <p className="dlb-sub">浸水・クマ出没・道路損壊などの情報をマップで確認できます</p>
        </div>
        <span className="dlb-arrow">→</span>
      </div>

      <h3 className="svc-section-title">指定避難所一覧</h3>
      <InfoCard icon="🏫" title="市内指定避難所（一部）" items={shelters} color="#eab308" />

      <h3 className="svc-section-title" style={{ marginTop: 24 }}>非常用持ち出し袋チェックリスト</h3>
      <div className="checklist-grid">
        {checklist.map((item, i) => (
          <CheckItem key={i} label={item} />
        ))}
      </div>

      <div className="svc-note">
        <p>🗾 ハザードマップは市役所防災課（2F）または市公式サイトで配布・公開中</p>
        <p>📻 緊急情報は防災行政無線・市公式LINE・Yahoo!防災速報でお知らせします</p>
      </div>
    </div>
  )
}

function CheckItem({ label }) {
  const [checked, setChecked] = useState(false)
  return (
    <label className={`check-item ${checked ? 'checked' : ''}`}>
      <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

function ServiceFacility() {
  const facilities = [
    { icon: '🎭', name: '市民ホール 大ホール', capacity: 800, fee: '平日30,000円 / 休日45,000円', hours: '9:00〜22:00', available: true },
    { icon: '🏋️', name: '市民体育館 第1体育室', capacity: 200, fee: '2時間 2,000円', hours: '9:00〜21:00', available: false },
    { icon: '📚', name: '中央図書館 多目的室', capacity: 30, fee: '無料', hours: '9:00〜20:00', available: true },
    { icon: '🍳', name: '北山市民センター 調理室', capacity: 20, fee: '3時間 1,500円', hours: '9:00〜17:00', available: true },
    { icon: '🏊', name: '市民プール 25mコース', capacity: 60, fee: '1回 500円 / 月券 3,000円', hours: '9:00〜21:00', available: true },
    { icon: '🎨', name: '文化センター 展示室', capacity: 100, fee: '1日 5,000円', hours: '9:00〜17:00', available: false },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">施設の空き状況（4月）</h3>
      <div className="facility-grid">
        {facilities.map((f, i) => <FacilityCard key={i} {...f} />)}
      </div>
      <div className="svc-note">
        <p>📅 予約は利用日の3ヶ月前から受付。市民は1週間前まで変更・キャンセル無料</p>
        <p>💳 支払いはクレジットカード・PayPay・窓口現金払いに対応</p>
      </div>
      <button className="svc-primary-btn">オンライン予約へ進む</button>
    </div>
  )
}

function ServiceBus() {
  const routes = [
    { name: '北山ルート', stops: '市役所 → 北山公園 → 北山小学校 → 総合病院 → 北山駅', freq: '平日 30分毎 / 休日 60分毎', first: '7:00', last: '20:30' },
    { name: '商店街ルート', stops: '市役所 → 駅前商店街 → 文化センター → 図書館 → 市役所', freq: '平日 30分毎 / 休日 30分毎', first: '8:00', last: '19:00' },
    { name: '東部ルート', stops: '市役所 → 東部病院 → 桜川中学校 → 緑区センター → 東部団地', freq: '平日 60分毎', first: '8:30', last: '17:30' },
    { name: '西山デマンドバス', stops: '要事前予約（前日17時まで）— 西山地区内任意の停留所', freq: '1日4便', first: '9:00', last: '16:00' },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">コミュニティバス「まちめぐり号」路線案内</h3>
      <div className="bus-route-list">
        {routes.map((r, i) => (
          <div key={i} className="bus-route-card">
            <div className="bus-route-head">
              <span className="bus-route-name">🚌 {r.name}</span>
              <span className="bus-freq">{r.freq}</span>
            </div>
            <p className="bus-stops">{r.stops}</p>
            <div className="bus-times">
              <span>始発 {r.first}</span>
              <span>終発 {r.last}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="svc-note">
        <p>🎫 運賃：大人 200円 / 小学生以下 100円 / 障害者・65歳以上 100円</p>
        <p>💳 交通系ICカード（Suica・ICOCA等）利用可</p>
        <p>📞 デマンドバス予約：公共交通課 000-000-0000（平日 8:30〜17:00）</p>
      </div>
    </div>
  )
}

function ServiceGarbage() {
  const schedule = [
    { day: '月', items: ['燃えるごみ', '燃えないごみ（第2・4週のみ）'], colors: ['#f97316', '#6b7280'] },
    { day: '火', items: ['プラスチック容器包装'], colors: ['#8b5cf6'] },
    { day: '水', items: ['燃えるごみ'], colors: ['#f97316'] },
    { day: '木', items: ['缶・ビン・ペットボトル'], colors: ['#3b82f6'] },
    { day: '金', items: ['燃えるごみ'], colors: ['#f97316'] },
    { day: '土', items: ['収集なし'], colors: ['#e5e7eb'] },
    { day: '日', items: ['収集なし'], colors: ['#e5e7eb'] },
  ]
  const rules = [
    { label: '燃えるごみ', value: '指定袋（黄色）に入れ、朝8時までに集積所へ', color: '#f97316' },
    { label: '燃えないごみ', value: '指定袋（緑色）。スプレー缶は必ず穴を開ける', color: '#6b7280' },
    { label: 'プラスチック', value: '汚れはすすいで乾かす。汚れがひどい場合は燃えるごみへ', color: '#8b5cf6' },
    { label: '缶・ビン・ペットボトル', value: 'すすいで中身を空に。キャップ・ラベルはプラへ', color: '#3b82f6' },
    { label: '粗大ごみ', value: '事前電話申込必須。収集シール（300円/枚）を貼って出す', color: '#ef4444' },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">ごみ収集カレンダー</h3>
      <div className="garbage-calendar">
        {schedule.map((s) => (
          <div key={s.day} className={`gc-day ${s.items[0] === '収集なし' ? 'gc-day-rest' : ''}`}>
            <div className="gc-day-label">{s.day}</div>
            {s.items.map((item, i) => (
              <div key={i} className="gc-item" style={{ background: s.colors[i] + '20', color: s.colors[i] }}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h3 className="svc-section-title" style={{ marginTop: 24 }}>分別のルール</h3>
      <div className="garbage-rules">
        {rules.map((r, i) => (
          <div key={i} className="garbage-rule" style={{ borderLeftColor: r.color }}>
            <span className="gr-label" style={{ color: r.color }}>{r.label}</span>
            <span className="gr-val">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="svc-note">
        <p>📞 粗大ごみ申込・ごみに関するお問い合わせ：環境課 000-000-0000</p>
        <p>🚯 集積所への不法投棄は条例により罰せられます</p>
      </div>
    </div>
  )
}

function ServiceEvents() {
  const events = [
    { date: '2026/04/12', title: '春の子育て広場 工作＆読み聞かせイベント', place: '市立子育て支援センター', category: '子育て', color: '#f97316' },
    { date: '2026/04/19', title: '市民ハイキング 北山自然観察会', place: '北山公園 第1駐車場 集合', category: '自然', color: '#10b981' },
    { date: '2026/04/20', title: '令和8年度 総合防災訓練', place: '市内各避難所', category: '防災', color: '#dc2626' },
    { date: '2026/04/26', title: '春のフリーマーケット', place: '中央公園 多目的広場', category: '地域', color: '#3b82f6' },
    { date: '2026/05/03', title: '市民まつり 2026 （前夜祭）', place: '駅前広場', category: '祭り', color: '#ec4899' },
    { date: '2026/05/04', title: '市民まつり 2026 （本番）', place: '駅前広場〜商店街', category: '祭り', color: '#ec4899' },
    { date: '2026/05/10', title: 'パソコン入門講座（全4回）', place: '文化センター 研修室', category: '講座', color: '#8b5cf6' },
    { date: '2026/05/17', title: '親子クッキング教室', place: '北山市民センター 調理室', category: '子育て', color: '#f97316' },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">4〜5月のイベント</h3>
      <div className="event-list">
        {events.map((e, i) => <EventCard key={i} {...e} />)}
      </div>
      <div className="svc-note">
        <p>📧 イベントのお知らせをメールで受け取りたい方は市公式LINEを友達追加してください</p>
        <p>🏷️ 参加費・詳細は各イベントページをご確認ください</p>
      </div>
    </div>
  )
}

function ServiceJobs() {
  const jobs = [
    { company: '北山総合病院', title: '看護師（正職員）', type: '正職員', salary: '月給 28〜35万円', location: '北山区', deadline: '4/30' },
    { company: '株式会社まちのテック', title: 'Webデザイナー（パート可）', type: 'パート', salary: '時給 1,300〜1,600円', location: '駅前', deadline: '5/15' },
    { company: '市立保育園（委託）', title: '保育士（パートタイム）', type: 'パート', salary: '時給 1,200円〜', location: '市内各所', deadline: '随時' },
    { company: '有限会社北山農園', title: '農業スタッフ（季節）', type: '季節', salary: '日給 8,000〜10,000円', location: '西山地区', deadline: '4/25' },
    { company: '桜川建設株式会社', title: '土木作業員（経験不問）', type: '正職員', salary: '月給 22〜28万円', location: '緑区', deadline: '5/31' },
    { company: '市シルバー人材センター', title: '軽作業・清掃スタッフ', type: '登録制', salary: '能力給（時間制）', location: '市内全域', deadline: '随時' },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">市内求人情報</h3>
      <div className="job-list">
        {jobs.map((j, i) => <JobCard key={i} {...j} />)}
      </div>
      <div className="svc-note">
        <p>💼 就労相談は産業振興課（内線 312）または市内ハローワークへ</p>
        <p>🎓 職業訓練・資格取得支援制度もご活用ください</p>
      </div>
    </div>
  )
}

function ServiceEducation() {
  const schools = [
    { label: '北山小学校', value: 'TEL 000-000-0000 ／ 児童数 320人' },
    { label: '桜川小学校', value: 'TEL 000-000-0000 ／ 児童数 275人' },
    { label: '北山中学校', value: 'TEL 000-000-0000 ／ 生徒数 480人' },
    { label: '桜川中学校', value: 'TEL 000-000-0000 ／ 生徒数 410人' },
  ]
  const libraries = [
    { label: '中央図書館（市役所隣）', value: '火〜日 9:00〜20:00 ／ 蔵書 12万冊' },
    { label: '北山分館', value: '火〜日 9:00〜18:00 ／ 蔵書 4万冊' },
    { label: '移動図書館（巡回）', value: '月2回 各地区を巡回' },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">市立学校一覧</h3>
      <InfoCard icon="🏫" title="小学校・中学校" items={schools} color="#84cc16" />
      <h3 className="svc-section-title" style={{ marginTop: 24 }}>図書館</h3>
      <InfoCard icon="📚" title="図書館・分館" items={libraries} color="#84cc16" />
      <div className="svc-note">
        <p>📖 電子図書館サービス開始！市民カードがあれば自宅からご利用いただけます</p>
        <p>🎓 生涯学習講座（料理・語学・パソコン等）は文化センターで毎期開催</p>
        <p>📞 教育委員会：内線 234</p>
      </div>
    </div>
  )
}

function ServiceParks() {
  const parks = [
    { icon: '🌸', name: '中央公園', area: '15ha', features: '桜200本・噴水・遊具・バーベキュー広場', hours: '常時開放（バーベキューは要申請）' },
    { icon: '⛰️', name: '北山公園', area: '32ha', features: 'ハイキングコース・展望台・駐車場', hours: '常時開放（日没後は注意）' },
    { icon: '🌿', name: '川沿い緑地', area: '4.2km', features: '桜並木・サイクリングロード・水辺広場', hours: '常時開放' },
    { icon: '⚽', name: '東部運動公園', area: '8ha', features: 'サッカー場・野球場・テニスコート4面', hours: '9:00〜21:00（要予約）' },
    { icon: '🌳', name: '緑区緑地公園', area: '2.5ha', features: '樹木観察路・ベンチ・休憩舎', hours: '常時開放' },
  ]
  return (
    <div className="svc-section">
      <h3 className="svc-section-title">市内の公園・緑地</h3>
      <div className="park-list">
        {parks.map((p, i) => (
          <div key={i} className="park-card">
            <div className="park-head">
              <span className="park-icon">{p.icon}</span>
              <div>
                <p className="park-name">{p.name}</p>
                <p className="park-area">面積 {p.area}</p>
              </div>
            </div>
            <p className="park-features">🏷️ {p.features}</p>
            <p className="park-hours">🕐 {p.hours}</p>
          </div>
        ))}
      </div>
      <div className="svc-note">
        <p>🐻 北山公園周辺でクマの出没情報があります。早朝・夕方の単独行動はご注意ください</p>
        <p>🌸 桜の開花情報は市公式サイト・LINEでリアルタイム配信中</p>
      </div>
    </div>
  )
}

function ServiceContact() {
  const [form, setForm] = useState({ name: '', email: '', dept: '', message: '' })
  const [sent, setSent] = useState(false)
  const depts = [
    { label: '市民課（住民票・戸籍）', tel: '内線 101' },
    { label: '税務課（市民税・固定資産税）', tel: '内線 112' },
    { label: '子ども育成課', tel: '内線 456' },
    { label: '福祉課（介護・障害）', tel: '内線 230' },
    { label: '建設課（道路・公園）', tel: '内線 310' },
    { label: '環境課（ごみ・環境）', tel: '内線 320' },
    { label: '防災課', tel: '内線 215' },
    { label: '産業振興課（観光・農業・就労）', tel: '内線 312' },
  ]

  if (sent) {
    return (
      <div className="svc-section">
        <div className="contact-sent">
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
          <h3>お問い合わせを送信しました</h3>
          <p>担当者より3営業日以内にご連絡いたします。</p>
          <button className="svc-primary-btn" style={{ marginTop: 16 }} onClick={() => setSent(false)}>
            続けて問い合わせる
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="svc-section">
      <h3 className="svc-section-title">担当窓口一覧</h3>
      <div className="dept-grid">
        {depts.map((d, i) => (
          <div key={i} className="dept-card">
            <p className="dept-name">{d.label}</p>
            <p className="dept-tel">📞 {d.tel}</p>
          </div>
        ))}
      </div>
      <p className="dept-main-tel">代表電話：<strong>000-000-0000</strong>（平日 8:30〜17:15）</p>

      <h3 className="svc-section-title" style={{ marginTop: 24 }}>オンラインお問い合わせ</h3>
      <form className="contact-form" onSubmit={e => { e.preventDefault(); setSent(true) }}>
        <div className="contact-row">
          <label>お名前 <span className="required-mark">*</span></label>
          <input type="text" required placeholder="山田 太郎" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="contact-row">
          <label>メールアドレス <span className="required-mark">*</span></label>
          <input type="email" required placeholder="example@mail.com" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="contact-row">
          <label>担当部署</label>
          <select value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}>
            <option value="">選択してください</option>
            {depts.map((d, i) => <option key={i} value={d.label}>{d.label}</option>)}
          </select>
        </div>
        <div className="contact-row">
          <label>お問い合わせ内容 <span className="required-mark">*</span></label>
          <textarea required rows={5} placeholder="お問い合わせ内容をご記入ください" value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
        </div>
        <button type="submit" className="svc-primary-btn">送信する</button>
      </form>
    </div>
  )
}

/* ===== メインコンポーネント ===== */
const CONTENT_MAP = {
  1:  (props) => <ServiceProcedures {...props} />,
  2:  (props) => <ServiceHealth {...props} />,
  3:  (props) => <ServiceChildcare {...props} />,
  4:  (props) => <ServiceDisaster {...props} />,
  5:  (props) => <ServiceFacility {...props} />,
  6:  (props) => <ServiceBus {...props} />,
  7:  (props) => <ServiceGarbage {...props} />,
  8:  (props) => <ServiceEvents {...props} />,
  9:  (props) => <ServiceJobs {...props} />,
  10: (props) => <ServiceEducation {...props} />,
  11: (props) => <ServiceParks {...props} />,
  12: (props) => <ServiceContact {...props} />,
}

export default function ServicePage({ serviceId, onNavigate }) {
  const svc = SERVICES[serviceId]
  if (!svc) return <div className="page"><p>ページが見つかりません。</p></div>

  const ContentComponent = CONTENT_MAP[serviceId]

  return (
    <div className="page svc-page">
      <div className="svc-page-header" style={{ '--svc-color': svc.color }}>
        <button className="svc-back-btn" onClick={() => onNavigate('home')}>
          ← ホームに戻る
        </button>
        <div className="svc-header-body">
          <span className="svc-header-icon">{svc.icon}</span>
          <div>
            <h2 className="svc-header-title">{svc.label}</h2>
            <p className="svc-header-desc">{svc.desc}</p>
          </div>
        </div>
      </div>
      <div className="svc-page-body">
        <ContentComponent onNavigate={onNavigate} />
      </div>
    </div>
  )
}
