import { useState, useRef } from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using Shadcn buttons

const InterviewInterface = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const userVideoRef = useRef(null); // Reference to the user's video
  const streamRef = useRef(null);

  // Function to start the interview session
  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      userVideoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsStarted(true);
      setIsVideoOn(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // Function to end the interview session
  const endInterview = () => {
    streamRef.current.getTracks().forEach((track) => track.stop()); // Stop all media tracks
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
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      {/* AI Interviewer's Video */}
      <div className="w-full h-auto max-w-3xl bg-black mb-4 relative">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          src="/path-to-ai-interviewer-video.mp4" // Placeholder video for AI interviewer
        />
      </div>

      {/* User's Video (bottom right corner) */}
      <div className="absolute bottom-5 right-5 w-40 h-30 border border-gray-300 rounded-md overflow-hidden">
        <video
          ref={userVideoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      </div>

      <div className="controls flex space-x-4 mt-4">
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
