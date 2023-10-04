import { React, useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import jwt_decode from "jwt-decode";

import Logo from '../assets/rr-logo.png';
import image from '../assets/login-bg.jpg';

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
});

const StyledCard = styled(Card)({
  maxWidth: 500,
  margin: 'auto',
  padding: 20,
  textAlign: 'center',
  borderRadius: 10,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});

const StyledButton = styled(Button)({
  marginBottom: 10,
});

export default function LoginPage() {
  const [user, setUser] = useState({});

  const clientID = "408913456682-h499jei755hbigq1oik6e17lvm4pu22n.apps.googleusercontent.com";

  const handleGoogleSignIn = (response) => {
    // Implement Google Sign In Logic here
    console.log("Encoded JWT ID Token:" + response.credential + "\nDECODED: ");
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
  };

  useEffect(() => {
    // Load the Google Sign-In script when the component mounts
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: clientID,
        callback: handleGoogleSignIn
      });

      google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large" }
      );
    };

    document.head.appendChild(script);

    // Cleanup when the component unmounts
    return () => {
      // Remove the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <Container>
        <StyledCard>
          <CardContent>
            <img src={Logo} alt="Logo" width={400} />
            <br></br>
            <StyledButton>
              <div id="signInDiv"></div>
            </StyledButton>
            <br></br>
            <Typography component="a" href="https://accounts.google.com/signup/v2/createaccount?theme=glif&flowName=GlifWebSignIn&flowEntry=SignUp" target="_blank" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don't have an account?
            </Typography>
          </CardContent>
        </StyledCard>
      </Container>
    </div>
  );
}
