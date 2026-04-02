import { useState } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import NewsPage from './pages/NewsPage'
import FAQPage from './pages/FAQPage'
import SurveyPage from './pages/SurveyPage'
import AdminPage from './pages/AdminPage'
import DisasterReportPage from './pages/DisasterReportPage'
import ServicePage from './pages/ServicePage'
import './App.css'

const INITIAL_REPORTS = [
  {
    id: 'DR-2026-0044', type: 'bear', typeLabel: '🐻 クマ出没',
    location: '円山公園 西口駐車場付近', datetime: '2026-04-02T06:45',
    description: '早朝に散歩中、体長1m以上のクマ1頭を目撃。北海道神宮方向へ逃げた。子連れではなかった。',
    name: '佐藤 次郎', contact: '090-xxxx-xxxx', status: '対応中', submittedAt: '2026-04-02 07:02',
    lat: 43.0570, lng: 141.3197,
  },
  {
    id: 'DR-2026-0043', type: 'bear', typeLabel: '🐻 クマ出没',
    location: '藻岩山 登山道 旭山記念公園コース入口付近', datetime: '2026-04-01T17:20',
    description: 'ハイキング中に登山道沿いでクマの足跡と糞を発見。近くの樹木に新しいひっかき傷あり。',
    name: '匿名', contact: '', status: '確認済', submittedAt: '2026-04-01 17:40',
    lat: 43.0252, lng: 141.3152,
  },
  {
    id: 'DR-2026-0042', type: 'flood', typeLabel: '🌊 浸水・冠水',
    location: '中央区 大通西4丁目 地下歩行空間出入口付近', datetime: '2026-04-02T08:30',
    description: '出入口付近が冠水しており、通行できない状態です。水深は約20cm程度。除雪水が原因と思われます。',
    name: '田中 一郎', contact: '090-xxxx-xxxx', status: '対応中', submittedAt: '2026-04-02 08:45',
    lat: 43.0607, lng: 141.3510,
  },
  {
    id: 'DR-2026-0041', type: 'road', typeLabel: '🚧 道路損壊・陥没',
    location: '白石区 菊水元町2条 交差点付近', datetime: '2026-04-01T15:10',
    description: '交差点付近の道路が陥没しています。融雪による路盤沈下と思われ、車が通るたびに振動があります。',
    name: '匿名', contact: '', status: '確認済', submittedAt: '2026-04-01 15:22',
    lat: 43.0550, lng: 141.3950,
  },
  {
    id: 'DR-2026-0040', type: 'tree', typeLabel: '🌳 倒木・倒壊',
    location: '大通公園 7丁目付近', datetime: '2026-04-01T07:00',
    description: '昨夜の強風でポプラの大木が倒れ、遊歩道を塞いでいます。',
    name: '鈴木 花子', contact: '080-xxxx-xxxx', status: '対応完了', submittedAt: '2026-04-01 07:15',
    lat: 43.0607, lng: 141.3467,
  },
]

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [serviceId, setServiceId] = useState(null)
  const [disasterReports, setDisasterReports] = useState(INITIAL_REPORTS)

  const [disasterTab, setDisasterTab] = useState('report')

  const navigate = (page, opts = {}) => {
    if (page === 'service') setServiceId(opts.serviceId ?? null)
    if (page === 'disaster') setDisasterTab(opts.tab ?? 'report')
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':     return <HomePage onNavigate={navigate} />
      case 'news':     return <NewsPage disasterReports={disasterReports} onNavigate={navigate} />
      case 'faq':      return <FAQPage />
      case 'survey':   return <SurveyPage />
      case 'admin':    return <AdminPage />
      case 'disaster': return <DisasterReportPage reports={disasterReports} setReports={setDisasterReports} defaultTab={disasterTab} />
      case 'service':  return <ServicePage serviceId={serviceId} onNavigate={navigate} />
      default:         return <HomePage onNavigate={navigate} />
    }
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main className="main-content">{renderPage()}</main>
    </div>
  )
}

export default App
