import { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import Player from './Player';
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
  clientId: '627af30b66ea42588412deb8048cdc40',
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState('');

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch('');
    setLyrics('');
  }

  useEffect(() => {
    if (!playingTrack) return;
    axios
      .get('/lyrics', {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0],
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
            album: track.album.name,
          };
        }),
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <Container
      fluid
      className="d-flex flex-column pt-2"
      style={{
        height: '100vh',
        color: '#f5f5f5',
        backgroundColor: '#121212',
        width: '100%',
        padding: '0',
      }}
    >
      <Form.Control
        type="search"
        placeholder="Search a song, artist, or album..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '95%', margin: '0 auto' }}
      />
      <div
        className="flex-grow-1 my-2 search-results"
        style={{ overflowY: 'auto', width: '100%', margin: '0 auto' }}
      >
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: 'pre' }}>
            {lyrics}
          </div>
        )}
      </div>
      <div style={{ backgroundColor: '#212121', flexWrap: 'nowrap' }}>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri}></Player>
      </div>
    </Container>
  );
}
