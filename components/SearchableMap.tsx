"use client";
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type TradeSpot = { id: number; name: string; latitude: number; longitude: number; address?: string };

export default function SearchableMap() {
  const [address, setAddress] = useState("");
  const [center, setCenter] = useState({ lat: 39.5, lng: -98.35 });
  const [markers, setMarkers] = useState<TradeSpot[]>([]);

  const handleSearch = async () => {
    const res = await fetch(`/api/geocode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    const data = await res.json();
    setCenter(data.location);

    const spotsRes = await fetch("/api/trade-spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.location),
    });
    const spotData = await spotsRes.json();
    setMarkers(spotData.tradeSpots);
  };

  return (
    <div>
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Search address" />
      <button onClick={handleSearch}>Search</button>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}> {/* FRONTEND GOOGLE MAPS API KEY */}
        <GoogleMap mapContainerStyle={{ width: "100%", height: "500px" }} center={center} zoom={12}>
          {markers.map((spot) => (
            <Marker key={spot.id} position={{ lat: spot.latitude, lng: spot.longitude }} label={spot.name} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}