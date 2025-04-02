"use client";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };
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

  const userZip = "74101"; // Replace with actual ZIP from user context/database

  useEffect(() => {
    const loadByGeolocation = () => {
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
      const res = await fetch(`/api/zip-center?zip=${userZip}`);
      const data = await res.json();
      const coords = data.location;
      setUserLocation(coords);
      await fetchTradeSpots(coords);
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

    loadByGeolocation();
  }, []);

  return (
    <div className="w-full h-full">
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