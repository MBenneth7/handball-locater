//'mapToken' DEFINED IN 'show.ejs' FILE
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: park.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(park.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h6>${park.name}</h6>`
    )
)
.addTo(map);