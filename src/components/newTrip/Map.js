import React, { useState, useEffect } from 'react';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import { useDirectionContext } from '../../hooks/useDirectionContext';
import HotelIcon from '@mui/icons-material/Hotel';
import LandscapeIcon from '@mui/icons-material/Landscape';
import MuseumIcon from '@mui/icons-material/Museum';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
const icons = {
  'gas station': <LocalGasStationIcon />,
  'landmark': <LandscapeIcon />,
  'museum': <MuseumIcon />,
  'restaurant': <RestaurantIcon />,
  'theater': <TheaterComedyIcon />,
  'hotel': <HotelIcon />,
};

export default function Map(props) {
  const [userLocation, setUserLocation] = useState(null);
  const { directions, center, setCenter, chosenRoute, stops } = useDirectionContext();
  const [zoom, setZoom] = useState(5);
  const [decodedPath, setDecodedPath] = useState(null);

  function calculateCenter(decoded) {
    let sumLat = 0;
    let sumLng = 0;
    for (const point of decoded) {
      sumLat += point.lat();
      sumLng += point.lng();
    }

    // Calculate the average latitude and longitude
    const avgLat = sumLat / decoded.length;
    const avgLng = sumLng / decoded.length;
    const newCenter = {
      lat: avgLat,
      lng: avgLng,
    };
    setCenter(newCenter);
  }

  const getStopIcon = (marker) => {
    return icons[marker.category];
  };

  const calculateZoom = (decoded) => {
    if (!props.size) {
      return;
    }
    const { width, height } = props.size;
    const WORLD_DIM = { height: height, width: width };
    const ZOOM_MAX = 10; // Maximum zoom level supported by Mapbox

    let maxLat = -Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let minLon = Infinity;

    for (const point of decoded) {
      maxLat = Math.max(maxLat, point.lat());
      minLat = Math.min(minLat, point.lat());
      maxLon = Math.max(maxLon, point.lng());
      minLon = Math.min(minLon, point.lng());
    }

    const latRad1 = (maxLat * Math.PI) / 180;
    const latRad2 = (minLat * Math.PI) / 180;
    const latDiff = latRad1 - latRad2;
    const lonDiff = (maxLon - minLon) * (Math.PI / 180);

    const zoomLat = Math.log(WORLD_DIM.height / (256 * latDiff)) / Math.LN2;
    const zoomLon = Math.log(WORLD_DIM.width / (256 * lonDiff)) / Math.LN2;

    // Choose the smaller of the two zoom levels
    const zoom = Math.min(zoomLat, zoomLon, ZOOM_MAX);
    setZoom(Math.ceil(zoom));
  };

  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (directions) {
      // Calculate the new center based on the directions
      var decoded = /* global google */ google.maps.geometry.encoding.decodePath(
        directions.routes[chosenRoute].overview_polyline.points
      );
      setDecodedPath(decoded);
      calculateCenter(decoded);
      calculateZoom(decoded);
    }
  }, [chosenRoute, directions]);

  return (
    <>
      <GoogleMap
        center={center || userLocation || { lat: 40.43855441888486, lng: -86.91319150336594 }}
        zoom={zoom}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >

        {directions && (
          <Polyline
            path={decodedPath}
            options={{
              strokeColor: 'blue',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}

        {stops &&
          stops[chosenRoute].map((marker, index) => (
            <Marker
              key={index}
              name={marker.name}
              position={marker.location}
              // icon={getStopIcon(marker)}
              label={String(index + 1)} // Use index as the label
            />
          ))}
      </GoogleMap>
    </>
  );
}
