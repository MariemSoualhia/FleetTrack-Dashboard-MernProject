import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
  Popup,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icône Google-style
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const TripMapModal = ({ startLocation, endLocation }) => {
  const [startCoord, setStartCoord] = useState(null);
  const [endCoord, setEndCoord] = useState(null);
  const [route, setRoute] = useState([]);
  const [info, setInfo] = useState(null);

  const geocode = async (place) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      place
    )}&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "FleetPulseApp/1.0 (your-email@example.com)",
      },
    });

    const data = await response.json();
    if (!data.length) throw new Error("Location not found");
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  };

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const start = await geocode(startLocation);
        const end = await geocode(endLocation);
        setStartCoord(start);
        setEndCoord(end);

        const res = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&alternatives=false&steps=true`
        );

        const coords = res.data.routes[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );

        const distanceKm = (res.data.routes[0].distance / 1000).toFixed(2);
        const durationMin = (res.data.routes[0].duration / 60).toFixed(1);

        setRoute(coords);
        setInfo({ distanceKm, durationMin });
      } catch (err) {
        console.error("Erreur itinéraire OSRM :", err);
      }
    };

    fetchRoute();
  }, [startLocation, endLocation]);

  const bounds = startCoord && endCoord ? [startCoord, endCoord] : null;

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[36.8, 10.1]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <FitBounds bounds={bounds} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {startCoord && (
          <Marker position={startCoord} icon={customIcon}>
            <Popup>
              📍 <b>Départ</b>: {startLocation}
            </Popup>
          </Marker>
        )}

        {endCoord && (
          <Marker position={endCoord} icon={customIcon}>
            <Popup>
              🏁 <b>Arrivée</b>: {endLocation}
            </Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline positions={route} color="blue" weight={5} />
        )}

        {info && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              zIndex: 1000,
            }}
          >
            <p style={{ margin: 0 }}>
              <b>Distance :</b> {info.distanceKm} km
            </p>
            <p style={{ margin: 0 }}>
              <b>Durée :</b> {info.durationMin} min
            </p>
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default TripMapModal;
