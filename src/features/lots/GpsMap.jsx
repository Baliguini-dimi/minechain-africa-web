import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function GpsMap({ positions }) {
  if (!positions || positions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-surface border border-border rounded-lg">
        <p className="font-body text-sm text-text-secondary">
          Aucune position GPS enregistrée pour ce lot.
        </p>
      </div>
    )
  }

  const coordinates = positions.map((p) => [parseFloat(p.lat), parseFloat(p.lng)])
  const lastPosition = coordinates[coordinates.length - 1]

  return (
    <div className="h-64 rounded-lg overflow-hidden border border-border">
      <MapContainer center={lastPosition} zoom={9} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Polyline positions={coordinates} color="#2E5C8A" />
        <Marker position={lastPosition} icon={defaultIcon}>
          <Popup>Dernière position connue</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}