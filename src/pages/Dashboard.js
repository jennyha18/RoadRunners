import React from 'react';
import axios from 'axios';
import { Card, Button, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopBar from '../components/TopBar';
import CreateTrip from '../components/CreateTrip'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Map from '../components/Map';
import Itinerary from '../components/itinerary';

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
    height: '90%', // Set the height to 100%
    position: 'absolute', // Set position to absolute
    top: '4%',
    left: '1%',
    borderRadius: 20,
    display: 'inline-block', // Set display to inline-block
});

const Wrapper = styled(Card)({
    width: '45%', // Set the width to 100%
    height: '90%', // Set the height to 100%
    position: 'absolute', // Set position to absolute,
    borderRadius: 20,
    right:'1%',
    top:'4%'
});



export default function Dashboard() {

    const { startLocation, endLocation, startDate, endDate } = useParams();

      return (
        <div style={{ backgroundColor: '#F3F3F5'}}>
            <TopBar></TopBar>
            <Container>
                <CreateTripContainer>
                    {/* Add your CreateTrip component here */}
                    <CreateTrip startLocation={startLocation} endLocation={endLocation} startDate={startDate} endDate={endDate}/>
                </CreateTripContainer>
                
                <MapWrapper>
                    {/* Add your Map component here */}
                    <Map />
                </MapWrapper>
                <Wrapper>
                <Itinerary></Itinerary>
                </Wrapper>
        
               
            </Container>
        </div>
    );
}
