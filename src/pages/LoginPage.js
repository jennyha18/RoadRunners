import React from 'react';
import { Card, CardContent, Typography, Button, IconButton, Link, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../components/iconify';
import Logo from '../assets/logo512.png'

const StyledCard = styled(Card)({
  maxWidth: 400,
  margin: 'auto',
  marginTop: 'calc(50vh - 150px)',
  padding: 20,
  textAlign: 'center',
  borderRadius:10
});

const StyledButton = styled(Button)({
   marginBottom:10,
})

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    // Implement Google Sign In Logic here
  };

  return (
    <StyledCard>
      <CardContent>
      <img src={Logo} alt="Logo" width={80}/>
      <br></br>
        <StyledButton>
        <Button variant="outlined" startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" width={30} height={30} />}>
          Sign in with Google
        </Button>
        </StyledButton>
        <br></br>
        <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Don&apos;t have an account?
          </Typography>
      </CardContent>
    </StyledCard>
  );
}
