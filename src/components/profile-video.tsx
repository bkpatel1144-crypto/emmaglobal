import { Play } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { profileVideo } from "../lib/site-data";

/**
 * The company profile film.
 *
 * `preload="none"` means opening /about downloads no video at all — only the
 * poster, which is a still from the film itself. The clip is fetched when
 * someone actually presses play.
 *
 * `controls` is withheld until playback starts. Chrome paints the native
 * control bar above absolutely-positioned siblings, so leaving it on would put
 * a scrubber across the poster with nothing to scrub. Once started it is always
 * on, including when the browser refuses the play() — so there is no state in
 * which the film is loaded and cannot be controlled.
 */
export function ProfileVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    void video.play().catch(() => {
      /* If the browser refuses, the native controls are now visible anyway. */
    });
  }, []);

  return (
    <figure className="profile-video">
      <div className="profile-video-box">
        <video
          ref={videoRef}
          controls={started}
          playsInline
          preload="none"
          poster={profileVideo.poster}
          src={profileVideo.src}
          width={profileVideo.width}
          height={profileVideo.height}
          onPlay={() => setStarted(true)}
        />
        {!started && (
          <button
            type="button"
            className="profile-video-play"
            onClick={start}
            aria-label={`Play the ${profileVideo.caption}`}
          >
            <span className="profile-video-play-icon">
              <Play aria-hidden="true" />
            </span>
            <span className="profile-video-play-label">Watch the film</span>
          </button>
        )}
      </div>
      <figcaption>{profileVideo.caption}</figcaption>
    </figure>
  );
}
