"use client";

import React from "react";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 39.5, // Approx center of US
  lng: -98.35,
};

type TradeSpot = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
};

export default function TradeSpotsMap() {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [tradeSpots, setTradeSpots] = useState<TradeSpot[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);

        // Send to backend to get nearby Trade Spots
        const res = await fetch("/api/trade-spots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coords),
        });

        const data = await res.json();
        setTradeSpots(data.tradeSpots);
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={userLocation ? 13 : 5}
      >
        {userLocation && <Marker position={userLocation} />}
        {tradeSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={{ lat: spot.latitude, lng: spot.longitude }}
            label={spot.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
