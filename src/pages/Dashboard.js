import React from 'react';
import axios from 'axios';
import { Card, Button, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopBar from '../components/additionalFeatures/TopBar';
import CreateTrip from '../components/newTrip/CreateTrip'
import {useTripContext} from '../hooks/useTripContext';
import {useDirectionContext} from '../hooks/useDirectionContext';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Map from '../components/newTrip/Map';
import Itinerary from '../components/newTrip/Itinerary';

const Container = styled('div')({
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    height: '90vh',
    flexDirection: 'column',
    position: 'relative', // Set position to relative
});
const CreateTripContainer = styled('div')({
    position: 'relative',
    zIndex: 2, // Set a higher z-index for CreateTrip to make it appear above Map
    backgroundColor: 'rgba(255, 255, 255, 0)', // Make CreateTripContainer semi-transparent
});
const MapWrapper = styled(Card)({
    width: '50%', // Set the width to 100%
    height: '95%', // Set the height to 100%
    position: 'absolute', // Set position to absolute
    top: '4%',
    left: '1%',
    borderRadius: 20,
    display: 'inline-block', // Set display to inline-block
});

const Wrapper = styled(Card)({
    width: '47%', // Set the width to 100%
    height: '95%', // Set the height to 100%
    position: 'absolute', // Set position to absolute,
    borderRadius: 20,
    right:'1%',
    top:'4%'
});


export default function Dashboard() {
    const tripString = useParams();
    const [nonce, setNonce] = useState('');
    const mapWrapperRef = useRef(null);
    const {directionsCallback} = useDirectionContext();
    const { tripDetails, setTripDetails } = useTripContext();

    useEffect(() => {
        // Decode tripString
        const decodedTripDetails = JSON.parse(atob(tripString));
        // console.log('decodedTripString:', decodedTripDetails);
        setTripDetails(decodedTripDetails);
    }
    , tripString);

    useEffect(() => {
        // Fake nonce generation for purposes of demonstration
        const uuid = uuidv4();
        // console.log('uuid:', uuid);
        setNonce(`nonce-${uuid}`);
    }, []);

    
    const buildRoadTrip = () => {
        const roadtripParams = {
            startLocation: tripDetails.startLocation,
            endLocation: tripDetails.endLocation,
            startDate: tripDetails.startDate,
            endDate: tripDetails.endDate
        };
        
        axios
        .get('/api/roadtrip/newRoadTrip', { params: roadtripParams })
        .then((res) => {
            //console.log(res.data);
            // setDirections(res.data); // Set the directionsResponse in the context
            directionsCallback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

      return (
        <div style={{ backgroundColor: '#F3F3F5'}}>
            <TopBar></TopBar>
            <Container>
                <CreateTripContainer>
                    {/* Add your CreateTrip component here */}
                    <CreateTrip/>
                </CreateTripContainer>
                
                <MapWrapper ref={mapWrapperRef}>
                    {/* Add your Map component here */}
                    <Map size={mapWrapperRef.current?mapWrapperRef.current.getBoundingClientRect():null}/>
                </MapWrapper>
                <Wrapper>
                    <Itinerary />
                </Wrapper>
            </Container>
        </div>
    );
}
