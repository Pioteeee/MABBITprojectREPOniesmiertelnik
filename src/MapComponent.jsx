import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({}); // przechowuje markery po tag_id

  // --- 1. Inicjalizacja mapy ---
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [21.012, 52.23], // Warszawa
      zoom: 13
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapInstanceRef.current = map;

    return () => map.remove();
  }, []);

  // --- 2. WebSocket: odbieranie pozycji i aktualizacja markerów ---
  useEffect(() => {
    const ws = new WebSocket("wss://niesmiertelnik.replit.app/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type !== "tag_telemetry") return;

      const tagId = data.tag_id;
      const pos = data.position;

      if (!pos) return;

      // 🔥 sztuczne przeliczenie lokalnych x/y → GPS
      const baseLng = 21.012;
      const baseLat = 52.23;

      const lng = baseLng + pos.x * 0.00001;
      const lat = baseLat + pos.y * 0.00001;

      // Jeżeli marker nie istnieje — tworzymy nowy
      if (!markersRef.current[tagId]) {
        const el = document.createElement("div");
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/68/68974.png')";
        el.style.backgroundSize = "contain";
        el.style.cursor = "pointer";

        const marker = new maplibregl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup().setHTML(`
              <strong>${data.firefighter?.name || tagId}</strong><br>
              Bateria: ${data.device?.battery_percent}%<br>
              SCBA: ${data.scba?.cylinder_pressure_bar.toFixed(1)} bar
            `)
          )
          .addTo(mapInstanceRef.current);

        markersRef.current[tagId] = marker;

      } else {
        // 🔄 istniejący marker – aktualizujemy pozycję
        markersRef.current[tagId].setLngLat([lng, lat]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%", minHeight: "400px" }}
    />
  );
};

export default MapComponent;
