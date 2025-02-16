import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoPlayer from './videoPlayer'
import { useRef } from 'react'
import videojs from "video.js";

function App() {
  const playerRef = useRef(null)
  // const videoLink = "https://zf0gxnlj-8000.inc1.devtunnels.ms/uploads/videos/529f0eda-1597-4e95-a5ca-46b18ab13865/index.m3u8"
  const videoLink = "https://zf0gxnlj-8000.inc1.devtunnels.ms/uploads/videos/71b594fb-1d6c-4525-b007-df9414e94a8b/index.m3u8"

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL"
      }
    ]
  }
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  return (
    <>
      <div>
        <h1>Video player</h1>
      </div>
      <VideoPlayer
      options={videoPlayerOptions}
      onReady={handlePlayerReady}
      />
    </>
  )
}

export default App
