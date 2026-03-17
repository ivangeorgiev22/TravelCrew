//SETTING UP

//npm i react-leafleat @types/leaflet leaflet
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
