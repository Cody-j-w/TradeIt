"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Define map container style
const containerStyle = {
  width: "100%",
  height: "500px",
};

// Fallback if no location is available
const defaultCenter = {
  lat: 39.5,
  lng: -98.35,
};

// Trade Spot data type
type TradeSpot = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export default function NearYouPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [tradeSpots, setTradeSpots] = useState<TradeSpot[]>([]);
  const [fallbackZip, setFallbackZip] = useState("74104"); // TODO: Replace with user ZIP from profile

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          await fetchTradeSpots(coords);
        },
        async () => {
          await fallbackToZip();
        }
      );
    };

    const fallbackToZip = async () => {
      const zipRes = await fetch(`/api/zip-center?zip=${fallbackZip}`);
      const zipData = await zipRes.json();
      if (zipData?.location) {
        setUserLocation(zipData.location);
        await fetchTradeSpots(zipData.location);
      }
    };

    const fetchTradeSpots = async (coords: { lat: number; lng: number }) => {
      const res = await fetch("/api/trade-spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      });
      const data = await res.json();
      setTradeSpots(data.tradeSpots);
    };

    getLocation();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trade Spots Near You</h1>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        {/* FRONTEND GOOGLE MAPS API KEY */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}
          zoom={userLocation ? 13 : 5}
        >
          {userLocation && <Marker position={userLocation} label="You" />}
          {tradeSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.latitude, lng: spot.longitude }}
              label={spot.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
