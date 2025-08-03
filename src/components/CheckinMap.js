import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const CheckinMap = ({ checkins }) => (
  <MapContainer center={[12.87, 77.65]} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "12px" }}>
    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {checkins.map((c) => (
      <Marker key={c.id} position={[c.latitude, c.longitude]}>
        <Popup>
          <strong>{c.email}</strong><br/>
          {c.latitude}, {c.longitude}
        </Popup>
      </Marker>
    ))}
  </MapContainer>
);

export default CheckinMap;
