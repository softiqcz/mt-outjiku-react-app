import { useEffect, useRef } from "react";

export function useAutoplayVideo<T extends HTMLVideoElement>() {
  const videoRef = useRef<T | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.playsInline = true;

    function playVideo() {
      void video?.play().catch(() => {
        // Browser policy can still block autoplay; the poster or first frame remains visible.
      });
    }

    playVideo();
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);

    return () => {
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
    };
  }, []);

  return videoRef;
}
