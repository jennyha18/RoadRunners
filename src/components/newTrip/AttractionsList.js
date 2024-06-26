import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HotelIcon from '@mui/icons-material/Hotel';
import LandscapeIcon from '@mui/icons-material/Landscape';
import MuseumIcon from '@mui/icons-material/Museum';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import HotelCard from '../StopsComponents/Hotels';
import Landmarks from '../StopsComponents/Landmarks';
import Attractions from '../StopsComponents/Attractions';
import Restaurants from '../StopsComponents/Restaurants';
import LiveEvents from '../StopsComponents/LiveEvents';
import GasStations from '../StopsComponents/GasStations'
import { useEffect } from 'react';
import StopSearch from '../StopsComponents/StopSearch';
import {useDashboardContext} from '../../context/DashboardContext'
import LinearProgress from '@mui/material/LinearProgress';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
//Hotel Dummy Data
const HotelData = [
  {
    name: 'Holiday Inn Vancouver',
    location: 'Vancouver,British Columbia',
    price: '200',
    rating: '2.0',
    reviews: '500',
    link: 'https://www.google.com/travel/search?q=holiday%20inn%20vancouver&g2lb=2502548%2C2503771%2C2503781%2C4258168%2C4270442%2C4284970%2C4291517%2C4597339%2C4757164%2C4814050%2C4874190%2C4893075%2C4924070%2C4965990%2C4990494%2C10207535%2C72298667%2C72302247%2C72317059%2C72379816%2C72385362%2C72406588%2C72412687%2C72412688&hl=en-US&gl=us&cs=1&ssta=1&ts=CAESCAoCCAMKAggDGhwSGhIUCgcI5w8QCxgCEgcI5w8QCxgDGAEyAhAAKg8KDToDVVNEQgYIERICQDg&qs=CAEyFENnc0kxUHJOdF9yR25hcU5BUkFCOAtCCQlUffOmN3ZUjUIJCTC8yfFSz-duQgkJADcwjAAs3J4&ap=aAG6AQhvdmVydmlldw&ictx=1&sa=X&sqi=2&ved=0CAAQ5JsGahcKEwjQuay3t6GCAxUAAAAAHQAAAAAQBQ'
  },
  {
    name: 'Fairmont Hotel Vancouver',
    location: 'Vancouver,British Columbia',
    price: '400',
    rating: '3.0',
    reviews: '1000',
    link: 'https://www.google.com/travel/search?q=holiday%20inn%20vancouver&g2lb=2502548%2C2503771%2C2503781%2C4258168%2C4270442%2C4284970%2C4291517%2C4597339%2C4757164%2C4814050%2C4874190%2C4893075%2C4924070%2C4965990%2C4990494%2C10207535%2C72298667%2C72302247%2C72317059%2C72379816%2C72385362%2C72406588%2C72412687%2C72412688&hl=en-US&gl=us&cs=1&ssta=1&ts=CAESCAoCCAMKAggDGhwSGhIUCgcI5w8QCxgCEgcI5w8QCxgDGAEyAhAAKg8KDToDVVNEQgYIERICQDg&qs=CAEyFENnc0kxUHJOdF9yR25hcU5BUkFCOAtCCQlUffOmN3ZUjUIJCTC8yfFSz-duQgkJADcwjAAs3J4&ap=aAG6AQhvdmVydmlldw&ictx=1&sa=X&sqi=2&ved=0CAAQ5JsGahcKEwjQuay3t6GCAxUAAAAAHQAAAAAQBQ'
  },
  {
    name: 'Shangri-La False Creek',
    location: 'Vancouver,British Columbia',
    price: '600',
    rating: '4.0',
    reviews: '400'
  },
  {
    name: 'The Met Coal Harbor',
    location: 'Vancouver,British Columbia',
    price: '600',
    rating: '4.0',
    reviews: '600'
  }
];

