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

interface MapProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function InteractiveMap({ latitude, longitude, onChange }: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize Map on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const initialLat = latitude || 22.3569;
    const initialLng = longitude || 91.8123;

    // Create Leaflet Map instance attached to our ref container
    const map = L.map(containerRef.current).setView([initialLat, initialLng], 14);
    mapRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Create marker if coordinates exist
    if (latitude && longitude) {
      markerRef.current = L.marker([latitude, longitude]).addTo(map);
    }

    // Handle map clicks
    map.on("click", (e: L.LeafletMouseEvent) => {
      onChange(e.latlng.lat, e.latlng.lng);
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);

  // Update Marker Position and Pan Map when props change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (latitude && longitude) {
      const newPos: L.LatLngExpression = [latitude, longitude];

      if (markerRef.current) {
        markerRef.current.setLatLng(newPos);
      } else {
        markerRef.current = L.marker(newPos).addTo(map);
      }

      // Pan to new coordinate
      map.setView(newPos, map.getZoom());
    } else {
      // Remove marker if coordinates cleared
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [latitude, longitude]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[220px] rounded-3xl overflow-hidden relative shadow-inner border border-gray-150"
      style={{ height: "100%", width: "100%" }}
    />
  );
}
