"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: 39.5, lng: -98.35 };

type TradeSpot = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export default function TradeSpotsMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [tradeSpots, setTradeSpots] = useState<TradeSpot[]>([]);
  const [zoom, setZoom] = useState<number>(5);

  const hasFetchedRef = useRef(false); // Prevents re-fetching
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const userZip = "74101"; // Placeholder for fallback

  // Only fetch once per mount
  useEffect(() => {
    if (hasFetchedRef.current) return;

    const loadByGeolocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setZoom(13); // Closer zoom if geolocation works
          await fetchTradeSpots(coords);
        },
        async () => {
          await fallbackToZip();
        }
      );
    };

    const fallbackToZip = async () => {
      const res = await fetch(`/api/zip-center?zip=${userZip}`);
      const data = await res.json();
      const coords = data.location;
      setUserLocation(coords);
      setZoom(10);
      await fetchTradeSpots(coords);
    };

    const fetchTradeSpots = async (coords: { lat: number; lng: number }) => {
      try {
        const res = await fetch("/api/trade-spots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coords),
        });

        const data = await res.json();
        setTradeSpots(Array.isArray(data.tradeSpots) ? data.tradeSpots : []);
      } catch (err) {
        console.error("Failed to fetch trade spots:", err);
        setTradeSpots([]);
      }
    };

    loadByGeolocation();
    hasFetchedRef.current = true;
  }, []);

  if (loadError) return <p className="text-red-600">Error loading Google Maps</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="w-full h-125 mt-[-16.5]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={zoom}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {Array.isArray(tradeSpots) &&
          tradeSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.latitude, lng: spot.longitude }}
              label={spot.name}
            />
          ))}
      </GoogleMap>
    </div>
  );
}
