import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import type { ActivityData } from "../types/activityData";
import { redIcon } from "@vectorial1024/leaflet-color-markers";

interface Props {
  activities: ActivityData[];
  city: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

// Component to change the map view when city coordinates are updated
// because MapContainer doesn't automatically update its center after initial render
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 12);
  return null;
}

export default function Map({ activities, city }: Props) {
  const [markers, setMarkers] = useState<Record<number, Coordinates>>({});
  const [cityCoords, setCityCoords] = useState<Coordinates | null>(null);

  const cache = useRef<Record<string, Coordinates>>(
    JSON.parse(localStorage.getItem("placesCache") || "{}"),
  );

  useEffect(() => {
    const fetchCity = async () => {
      if (cache.current[city]) {
        setCityCoords(cache.current[city]);
        return;
      }
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      );
      const data = await res.json();

      if (data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        cache.current[city] = coords;
        localStorage.setItem("placesCache", JSON.stringify(cache.current));
        setCityCoords(coords);
      }
    };

    if (city) fetchCity();
  }, [city]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const newMarkers: Record<number, Coordinates> = {};
      await Promise.all(
        activities.map(async (activity) => {
          const location = activity.location;
          if (!cache.current[location]) {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`,
            );
            const data = await res.json();
            if (data.length > 0) {
              cache.current[location] = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
              };
            }
          }
        }),
      );

      localStorage.setItem("placesCache", JSON.stringify(cache.current));

      activities.forEach((activity) => {
        const coords = cache.current[activity.location];
        if (coords) {
          newMarkers[Number(activity.id)] = coords;
        }
      });
      setMarkers(newMarkers);
    };

    if (activities.length > 0) fetchMarkers();
  }, [activities]);

  const center: [number, number] = [cityCoords?.lat ?? 0, cityCoords?.lng ?? 0];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "350px", width: "600px" }}
      className="rounded-xl"
    >
      {cityCoords && <ChangeView center={center} />}
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {activities.map((activity) => {
        const coord = markers[Number(activity.id)];
        if (!coord) return null;
        return (
          <Marker
            key={activity.id}
            icon={redIcon}
            position={[coord.lat, coord.lng]}
          >
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
