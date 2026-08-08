"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plus, Minus } from "lucide-react";

// Next.js Marker Icon Fix
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface IncidentHotspotsProps {
  complaints?: any[];
}

export default function IncidentHotspots({ complaints = [] }: IncidentHotspotsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    // Create Leaflet Map with no default zoom controls
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([22.3569, 91.8123], 13);

    mapRef.current = map;

    // Light Premium basemap tiles (CartoDB Positron) matching the dashboard light aesthetic
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    setMapLoaded(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update incident markers and hotspots dynamically when complaints change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Remove existing hotspots/circles
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Circle || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Filter active complaints
    const activeComplaints = complaints.filter(
      (c) => c.status !== "resolved" && c.status !== "cancelled"
    );

    // Render circles for active incidents
    activeComplaints.forEach((c) => {
      const lat = parseFloat(c.latitude);
      const lon = parseFloat(c.longitude);
      if (isNaN(lat) || isNaN(lon)) return;

      const isHighSeverity = c.priority === "critical" || c.priority === "high";

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 145px; color: #1e293b;">
          <h4 style="margin: 0 0 4px 0; font-size: 11px; font-weight: 850; color: #0f172a;">${c.category || "Incident"}</h4>
          <p style="margin: 0 0 6px 0; font-size: 9px; color: #64748b; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${c.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
            <span style="font-size: 7px; font-weight: 900; text-transform: uppercase; color: #fff; background-color: ${isHighSeverity ? '#dc2626' : '#d97706'}; padding: 1.5px 5px; border-radius: 3px;">
              ${c.priority || 'Medium'}
            </span>
            <span style="font-size: 7px; font-weight: 900; text-transform: uppercase; color: #475569; background-color: #f1f5f9; padding: 1.5px 5px; border-radius: 3px;">
              ${c.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      `;

      // 1. Draw glowing outer circle/wave
      L.circle([lat, lon], {
        color: isHighSeverity ? "#dc2626" : "#d97706",
        fillColor: isHighSeverity ? "#f87171" : "#fbbf24",
        fillOpacity: 0.08,
        radius: isHighSeverity ? 350 : 200,
        weight: 1,
        dashArray: "4, 4"
      }).addTo(map);

      // 2. Draw core intensity circle
      L.circle([lat, lon], {
        color: isHighSeverity ? "#dc2626" : "#d97706",
        fillColor: isHighSeverity ? "#f87171" : "#fbbf24",
        fillOpacity: 0.3,
        radius: isHighSeverity ? 180 : 100,
        weight: 1.5
      }).addTo(map).bindPopup(popupContent, {
        closeButton: false,
        className: "custom-light-popup"
      });
    });

  }, [complaints, mapLoaded]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm font-sans flex flex-col justify-between flex-1 min-w-[320px]">
      {/* CSS Overrides for Light Popups */}
      <style>{`
        .custom-light-popup .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          color: #1e293b !important;
          border-radius: 12px !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08) !important;
          padding: 2px !important;
        }
        .custom-light-popup .leaflet-popup-tip {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between pb-5 select-none">
        <h3 className="text-base font-extrabold text-slate-855">
          Incident Hotspots
        </h3>
        {/* Map Legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
            <span>Med</span>
          </div>
        </div>
      </div>

      {/* Map visualizer */}
      <div className="w-full h-56 bg-slate-50 rounded-2xl relative overflow-hidden shrink-0 shadow-inner border border-slate-150">
        
        {/* Container for Leaflet Map */}
        <div ref={containerRef} className="w-full h-full z-0" />

        {/* Floating Zoom Controls - Left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 select-none z-[1000] shadow-sm">
          <button 
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 bg-white/95 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 bg-white/95 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-90"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Floating badge bottom right: Live Monitoring Active */}
        <div className="absolute right-4 bottom-4 bg-emerald-50/90 border border-emerald-200 rounded-full px-3 py-1 flex items-center gap-1.5 select-none z-[1000] shadow-sm backdrop-blur-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest leading-none">
            Live Monitoring Active
          </span>
        </div>

      </div>
    </div>
  );
}
