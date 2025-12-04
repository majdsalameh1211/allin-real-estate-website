import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "./Map.css";

const officeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36]
});

export default function Map({ locationName }) {
  const [position, setPosition] = useState(null);

  // Geocode the text → coordinates
  useEffect(() => {
    async function geocode() {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    }

    geocode();
  }, [locationName]);

  // Fix map size
  function FixMap() {
    const map = useMap();
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return null;
  }

  // Show loading placeholder
  if (!position) return <div className="contact-map-wrapper">Loading map…</div>;

  return (
    <div className="contact-map-wrapper">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        className="leaflet-map"
      >
        <FixMap />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={position} icon={officeIcon}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
