import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box, Typography, Chip } from "@mui/material";
import { LocationOn } from "@mui/icons-material";

const CheckinMap = ({ checkins }) => {
  const defaultCenter = [12.87, 77.65];
  
  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ 
          height: "100%", 
          width: "100%",
          borderRadius: '0 0 12px 12px',
        }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {checkins.map((checkin) => (
          <Marker 
            key={checkin.id} 
            position={[checkin.latitude, checkin.longitude]}
          >
            <Popup>
              <Box sx={{ p: 1, minWidth: 200 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Check-in Location
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Student:</strong> {checkin.email}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                  <strong>Coordinates:</strong><br />
                  {checkin.latitude.toFixed(6)}, {checkin.longitude.toFixed(6)}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Time:</strong> {
                    (checkin.timestamp?.toDate?.() || new Date(checkin.timestamp))
                    .toLocaleString()
                  }
                </Typography>
                
                {checkin.imageUri && (
                  <Box
                    component="img"
                    src={checkin.imageUri}
                    alt="Check-in photo"
                    sx={{
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.300',
                    }}
                  />
                )}
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map overlay with stats */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          p: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Map Statistics
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`${checkins.length} Check-ins`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`${new Set(checkins.map(c => c.latitude + c.longitude)).size} Locations`} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CheckinMap;