import { Skeleton } from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import { AppMap } from './AppMap';

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  if (!isLoaded) {
    return <Skeleton />
  } else {
    return <AppMap />
  }
}

export default App


