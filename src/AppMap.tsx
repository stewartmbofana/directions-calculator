import ClearIcon from '@mui/icons-material/Clear';
import { Typography, Container, Box, Button, ButtonGroup, IconButton, Input, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';

const center = { lat: -26.222444, lng: 28.028203 }

export function AppMap() {
  const [map, setMap] = useState<google.maps.Map>();
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult>();
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [originInput, setOriginInput] = useState<google.maps.places.Autocomplete>();
  const [destinationInput, setDestinationInput] = useState<google.maps.places.Autocomplete>();

  const onOriginLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log('autocomplete: ', autocomplete);

    setOriginInput(autocomplete);
  };

  const onOriginPlaceChanged = () => {
    if (originInput !== undefined) {
      const place = originInput.getPlace();
      if (place && place.formatted_address) {
        setOrigin(place.formatted_address);
        originInput.set('place', '')
      }
      console.log(origin);
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };
  const onDestLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log('autocomplete: ', autocomplete);

    setDestinationInput(autocomplete);
  };

  const onDestPlaceChanged = () => {
    if (destinationInput !== undefined) {
      const place = destinationInput.getPlace();
      if (place && place.formatted_address) {
        setDestination(place.formatted_address);
        destinationInput.set('place', '')
      }
      console.log(destination);

    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const originRef = useRef();
  const destinationRef = useRef();

  const calculateRoute = async () => {
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    if (results && results.routes && results.routes[0].legs
      && results.routes[0].legs[0].distance?.text
      && results.routes[0].legs[0].duration?.text) {
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    }

    setDirectionsResponse(results);
  };

  const clearRoute = () => {
    setDirectionsResponse(undefined);
    setDistance('');
    setDuration('');
    setOrigin('');
    setDestination('');

    originRef.current = undefined;
    destinationRef.current = undefined;
  };


  return (
    <Box height="100vh" display="flex" flexDirection="column">

      <Box flex={1} overflow="auto">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Container>
            <Box
              sx={{
                bgcolor: 'white',
                opacity: 0.8,
                boxShadow: 1,
                borderRadius: 2,
                p: 2,
                minWidth: 300,
                maxWidth: 800
              }}

            >
              <Stack direction="row" justifyContent="space-between">
                <Box flexGrow={1}>
                  <Autocomplete onLoad={onOriginLoad} onPlaceChanged={onOriginPlaceChanged}>
                    <Input sx={{ color: 'black', fontWeight: 'medium' }} type='text' placeholder='Origin' ref={originRef} />
                  </Autocomplete>
                </Box>
                <Box flexGrow={1}>
                  <Autocomplete onPlaceChanged={onDestPlaceChanged} onLoad={onDestLoad}>
                    <Input sx={{ color: 'black', fontWeight: 'medium' }}
                      type='text'
                      placeholder='Destination'
                      ref={destinationRef} />
                  </Autocomplete>
                </Box>

                <ButtonGroup>
                  <Button sx={{ mx: 4 }} type='submit' onClick={calculateRoute}>
                    Calculate Route
                  </Button>
                  <IconButton
                    onClick={clearRoute} />
                </ButtonGroup>
              </Stack>
              <Stack direction="row" mt={4} justifyContent="space-between">

                <Typography>
                  Distance: {distance}
                </Typography>
                <Typography>
                  Duration: {duration}
                </Typography>
                {map &&
                  <IconButton
                    onClick={() => {
                      map.panTo(center);
                      map.setZoom(15);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>}
              </Stack>
            </Box>
          </Container>
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
    </Box>

  );

}
