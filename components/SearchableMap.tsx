"use client";

import React from "react";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

export default function SearchableMap() {
  const [center, setCenter] = useState({ lat: 39.5, lng: -98.35 });
  const [markers, setMarkers] = useState<any[]>([]);
  const [address, setAddress] = useState("");

  const handleSearch = async () => {
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const geoData = await geoRes.json();

    if (geoData.status === "OK") {
      const location = geoData.results[0].geometry.location;
      setCenter(location);

      // Fetch nearby Trade Spots from backend
      const res = await fetch("/api/trade-spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: location.lat, lng: location.lng }),
      });
      const data = await res.json();
      setMarkers(data.tradeSpots);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search address or city"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
          {markers.map((spot) => (
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
