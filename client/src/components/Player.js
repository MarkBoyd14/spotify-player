import { useEffect, useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);

  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
      styles={{
        bgColor: '#212121',
        color: '#f5f5f5',
        trackNameColor: '#f5f5f5',
        trackArtistColor: '#b3b3b3',
        sliderColor: '#1db954',
        sliderHandleColor: '#f5f5f5',
        sliderTrackColor: '#535353',
      }}
    />
  );
}
