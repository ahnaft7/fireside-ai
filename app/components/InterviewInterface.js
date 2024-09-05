import { useState, useRef } from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using Shadcn buttons

const InterviewInterface = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Function to start the interview session
  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsStarted(true);
      setIsVideoOn(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // Function to end the interview session
  const endInterview = () => {
    streamRef.current.getTracks().forEach(track => track.stop()); // Stop all media tracks
    setIsStarted(false);
    setIsVideoOn(false);
    setIsMicOn(false);
  };

  // Function to toggle the video stream on/off
  const toggleVideo = () => {
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  };

  // Function to toggle the microphone on/off
  const toggleMic = () => {
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          className="rounded-md border border-gray-300 w-full max-w-md h-auto mb-4"
          muted // This mutes the video output so the user doesn't hear themselves
        />
      </div>

      <div className="controls flex space-x-4">
        {!isStarted ? (
          <Button onClick={startInterview}>Start Call</Button>
        ) : (
          <Button onClick={endInterview}>End Call</Button>
        )}
        {isStarted && (
          <>
            <Button onClick={toggleVideo}>
              {isVideoOn ? "Turn Off Video" : "Turn On Video"}
            </Button>
            <Button onClick={toggleMic}>
              {isMicOn ? "Mute Mic" : "Unmute Mic"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewInterface;
