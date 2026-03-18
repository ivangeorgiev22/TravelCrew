//we can customize the marker icon with Icon and pass it as a prop <Marker icon={styledIcon}/>

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import type { ActivityData } from "../types/activityData";

interface Props {
  activities: ActivityData[];
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function Map({ activities }: Props) {
  const [markers, setMarkers] = useState<Record<number, Coordinates>>({});
  // current cache in localStorage
  const cache = useRef<Record<string, Coordinates>>(
    JSON.parse(localStorage.getItem("placesCache") || "{}"),
  );

  useEffect(() => {
    const fetchMarkers = async () => {
      const newMarkers: Record<number, Coordinates> = {};
      await Promise.all(
        activities.map(async (activity) => {
          // check if location is already in cache
          const location = activity.location;

          if (!cache.current[location]) {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`,
            );
            const data = await res.json();
            console.log("api data", data);

            if (data.length > 0) {
              cache.current[location] = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
              };
            }
          }
        }),
      );

      // update localStorage cache
      localStorage.setItem("placesCache", JSON.stringify(cache.current));
      console.log("cache updated", cache.current);

      activities.forEach((activity) => {
        const coords = cache.current[activity.location];
        if (coords) {
          newMarkers[Number(activity.id)] = coords;
        }
      });
      setMarkers(newMarkers);
    };

    if (activities.length > 0) {
      fetchMarkers();
    }
  }, [activities]);

  // You can use L.LatLngBounds and use the built in getCenter() function
  //var bounds = L.LatLngBounds([60.22352998843195,24.94705001539827],[60.13500641212243,24.66432372755647]);
  //var center = bounds.getCenter();


  return (
    <MapContainer
      center={[60.0000,15.0000]}
      zoom={4}
      style={{ height: "200px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {activities.map((activity) => {
        const coord = markers[Number(activity.id)];
        if (!coord) return null;

        return (
          <Marker key={activity.id} position={[coord.lat, coord.lng]}>
            <Popup>
              <strong>{activity.name}</strong>
              <br />
              {activity.location}
              <br />
              {activity.time}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
