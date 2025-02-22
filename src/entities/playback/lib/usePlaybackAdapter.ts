import { useContext } from "react";
import { PlaybackContext } from "../config/playbackContext";

export const usePlaybackAdapter = () => {
    const context = useContext(PlaybackContext);
    if (!context) {
      throw new Error("usePlaybackAdapter must be used within a PlaybackProvider");
    }
    return context;
  };