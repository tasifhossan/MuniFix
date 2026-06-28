"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Next.js Marker Icon Fix
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface Complaint {
  id: string;
  category: string;
  status: string;
  latitude: string | number;
  longitude: string | number;
  description: string;
}

interface MapProps {
  complaints: Complaint[];
  onSelectComplaint: (id: string) => void;
}

export default function DashboardMap({ complaints, onSelectComplaint }: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Center map on Chittagong GEC area
    const map = L.map(containerRef.current).setView([22.3569, 91.8123], 13);
    mapRef.current = map;

    // Add tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync markers when complaints load
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    complaints.forEach(c => {
      if (!c.latitude || !c.longitude) return;
      const lat = parseFloat(c.latitude as string);
      const lon = parseFloat(c.longitude as string);
      if (isNaN(lat) || isNaN(lon)) return;

      let statusColor = "orange";
      if (c.status === "resolved") statusColor = "green";
      else if (c.status === "assigned") statusColor = "blue";
      else if (c.status === "pending") statusColor = "red";

      // HTML custom popup content
      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; max-width: 200px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 850; color: #1e293b;">${c.category}</h4>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${c.description}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="font-size: 8px; font-weight: 850; text-transform: uppercase; color: #fff; background-color: ${statusColor === "green" ? "#059669" : statusColor === "blue" ? "#2563eb" : statusColor === "orange" ? "#d97706" : "#dc2626"}; padding: 2px 6px; border-radius: 4px; white-space: nowrap;">${c.status.replace("_", " ")}</span>
            <button id="btn-${c.id}" style="border: none; background: none; color: #0d9488; font-size: 10px; font-weight: 800; cursor: pointer; padding: 0; white-space: nowrap;">View Details &rarr;</button>
          </div>
        </div>
      `;

      const marker = L.marker([lat, lon]).addTo(map).bindPopup(popupContent);

      // Handle popup view details click
      marker.on("popupopen", () => {
        const button = document.getElementById(`btn-${c.id}`);
        if (button) {
          button.addEventListener("click", () => {
            onSelectComplaint(c.id);
          });
        }
      });

      markersRef.current.push(marker);
    });
  }, [complaints]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[350px] rounded-3xl overflow-hidden shadow-inner border border-gray-150 relative"
      style={{ height: "350px", width: "100%" }}
    />
  );
}
