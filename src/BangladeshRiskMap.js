import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polygon, LayersControl, CircleMarker } from 'react-leaflet';
import { Select, MenuItem, FormControl, InputLabel, Box, Typography, Paper } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icons = {
  highway: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  port: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  airport: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  railway: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

const infrastructureData = {
  "National Highway N1": {
    position: [23.8103, 90.4125],
    type: "highway",
    description: "Critical north-south corridor, high vulnerability to flooding and erosion",
    economicImpact: "Potential 15% reduction in national trade flow if disrupted",
    riskLevel: "high"
  },
  "Chittagong Port": {
    position: [22.3089, 91.8000],
    type: "port",
    description: "Largest seaport in Bangladesh, vulnerable to cyclones and sea-level rise",
    economicImpact: "Handles 90% of the country's trade, severe disruption could impact GDP by 5%",
    riskLevel: "very high"
  },
  "Hazrat Shahjalal International Airport": {
    position: [23.8513, 90.4008],
    type: "airport",
    description: "Main international airport, at risk from urban flooding",
    economicImpact: "Disruption could affect 60% of international passenger traffic",
    riskLevel: "medium"
  },
  "Dhaka-Chittagong Railway": {
    position: [23.6238, 90.5000],
    type: "railway",
    description: "Key rail link between capital and port city, vulnerable to flooding and landslides",
    economicImpact: "Disruption could reduce national freight capacity by 30%",
    riskLevel: "high"
  },
};

const riskZones = {
  highRiskCoastal: [
    [[21.5, 89], [22.5, 89], [22.5, 92], [21.5, 92]]
  ],
  vulnerableRiverCorridors: [
    [[23, 90], [24, 90], [24, 91], [23, 91]]
  ]
};

const historicalEvents = [
  { name: "Cyclone Sidr", year: 2007, position: [22.0000, 90.0000], impact: "Severe damage to coastal infrastructure" },
  { name: "2004 Flood", year: 2004, position: [24.0000, 90.0000], impact: "Major disruption to transport networks" },
];

const riskColors = {
  low: "#66c2a5",
  medium: "#ffd92f",
  high: "#fc8d62",
  "very high": "#e78ac3"
};

const BangladeshRiskMap = () => {
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredInfrastructure = Object.entries(infrastructureData).filter(([_, data]) => 
    filter === 'all' || data.type === filter || data.riskLevel === filter
  );

  return (
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
        <Typography variant="h4">Bangladesh Transport Infrastructure Risk Map</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Filter">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="highway">Highways</MenuItem>
            <MenuItem value="port">Ports</MenuItem>
            <MenuItem value="airport">Airports</MenuItem>
            <MenuItem value="railway">Railways</MenuItem>
            <MenuItem value="low">Low Risk</MenuItem>
            <MenuItem value="medium">Medium Risk</MenuItem>
            <MenuItem value="high">High Risk</MenuItem>
            <MenuItem value="very high">Very High Risk</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <MapContainer center={[23.6850, 90.3563]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ZoomControl position="bottomright" />
          
          <LayersControl position="topright">
            <LayersControl.Overlay checked name="High Risk Coastal Areas">
              <Polygon positions={riskZones.highRiskCoastal} color="red" />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Vulnerable River Corridors">
              <Polygon positions={riskZones.vulnerableRiverCorridors} color="orange" />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Critical Infrastructure">
              {filteredInfrastructure.map(([name, data]) => (
                <Marker 
                  key={name} 
                  position={data.position}
                  icon={icons[data.type]}
                  eventHandlers={{
                    click: () => setSelectedInfrastructure(name),
                  }}
                >
                  <Popup>
                    <strong>{name}</strong><br />
                    Type: {data.type}<br />
                    Risk Level: {data.riskLevel}
                  </Popup>
                </Marker>
              ))}
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Historical Events">
              {historicalEvents.map((event, index) => (
                <CircleMarker 
                  key={index}
                  center={event.position} 
                  radius={10}
                  color="purple"
                  fillColor="purple"
                  fillOpacity={0.5}
                >
                  <Popup>
                    <strong>{event.name} ({event.year})</strong><br />
                    Impact: {event.impact}
                  </Popup>
                </CircleMarker>
              ))}
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </Box>
      {selectedInfrastructure && (
        <Paper sx={{ position: 'absolute', bottom: 20, left: 20, p: 2, maxWidth: 300, zIndex: 1000 }}>
          <Typography variant="h6">{selectedInfrastructure}</Typography>
          <Typography>Type: {infrastructureData[selectedInfrastructure].type}</Typography>
          <Typography>Risk Level: {infrastructureData[selectedInfrastructure].riskLevel}</Typography>
          <Typography>{infrastructureData[selectedInfrastructure].description}</Typography>
          <Typography><strong>Economic Impact:</strong> {infrastructureData[selectedInfrastructure].economicImpact}</Typography>
          <button onClick={() => setSelectedInfrastructure(null)}>Close</button>
        </Paper>
      )}
      <Paper sx={{ position: 'absolute', top: 80, right: 10, p: 1, zIndex: 1000 }}>
        <Typography variant="h6">Legend</Typography>
        {Object.entries(riskColors).map(([level, color]) => (
          <Box key={level} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: color, mr: 1 }} />
            <Typography>{level.charAt(0).toUpperCase() + level.slice(1)} Risk</Typography>
          </Box>
        ))}
        {Object.entries(icons).map(([type, icon]) => (
          <Box key={type} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <img src={icon.options.iconUrl} alt={type} style={{ width: 20, height: 20, marginRight: 8 }} />
            <Typography>{type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'purple', mr: 1 }} />
          <Typography>Historical Event</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default BangladeshRiskMap;
