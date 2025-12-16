import React from 'react';
import ReactDOM from 'react-dom';
import ReactHlsPlayer from 'react-hls-player';

ReactDOM.render(
  <ReactHlsPlayer
    src="https://storage.googleapis.com/hls_encodings/6e4dfa1c-0297-4e69-93f5-32a4648fd9e8/playlist.m3u8"
    autoPlay={false}
    controls={true}
    width="100%"
    height="auto"
  />,
  document.getElementById('app')
);