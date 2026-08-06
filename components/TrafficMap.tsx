"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Roadblock } from "@/lib/api";

// Next.js Marker Icon Fix
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

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
  roadblocks?: Roadblock[];
  selectedRoadblock?: Roadblock | null;
  origin?: [number, number] | null;
  destination?: [number, number] | null;
  blockedPath?: [number, number][] | null;
  bypassPath?: [number, number][] | null;
  onSetOrigin?: (coords: [number, number]) => void;
  onSetDestination?: (coords: [number, number]) => void;
  onSelectRoadblock?: (rb: Roadblock) => void;
  isAddingRoadblock?: boolean;
  newRoadblockCoords?: [number, number] | null;
  onSetNewRoadblockCoords?: (coords: [number, number]) => void;
  activeScenario?: Scenario;
}

export default function TrafficMap({
  roadblocks = [],
  selectedRoadblock = null,
  origin = null,
  destination = null,
  blockedPath = null,
  bypassPath = null,
  onSetOrigin = () => {},
  onSetDestination = () => {},
  onSelectRoadblock = () => {},
  isAddingRoadblock = false,
  newRoadblockCoords = null,
  onSetNewRoadblockCoords = () => {},
  activeScenario,
}: TrafficMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const roadblocksGroupRef = useRef<L.LayerGroup | null>(null);
  const routeGroupRef = useRef<L.LayerGroup | null>(null);
  const clickModeRef = useRef<"origin" | "destination" | "roadblock" | null>(null);

  // Keep references to handlers to avoid stale closures in Leaflet events
  const onSetOriginRef = useRef(onSetOrigin);
  const onSetDestinationRef = useRef(onSetDestination);
  const onSetNewRoadblockCoordsRef = useRef(onSetNewRoadblockCoords);

  useEffect(() => {
    onSetOriginRef.current = onSetOrigin;
    onSetDestinationRef.current = onSetDestination;
    onSetNewRoadblockCoordsRef.current = onSetNewRoadblockCoords;
  }, [onSetOrigin, onSetDestination, onSetNewRoadblockCoords]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Center map on Chittagong GEC area
    const map = L.map(containerRef.current).setView([22.3569, 91.8123], 13);
    mapRef.current = map;

    // Add tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Create groups for layers
    roadblocksGroupRef.current = L.layerGroup().addTo(map);
    routeGroupRef.current = L.layerGroup().addTo(map);

    // Map click handler for custom pins
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (clickModeRef.current === "origin") {
        onSetOriginRef.current([lat, lng]);
        clickModeRef.current = null;
        // Reset button UI
        const btn = document.getElementById("click-origin-btn");
        if (btn) btn.classList.remove("bg-brand-teal", "text-white");
      } else if (clickModeRef.current === "destination") {
        onSetDestinationRef.current([lat, lng]);
        clickModeRef.current = null;
        // Reset button UI
        const btn = document.getElementById("click-destination-btn");
        if (btn) btn.classList.remove("bg-brand-teal", "text-white");
      } else if (clickModeRef.current === "roadblock") {
        onSetNewRoadblockCoordsRef.current?.([lat, lng]);
        clickModeRef.current = null;
        // Reset button UI
        const btn = document.getElementById("click-roadblock-btn");
        if (btn) btn.classList.remove("bg-red-600", "text-white");
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Draw activeScenario if provided (old routing mockup page support)
  useEffect(() => {
    const map = mapRef.current;
    const group = routeGroupRef.current;
    if (!map || !group || !activeScenario) return;

    group.clearLayers();

    // Red (Blocked) Route
    const redPolyline = L.polyline(activeScenario.redRoute, {
      color: "#ef4444",
      weight: 6,
      opacity: 0.85,
      dashArray: "5, 10"
    }).addTo(group);

    // Green (Bypass) Route
    const greenPolyline = L.polyline(activeScenario.greenRoute, {
      color: "#10b981",
      weight: 6,
      opacity: 0.95
    }).addTo(group);

    // Custom Marker Icons
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

    L.marker([activeScenario.startLat, activeScenario.startLng], { icon: startIcon })
      .addTo(group)
      .bindPopup(`<div style="font-family: sans-serif; font-size: 11px; font-weight: bold;">Start Point</div>`);

    L.marker([activeScenario.endLat, activeScenario.endLng], { icon: endIcon })
      .addTo(group)
      .bindPopup(`<div style="font-family: sans-serif; font-size: 11px; font-weight: bold;">Destination</div>`);

    L.marker([activeScenario.blockLat, activeScenario.blockLng], { icon: blockIcon })
      .addTo(group)
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; max-width: 180px;">
          <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #dc2626;">Road Blocked</h4>
          <p style="margin: 0; font-size: 10px; color: #475569; line-height: 1.3;">${activeScenario.blockReason}</p>
        </div>
      `);

    const boundsGroup = L.featureGroup([redPolyline, greenPolyline]);
    map.fitBounds(boundsGroup.getBounds().pad(0.15));

  }, [activeScenario]);

  // Update roadblock circles & markers
  useEffect(() => {
    const map = mapRef.current;
    const group = roadblocksGroupRef.current;
    if (!map || !group || activeScenario) return;

    group.clearLayers();

    roadblocks.forEach(rb => {
      const lat = parseFloat(rb.latitude);
      const lon = parseFloat(rb.longitude);
      if (isNaN(lat) || isNaN(lon)) return;

      const isSelected = selectedRoadblock?.id === rb.id;

      // Draw red circle overlay showing affected radius
      const circle = L.circle([lat, lon], {
        radius: rb.affected_radius_meters || 300,
        color: isSelected ? "#ef4444" : "#f87171",
        fillColor: isSelected ? "#f87171" : "#fca5a5",
        fillOpacity: isSelected ? 0.35 : 0.2,
        weight: isSelected ? 2.5 : 1.5,
      }).addTo(group);

      // Create a warning icon for roadblocks
      const warningIcon = L.divIcon({
        className: 'custom-roadblock-icon',
        html: `<div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md transition-all duration-300 ${isSelected ? 'bg-red-600 scale-110' : 'bg-red-500 hover:scale-105'}" style="color: white; font-weight: bold; font-size: 14px;">⚠️</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lon], { icon: warningIcon }).addTo(group);

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 850; color: #dc2626;">${rb.title}</h4>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569; line-height: 1.4;">${rb.description}</p>
          <div style="display: flex; gap: 6px; font-size: 10px; font-weight: 700; margin-bottom: 8px;">
            <span style="background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${rb.cause}</span>
            <span style="background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px;">Radius: ${rb.affected_radius_meters}m</span>
          </div>
          <button id="pop-select-${rb.id}" style="width: 100%; border: none; background: #0d9488; color: white; padding: 5px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer;">Select Roadblock</button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("popupopen", () => {
        const btn = document.getElementById(`pop-select-${rb.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            onSelectRoadblock(rb);
            marker.closePopup();
          });
        }
      });

      if (isSelected) {
        // Pan map to selected roadblock
        map.setView([lat, lon], 14);
      }
    });
  }, [roadblocks, selectedRoadblock]);

  // Update paths (blocked path and bypass detour path)
  useEffect(() => {
    const map = mapRef.current;
    const group = routeGroupRef.current;
    if (!map || !group || activeScenario) return;

    group.clearLayers();

    // 1. Draw blocked path (Red dashed line)
    if (blockedPath && blockedPath.length > 0) {
      L.polyline(blockedPath, {
        color: "#dc2626",
        weight: 4,
        dashArray: "8, 8",
        opacity: 0.8,
      }).addTo(group);
    }

    // 2. Draw bypass path (Teal thick line)
    if (bypassPath && bypassPath.length > 0) {
      L.polyline(bypassPath, {
        color: "#0d9488",
        weight: 5.5,
        opacity: 0.9,
      }).addTo(group);

      // Fit bounds to show the entire route
      const allCoords = [...(blockedPath || []), ...bypassPath];
      if (allCoords.length > 0) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] });
      }
    }

    // 3. Draw Origin Pin (Green pin)
    if (origin) {
      const originIcon = L.divIcon({
        className: 'custom-route-icon',
        html: `<div class="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-md text-white font-black text-xxs">A</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker(origin, { icon: originIcon }).addTo(group).bindPopup("<b>Origin Location</b>");
    }

    // 4. Draw Destination Pin (Blue pin)
    if (destination) {
      const destIcon = L.divIcon({
        className: 'custom-route-icon',
        html: `<div class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 border-2 border-white shadow-md text-white font-black text-xxs">B</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker(destination, { icon: destIcon }).addTo(group).bindPopup("<b>Target Destination</b>");
    }

    // 5. Draw Temporary New Roadblock Pin
    if (newRoadblockCoords) {
      const tempIcon = L.divIcon({
        className: 'custom-temp-rb-icon',
        html: `<div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-red-500 bg-red-100 animate-pulse text-red-600 font-bold text-sm">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker(newRoadblockCoords, { icon: tempIcon }).addTo(group).bindPopup("<b>New Roadblock Location</b>");
    }
  }, [blockedPath, bypassPath, origin, destination, newRoadblockCoords]);

  const handleToggleClickMode = (mode: "origin" | "destination" | "roadblock") => {
    clickModeRef.current = clickModeRef.current === mode ? null : mode;

    const originBtn = document.getElementById("click-origin-btn");
    const destBtn = document.getElementById("click-destination-btn");
    const rbBtn = document.getElementById("click-roadblock-btn");

    if (originBtn) {
      if (clickModeRef.current === "origin") {
        originBtn.classList.add("bg-brand-teal", "text-white");
      } else {
        originBtn.classList.remove("bg-brand-teal", "text-white");
      }
    }

    if (destBtn) {
      if (clickModeRef.current === "destination") {
        destBtn.classList.add("bg-brand-teal", "text-white");
      } else {
        destBtn.classList.remove("bg-brand-teal", "text-white");
      }
    }

    if (rbBtn) {
      if (clickModeRef.current === "roadblock") {
        rbBtn.classList.add("bg-red-600", "text-white");
      } else {
        rbBtn.classList.remove("bg-red-600", "text-white");
      }
    }
  };

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full min-h-[450px]" />
      
      {/* Map helper overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-gray-150 shadow-lg flex flex-col gap-2 max-w-xs">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pin Selector</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              id="click-origin-btn"
              onClick={() => handleToggleClickMode("origin")}
              className="flex-1 px-3 py-1.5 border border-gray-200 hover:bg-slate-50 text-gray-700 rounded-xl text-xxs font-bold transition-all shadow-sm cursor-pointer select-none"
            >
              📍 Set Origin
            </button>
            <button
              id="click-destination-btn"
              onClick={() => handleToggleClickMode("destination")}
              className="flex-1 px-3 py-1.5 border border-gray-200 hover:bg-slate-50 text-gray-700 rounded-xl text-xxs font-bold transition-all shadow-sm cursor-pointer select-none"
            >
              🏁 Set Dest
            </button>
          </div>
          {isAddingRoadblock && (
            <button
              id="click-roadblock-btn"
              onClick={() => handleToggleClickMode("roadblock")}
              className="w-full px-3 py-1.5 border border-dashed border-red-300 hover:bg-red-50 text-red-650 rounded-xl text-xxs font-bold transition-all shadow-2xs cursor-pointer select-none mt-1"
            >
              ⚠️ Click Map for Roadblock
            </button>
          )}
        </div>
        <p className="text-[9px] text-gray-400 font-semibold leading-normal">
          Click a button then click anywhere on the map to drop the marker. Or double click near roadblocks to test detours.
        </p>
      </div>
    </div>
  );
}
