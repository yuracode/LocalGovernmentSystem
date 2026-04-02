import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Leaflet のデフォルトアイコンパス修正
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function RecenterMap({ lat, lng }) {
  const map = useMapEvents({})
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

export default function MapPicker({ lat, lng, onPick }) {
  const center = lat && lng ? [lat, lng] : [43.0618, 141.3545]

  return (
    <div className="map-picker-wrap">
      <p className="map-picker-hint">地図上をクリックして発生場所を指定してください</p>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: 280, borderRadius: 10, border: '1.5px solid #d1d5db' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onPick} />
        {lat && lng && (
          <>
            <RecenterMap lat={lat} lng={lng} />
            <Marker position={[lat, lng]}>
              <Popup>📍 選択した場所</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
      {lat && lng && (
        <p className="map-coords">
          緯度 {lat.toFixed(5)} / 経度 {lng.toFixed(5)}
        </p>
      )}
    </div>
  )
}
