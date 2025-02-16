// import React, { useRef, useEffect } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";

// export const VideoPlayer = (props) => {
//     const videoRef = useRef(null);
//     const playerRef = useRef(null);
//     const { options, onReady } = props;

//     useEffect(() => {
//         // Make sure Video.js player is only initialized once
//         if (!playerRef.current) {
//             // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
//             const videoElement = document.createElement("video-js");

//             videoElement.classList.add("vjs-big-play-centered");
//             videoRef.current.appendChild(videoElement);

//             const player = (playerRef.current = videojs(videoElement, options, () => {
//                 videojs.log("player is ready");
//                 onReady && onReady(player);
//             }));

//             // You could update an existing player in the `else` block here
//             // on prop change, for example:
//         } else {
//             const player = playerRef.current;

//             player.autoplay(options.autoplay);
//             player.src(options.sources);
//         }
//     }, [options, videoRef]);

//     // Dispose the Video.js player when the functional component unmounts
//     useEffect(() => {
//         const player = playerRef.current;

//         return () => {
//             if (player && !player.isDisposed()) {
//                 player.dispose();
//                 playerRef.current = null;
//             }
//         };
//     }, [playerRef]);

//     return (
//         <div
//             data-vjs-player
//             style={{ width: "600px" }}
//         >
//             <div ref={videoRef} />
//         </div>
//     );
// };

// export default VideoPlayer;


import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// import videojs from "video.js/dist/video.cjs";
import Hls from "hls.js";

export const VideoPlayer = (props) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const { options, onReady } = props;

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-big-play-centered");
            videoRef.current.appendChild(videoElement);

            const player = (playerRef.current = videojs(videoElement, options, () => {
                videojs.log("Player is ready");
                onReady && onReady(player);
            }));

            // Handle HLS manually if needed
            if (options.sources[0]?.src?.endsWith(".m3u8") && Hls.isSupported()) {
                const hls = new Hls({
                    xhrSetup: function (xhr) {
                        xhr.timeout = 600000; // 60 seconds timeout
                    }
                });

                hls.loadSource(options.sources[0].src);
                hls.attachMedia(videoElement);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log("Manifest loaded, starting playback...");
                    player.play();
                });

                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.error("Network error: Unable to load the video.");
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.error("Media error: Corrupted stream or incompatible format.");
                                hls.recoverMediaError();
                                break;
                            default:
                                console.error("HLS.js error:", data);
                                hls.destroy();
                        }
                    }
                });
            }
        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [options, videoRef]);

    useEffect(() => {
        return () => {
            const player = playerRef.current;
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div data-vjs-player style={{ width: "800px" }}>
            <div ref={videoRef} />
        </div>
    );
};

export default VideoPlayer;
