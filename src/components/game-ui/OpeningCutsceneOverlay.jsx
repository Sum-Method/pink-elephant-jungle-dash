import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export const OpeningCutsceneOverlay = forwardRef(function OpeningCutsceneOverlay({
  open,
  videoSrc,
  title = "Cut Scene",
  muted = false,
  skipLabel = "Skip",
  playLabel = "Play With Sound",
  fallbackLabel = "Continue",
  onPlaybackStart,
  onFinish,
}, ref) {
  const videoRef = useRef(null);
  const skipButtonRef = useRef(null);
  const playButtonRef = useRef(null);
  const finishedRef = useRef(false);
  const [playbackStatus, setPlaybackStatus] = useState("ready");

  const finishCutscene = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish?.();
  }, [onFinish]);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) {
      setPlaybackStatus("failed");
      return;
    }

    try {
      if (video.ended || video.currentTime > 0) video.currentTime = 0;
    } catch {
      // Some browsers reject seeking before metadata is ready; trying play is still safe.
    }

    video.muted = muted;
    video.volume = muted ? 0 : 1;
    onPlaybackStart?.();
    setPlaybackStatus("starting");

    const playPromise = video.play();
    if (typeof playPromise?.then === "function") {
      playPromise
        .then(() => setPlaybackStatus("playing"))
        .catch((error) => {
          console.warn("Cutscene playback failed. Use Continue to move on.", error);
          setPlaybackStatus("failed");
        });
      return;
    }

    setPlaybackStatus("playing");
  }, [muted, onPlaybackStart, videoSrc]);

  useImperativeHandle(ref, () => ({
    playWithSound: startPlayback,
  }), [startPlayback]);

  useEffect(() => {
    if (!open) return undefined;

    finishedRef.current = false;

    return () => {
      videoRef.current?.pause();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const focusFrame = window.requestAnimationFrame(() => {
      if (playbackStatus === "playing" || playbackStatus === "starting") {
        skipButtonRef.current?.focus({ preventScroll: true });
        return;
      }
      playButtonRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
    };
  }, [open, playbackStatus]);

  useEffect(() => {
    if (open) return;
    finishedRef.current = false;
    setPlaybackStatus("ready");
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape" && event.key !== "Enter") return;
      event.preventDefault();
      if (event.key === "Escape") {
        finishCutscene();
        return;
      }
      if (playbackStatus !== "playing") startPlayback();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishCutscene, open, playbackStatus, startPlayback]);

  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
  }, [muted, open]);

  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    if (!video || !videoSrc) {
      setPlaybackStatus("failed");
      return;
    }

    try {
      video.currentTime = 0;
    } catch {
      // Some browsers reject seeking before metadata is ready; the play button can still work.
    }
  }, [open, videoSrc]);

  if (!open) return null;

  const showPlayPrompt = playbackStatus !== "playing" && playbackStatus !== "starting";
  const playPromptCopy = playbackStatus === "failed"
    ? "The browser could not start this video. Try again, or continue to the game."
    : "Tap to play this cut scene with its original music and sound.";

  return (
    <section
      className="opening-cutscene-overlay"
      aria-modal="true"
      aria-labelledby="opening-cutscene-title"
      data-cutscene-control="true"
      role="dialog"
    >
      <div className="opening-cutscene-stage">
        <video
          ref={videoRef}
          className="opening-cutscene-video"
          src={videoSrc}
          playsInline
          preload="auto"
          muted={muted}
          onEnded={finishCutscene}
          onError={() => setPlaybackStatus("failed")}
        />
        <div className="opening-cutscene-topbar">
          <h2 id="opening-cutscene-title">{title}</h2>
          <button
            ref={skipButtonRef}
            type="button"
            className="opening-cutscene-skip jungle-focus-ring"
            onClick={finishCutscene}
          >
            {playbackStatus === "failed" ? fallbackLabel : skipLabel}
          </button>
        </div>
        {showPlayPrompt && (
          <div className="opening-cutscene-play-panel">
            <p>{playPromptCopy}</p>
            <button
              ref={playButtonRef}
              type="button"
              className="opening-cutscene-play jungle-focus-ring"
              onClick={startPlayback}
            >
              {playbackStatus === "failed" ? "Try Sound Again" : playLabel}
            </button>
            {playbackStatus === "failed" && (
              <button
                type="button"
                className="opening-cutscene-continue jungle-focus-ring"
                onClick={finishCutscene}
              >
                {fallbackLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
});
