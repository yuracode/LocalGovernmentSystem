import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_COLOR = {
  '受付済': '#3b82f6',
  '確認済': '#f59e0b',
  '対応中': '#f97316',
  '対応完了': '#10b981',
}

function makeIcon(color, emoji) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:36px; height:36px;
        background:${color};
        border:3px solid white;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="transform:rotate(45deg); font-size:15px; line-height:1;">${emoji}</span>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  })
}

const TYPE_EMOJI = {
  flood: '🌊',
  landslide: '⛰️',
  fire: '🔥',
  road: '🚧',
  tree: '🌳',
  wind: '🌀',
  bear: '🐻',
  other: '📋',
}

const TYPE_COLOR = {
  flood: '#3b82f6',
  landslide: '#92400e',
  fire: '#ef4444',
  road: '#f97316',
  tree: '#22c55e',
  wind: '#8b5cf6',
  bear: '#dc2626',
  other: '#6b7280',
}

export default function ReportMap({ reports }) {
  const withCoords = reports.filter(r => r.lat && r.lng)

  const center = withCoords.length > 0
    ? [withCoords[0].lat, withCoords[0].lng]
    : [43.0618, 141.3545]

  return (
    <div className="report-map-wrap">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: 380, borderRadius: 12, border: '1px solid #e5e7eb' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map(r => {
          const emoji = TYPE_EMOJI[r.type] || '📋'
          const color = r.type === 'bear' ? '#dc2626' : (TYPE_COLOR[r.type] || '#6b7280')
          return (
            <Marker
              key={r.id}
              position={[r.lat, r.lng]}
              icon={makeIcon(color, emoji)}
            >
              <Popup maxWidth={260}>
                <div className={`map-popup ${r.type === 'bear' ? 'popup-bear' : ''}`}>
                  <div className="popup-header">
                    <span className="popup-emoji">{emoji}</span>
                    <span className="popup-type">{r.typeLabel}</span>
                    <span
                      className="popup-status"
                      style={{ background: STATUS_COLOR[r.status] + '20', color: STATUS_COLOR[r.status] }}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="popup-location">📍 {r.location}</div>
                  <div className="popup-time">🕐 {r.datetime.replace('T', ' ')}</div>
                  <p className="popup-desc">{r.description}</p>
                  <div className="popup-id">{r.id}</div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      {withCoords.length === 0 && (
        <p className="map-no-location">位置情報が登録された報告がありません</p>
      )}
    </div>
  )
}
