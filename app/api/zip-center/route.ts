import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { zip } = req.query;

  if (!zip || typeof zip !== "string") {
    return res.status(400).json({ error: "Missing ZIP code" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status !== "OK") {
      return res.status(400).json({ error: "Failed to geocode ZIP" });
    }

    const location = data.results[0].geometry.location;
    res.status(200).json({ location });
  } catch (error) {
    console.error("ZIP geocoding error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}