export default function AttractionsList({viewOnly}) {
  const [value, setValue] = React.useState(2);
  const [allHotels, setAllHotels] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [allAttractions, setAllAttractions] = useState([]);
  const [unselectedAttraction, setUnselectedAttraction] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [selectedLiveEvents, setSelectedLiveEvents] = useState([]);
  const [allGasStations, setAllGasStations] = useState([]);
  const [selectedGasStations, setSelectedGasStations] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [liveEventsData, setLiveEventsData] = useState([]);
  const { tripDetails, changeStops, liveEvents, setLiveEvents, hotels} = useDashboardContext();

  useEffect(() => {
    const fetchEvents = async () => {
      await axios
        .get('/api/roadtrip/getLiveEvents', {
          params: {
            startLocation: tripDetails.stops[0].location,
            endLocation: tripDetails.stops[tripDetails.stops.length - 1].location,
            startDate: tripDetails.startDate,
            endDate: tripDetails.endDate,
          },
        })
        .then((response) => {
          setLiveEventsData(response.data);
          setLiveEvents(response.data);
        })
        .catch((err) => {
          // setError(err.message);
        });
      }
    if (tripDetails && tripDetails.stops && value == 3) {
      fetchEvents();
    }
  }, [tripDetails, value]);

  useEffect(() => {
    if (tripDetails && tripDetails.allStops) {
      const currentStops = tripDetails.stops;
      setAllAttractions(tripDetails.allStops);
      const attractionsCopy = [...tripDetails.allStops];
      currentStops.forEach((stop) => {
        if (stop.category !== 'start' && stop.category !== 'end' && !selectedAttractions.some(item => item.place_id === stop.place_id)) {
          selectedAttractions.push(stop);
        }
      });
      let selected = [];
      if (currentStops.some(obj => obj.gasStations)) {
        currentStops.forEach((stop) => {
          if (stop.gasStations && stop.gasStations.length > 0) {
            // If we didn't already add this gas station to the list, add it
            for(let i = 0; i < stop.gasStations.length; i++) {
              // If it already exists, don't add it
              if (allGasStations.find(gas => gas.place_id === stop.gasStations[i].place_id)) {
                continue;
              }
              allGasStations.push(stop.gasStations[i]);
            }
          }
        });
        allGasStations.forEach((g) => {
          if (currentStops.some((s) => s.place_id === g.place_id)) {
            selected.push(g);
          }
        });
        setSelectedGasStations(selected);
      }
      selected = [];
      const objWithRestaurants = currentStops.find(obj => obj.restaurants);
      if (objWithRestaurants) {
        const allRestaurants = objWithRestaurants.restaurants;
        setAllRestaurants(allRestaurants);
        allRestaurants.forEach((r) => {
          if (currentStops.some((s) => s.place_id === r.place_id)) {
            selected.push(r);
          }
        });
        setSelectedRestaurants(selected);

        // Filter out selected attractions from allAttractions to get unselectedAttractions
    const unselectedAttractions = attractionsCopy.filter(
      (attraction) => !selectedAttractions.some((selected) => selected.place_id === attraction.place_id)
    );
    setUnselectedAttraction(unselectedAttractions);
      }
    }
 }, [tripDetails]);
  /* stop selection functions */
  const handleStopSelection = (stop, selectedList, setSelectedList) => {
    if (stop.routeFromHere) {
      delete stop.routeFromHere;
    }
    const newStops = [...tripDetails.stops]
    const index = tripDetails.stops.findIndex((selectedStop) => selectedStop.place_id === stop.place_id);
    
    if (index === -1) {
      // Add Stop from route
      axios
      .post('/api/roadtrip/addStop', { newStop: stop, stops: newStops })
      .then((res) => {
        changeStops(res.data);
        setSelectedList((prevSelectedList) => [...prevSelectedList, stop]);
      })  
      .catch((err) => {
        console.log(err);
      });
    } else {
      // Add Remove from route
      axios
      .post('/api/roadtrip/removeStop', { indexToRemove: index, stops: newStops})
      .then((res) => {
        changeStops(res.data);
        setSelectedList((prevSelectedList) =>
        prevSelectedList.filter((s) => s.place_id !== stop.place_id)
      );
      })  
      .catch((err) => {
        console.log(err);
      });
    }
  };

  useEffect(() => {
    if(hotels) {
      setAllHotels(hotels);
    }
  }, [hotels]);

  const handleSelectedAttractionsChange = (newlySelectedAttractions) => {
    const updatedSelectedAttractions = [
      ...selectedAttractions,
      ...newlySelectedAttractions.filter(
        (attraction) => !selectedAttractions.some((selected) => selected.place_id === attraction.place_id)
      ),
    ];
  
    // Update the state with the new selected attractions
    setSelectedAttractions(updatedSelectedAttractions);
  
    // Additional logic to add these new attractions as stops to the route
    const stopsToAdd = newlySelectedAttractions.filter(
      (attraction) => !selectedAttractions.some((selected) => selected.place_id === attraction.place_id)
    );
  
    // Logic to add stops to the route using the handleStopSelection function
    stopsToAdd.forEach((attraction) => {
      handleStopSelection(attraction, selectedAttractions, setSelectedAttractions);
      // Depending on your implementation, you might need to adjust the arguments passed
      // to the handleStopSelection function to match the expected parameters.
    });
  
    // Do other operations or set state as needed
  };
  
  
  const isStopSelected = (stop, type) => {
    switch (type) {
      case 'hotel':
        return selectedHotels.some((selectedHotel) => selectedHotel.name === stop.name);
      // case 'landmark':
      //   return selectedLandmarks.some((selectedLandmark) => selectedLandmark.name === stop.name);
      case 'attraction':
        return selectedAttractions.some((selectedAttraction) => selectedAttraction.place_id === stop.place_id);
      case 'liveEvent':
        return selectedLiveEvents.some((selectedLiveEvent) => selectedLiveEvent.name === stop.name);
      case 'gasStation':
        return selectedGasStations.some((selectedGasStations) => selectedGasStations.place_id === stop.place_id);
      case 'restaurant':
        return selectedRestaurants.some((selectedRestaurants) => selectedRestaurants.place_id === stop.place_id);
      default:
        return false;
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (tripDetails && tripDetails.stops) {
    return (
      <Box
        sx={{ flexGrow: 2, bgcolor: 'background.paper', display: 'flex', height: '100%', alignContent: 'center', alignItems: 'start', padding: '0', width: '100%' }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider', width: '30%' }}
        >
          <Tab icon={<HotelIcon />} iconPosition="start" label="Hotels" {...a11yProps(0)} />
          {/* <Tab icon={<LandscapeIcon />} iconPosition="start" label="Landmarks" {...a11yProps(1)} /> */}
          <Tab icon={<MuseumIcon />} iconPosition="start" label="Attractions" {...a11yProps(2)} />
          <Tab icon={<RestaurantIcon />} iconPosition="start" label="Restaurants" {...a11yProps(3)} />
          <Tab icon={<TheaterComedyIcon />} iconPosition="start" label="Live Events" {...a11yProps(4)} />
          <Tab icon={<LocalGasStationIcon />} iconPosition="start" label="Gas Stations" {...a11yProps(5)} />
        </Tabs>
        <TabPanel value={value} index={0} style={{ maxHeight: '400px', overflowY: 'auto', width: '60%'}}>
          {allHotels.map((hotel, index) => (
            <HotelCard
              key={index}
              data={hotel}
              viewOnly={viewOnly}
              selected={isStopSelected(hotel, 'hotel')}
              onSelectionChange={() => handleStopSelection(hotel, selectedHotels, setSelectedHotels)}
            />
          ))}
        </TabPanel>
        <TabPanel value={value} index={1} style={{ width: '70%' }}>
        <StopSearch data={unselectedAttraction} onSelectedAttractionsChange={handleSelectedAttractionsChange} />
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}> 
            {
              allAttractions
              .slice()
              .sort((attractionA, attractionB) => {
                const isSelectedA = isStopSelected(attractionA, 'attraction');
                const isSelectedB = isStopSelected(attractionB, 'attraction');

                // If both attractions are selected or both are not selected, maintain their original order
                if (isSelectedA === isSelectedB) {
                  return 0;
                }

                // If attractionA is selected, place it before attractionB
                return isSelectedA ? -1 : 1;
              })
              .map((attraction, index) => (
                <Attractions
                  key={index}
                  data={attraction}
                  viewOnly={viewOnly}
                  selected={isStopSelected(attraction, 'attraction')}
                  onSelectionChange={() => handleStopSelection(attraction, selectedAttractions, setSelectedAttractions)}
                />
              ))
            }
          </div> 
        </TabPanel>
        <TabPanel value={value} index={2} style={{ maxHeight: '400px', overflowY: 'auto', width: '70%' }}>
          {allRestaurants && allRestaurants
            .slice()
            .sort((attractionA, attractionB) => {
              const isSelectedA = isStopSelected(attractionA, 'restaurant');
              const isSelectedB = isStopSelected(attractionB, 'restaurant');

              // If both attractions are selected or both are not selected, maintain their original order
              if (isSelectedA === isSelectedB) {
                return 0;
              }

              // If attractionA is selected, place it before attractionB
              return isSelectedA ? -1 : 1;
            })
            .map((restaurant, index) => (
            <Restaurants
              key={index}
              viewOnly={viewOnly}
              data={restaurant}
              selected={isStopSelected(restaurant, 'restaurant')}
              onSelectionChange={() => handleStopSelection(restaurant, selectedRestaurants, setSelectedRestaurants)}
            />
          ))}
        </TabPanel>
        {<TabPanel value={value} index={3} style={{ maxHeight: '400px', overflowY: 'auto' }} >
          {liveEventsData.map((event, index) => (
            <LiveEvents
              key={index}
              data={event}
              viewOnly={viewOnly}
              selected={isStopSelected(event, 'liveEvent')}
              onSelectionChange={() => handleStopSelection(event, selectedLiveEvents, setSelectedLiveEvents)}
            />
          ))}
          </TabPanel> }
        <TabPanel value={value} index={4} style={{ maxHeight: '400px', overflowY: 'auto', width: '70%' }}>
          {allGasStations && allGasStations
            .slice()
            .sort((attractionA, attractionB) => {
              const isSelectedA = isStopSelected(attractionA, 'gasStation');
              const isSelectedB = isStopSelected(attractionB, 'gasStation');

              // If both attractions are selected or both are not selected, maintain their original order
              if (isSelectedA === isSelectedB) {
                return 0;
              }

              // If attractionA is selected, place it before attractionB
              return isSelectedA ? -1 : 1;
            })
            .map((gas, index) => (
            <GasStations
              key={index}
              viewOnly={viewOnly}
               selected={isStopSelected(gas,'gasStation')}
               onSelectionChange={() => handleStopSelection(gas,selectedGasStations, setSelectedGasStations)}
              data={gas}
            />
          ))}
        </TabPanel>
  
      </Box>
    );
  } 
  return (
    <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold'}}>
 <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
    </Typography>
  );
}