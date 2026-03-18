//SETTING UP

//npm i react-leaflet @types/leaflet leaflet
//create component and add it to tripdetailpage
//import leaftlet css for map to render correctly in main.tsx or map.tsx
//create a div to surround the <MapContainer /> with tailwindcss styling height/width/positioning
//use tilelayer for choosing the type of map we want rendered
//create mock file with locations from string (location input in the activity form) to position[lat,long]

//CREATING PINPOINTS

//IN PARENT COMPONENT: TRIP DETAILS PAGE
//create a state array to store all markers [markers, setMarkers] = useState([]);
//create an addPlace function to add new markers by their location (prev => ...prev, [lat, long]) from match(string->position) in the mock file
//pass state as props markers={markers} to map(child) component

//IN MAP COMPONENT
//add markers to props from parent component
//map over markers array to display them in the map
//we can customize the marker icon with Icon and pass it as a prop <Marker icon={styledIcon}/>

//IN ACTIVITY FORM
//call addPlace function (passed as prop from the parent TripDetailsPage) on submit

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
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
    
    useEffect(() => {
        const fetchMarkers = async () => {
            const newMarkers: Record<number, Coordinates> = {};
            for (const activity of activities) {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${activity.location}&format=json&limit=1`
                );
                const data = await res.json();
                
            if (data.length > 0) {
              newMarkers[Number(activity.id)] = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }
        setMarkers(newMarkers);
    };
  };

  fetchMarkers();
  }, [activities]);
  
  return (
  <MapContainer
  center={[48.8566, 2.3522]}
  zoom={12}
  style={{ height: "200px", width: "50%" }}
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
