"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Scenario {
  id: string;
  name: string;
  blockLat: number;
  blockLng: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  redRoute: [number, number][];
  greenRoute: [number, number][];
  description: string;
  blockReason: string;
}

interface TrafficMapProps {
  activeScenario: Scenario;
}

export default function TrafficMap({ activeScenario }: TrafficMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const redPolylineRef = useRef<L.Polyline | null>(null);
  const greenPolylineRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map centering on Chittagong GEC area
    const map = L.map(containerRef.current).setView([22.3592, 91.8152], 14);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update route drawing when activeScenario changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Clear existing polylines
    if (redPolylineRef.current) {
      redPolylineRef.current.remove();
      redPolylineRef.current = null;
    }
    if (greenPolylineRef.current) {
      greenPolylineRef.current.remove();
      greenPolylineRef.current = null;
    }

    // 2. Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // 3. Draw routes
    // Red (Blocked) Route
    redPolylineRef.current = L.polyline(activeScenario.redRoute, {
      color: "#ef4444", // red-500
      weight: 6,
      opacity: 0.85,
      dashArray: "5, 10" // dashed to represent blockage
    }).addTo(map);

    // Green (Bypass) Route
    greenPolylineRef.current = L.polyline(activeScenario.greenRoute, {
      color: "#10b981", // emerald-500
      weight: 6,
      opacity: 0.95
    }).addTo(map);

    // 4. Custom Marker Icons
    const startIcon = L.divIcon({
      html: '<div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 7px; font-weight: 900;">S</span></div>',
      className: "custom-start-marker",
      iconSize: [16, 16],
    });

    const endIcon = L.divIcon({
      html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 7px; font-weight: 900;">D</span></div>',
      className: "custom-end-marker",
      iconSize: [16, 16],
    });

    const blockIcon = L.divIcon({
      html: '<div style="background-color: #ef4444; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.3); animation: pulse 2s infinite;"><span style="color: white; font-size: 11px; font-weight: 900;">⚠</span></div>',
      className: "custom-block-marker",
      iconSize: [26, 26],
    });

    // 5. Add markers to map
    const startMarker = L.marker([activeScenario.startLat, activeScenario.startLng], { icon: startIcon })
      .addTo(map)
      .bindPopup(`<div style="font-family: sans-serif; font-size: 11px; font-weight: bold;">Start Point</div>`);

    const endMarker = L.marker([activeScenario.endLat, activeScenario.endLng], { icon: endIcon })
      .addTo(map)
      .bindPopup(`<div style="font-family: sans-serif; font-size: 11px; font-weight: bold;">Destination</div>`);

    const blockMarker = L.marker([activeScenario.blockLat, activeScenario.blockLng], { icon: blockIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; max-width: 180px;">
          <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #dc2626;">Road Blocked</h4>
          <p style="margin: 0; font-size: 10px; color: #475569; line-height: 1.3;">${activeScenario.blockReason}</p>
        </div>
      `);

    markersRef.current.push(startMarker, endMarker, blockMarker);

    // Zoom map view to fit the route bounds
    const group = L.featureGroup([redPolylineRef.current, greenPolylineRef.current]);
    map.fitBounds(group.getBounds().pad(0.15));

  }, [activeScenario]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[450px] rounded-3xl overflow-hidden shadow-inner border border-gray-150 relative"
      style={{ height: "450px", width: "100%" }}
    />
  );
}
