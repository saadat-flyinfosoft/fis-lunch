import { useEffect } from "react";
import { useAudioPlayer } from "react-use-audio-player";

const AudioPlayer = () => {
  const { play, pause, ready, loading, error } = useAudioPlayer({
    src: "/dipjol-dialogue.mp3", // Correct path to your audio file
    format: "mp3",
    autoplay: false // Set to false, will play on mount
  });

  // Use effect to play audio on first render
  useEffect(() => {
    if (ready) {
      play().catch((error) => {
        console.error("Playback failed:", error);
      });
    }
  }, [ready, play]); // Ensure `play` is called after the audio is ready

  if (loading) return <p>Loading audio...</p>;
  if (error) return <p>Error loading audio.</p>;

  return (
    <div>
      <button onClick={play} disabled={!ready}>
        Play Audio
      </button>
      <button onClick={pause} disabled={!ready}>
        Pause Audio
      </button>
    </div>
  );
};

export default AudioPlayer;
