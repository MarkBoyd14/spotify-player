import React from 'react';
import SpotifyLogo from '../images/Spotify_Logo_RGB_Green.png';

import { Container } from 'react-bootstrap';

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=627af30b66ea42588412deb8048cdc40&response_type=code&redirect_uri=${
  process.env.NODE_ENV === 'production'
    ? 'https://spotify-player-mb.herokuapp.com/'
    : 'http://localhost:3000'
}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export default function Login() {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center flex-column"
      style={{ minHeight: '100vh', backgroundColor: '#121212' }}
    >
      <img src={SpotifyLogo} alt="Spotify logo" style={{ maxWidth: '460px' }} />
      <a
        className="btn btn-lg mt-2 login-btn"
        href={AUTH_URL}
        style={{ backgroundColor: '#1db954', color: '#f5f5f5' }}
      >
        Login With Spotify
      </a>
    </Container>
  );
}
