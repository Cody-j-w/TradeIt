"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "calc(95vh - 120px)", // Adjust based on layout
};

const defaultCenter = { lat: 39.5, lng: -98.35 };

type TradeSpot = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  verified: boolean;
};

export default function TradeSpotsMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [tradeSpots, setTradeSpots] = useState<TradeSpot[]>([]);
  const [zoom, setZoom] = useState(5);
  const [selectedSpot, setSelectedSpot] = useState<TradeSpot | null>(null);

  const hasFetchedRef = useRef(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // FRONTEND API KEY
  });

  const userZip = "74101"; // fallback ZIP

  useEffect(() => {
    if (hasFetchedRef.current) return;

    const fetchByLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setZoom(13);
          await fetchTradeSpots(coords);
        },
        async () => {
          const res = await fetch(`/api/zip-center?zip=${userZip}`);
          const data = await res.json();
          setUserLocation(data.location);
          setZoom(10);
          await fetchTradeSpots(data.location);
        }
      );
    };

    const fetchTradeSpots = async (coords: { lat: number; lng: number }) => {
      const res = await fetch("/api/trade-spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      });

      const data = await res.json();
      if (Array.isArray(data.tradeSpots)) {
        setTradeSpots(data.tradeSpots);
      } else {
        console.error("Invalid response:", data);
      }
    };

    fetchByLocation();
    hasFetchedRef.current = true;
  }, []);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="mt-[-10px]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={zoom}
        onClick={() => setSelectedSpot(null)} // Close InfoWindow when clicking off
      >
        {/* User Marker */}
        {userLocation && <Marker position={userLocation} label="You" />}

        {/* Trade Spot Markers */}
        {tradeSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={{ lat: spot.latitude, lng: spot.longitude }}
            onClick={() => setSelectedSpot(spot)}
          />
        ))}

        {/* InfoWindow */}
        {selectedSpot && (
          <InfoWindow
            position={{ lat: selectedSpot.latitude, lng: selectedSpot.longitude }}
            onCloseClick={() => setSelectedSpot(null)}
          >
            <div className="p-2 max-w-xs">
              <h2 className="font-bold text-sm">{selectedSpot.name}</h2>
              <p className="text-xs text-gray-600 mb-2">{selectedSpot.address}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.latitude},${selectedSpot.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-xs"
              >
                Navigate in Google Maps
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
