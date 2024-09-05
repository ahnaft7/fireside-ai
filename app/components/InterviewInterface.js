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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* Video Container */}
      <div className="relative w-full h-[60vh] max-w-4xl bg-black rounded-lg overflow-hidden shadow-lg border border-gray-800">
        {/* AI Interviewer's Video */}
        <div className="w-full h-full relative">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            src="/path-to-ai-interviewer-video.mp4" // Placeholder video for AI interviewer
          />
        </div>

        {/* User's Video (bottom right corner) */}
        <div className="absolute bottom-4 right-4 w-1/4 h-1/4 bg-gray-800 border border-gray-600 rounded-md overflow-hidden shadow-md">
          <video
            ref={userVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
        <Button
          onClick={startInterview}
          disabled={isStarted}
          className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
        >
          Start Call
        </Button>
        <Button
          onClick={endInterview}
          disabled={!isStarted}
          className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
        >
          End Call
        </Button>
        {isStarted && (
          <>
            <Button
              onClick={toggleVideo}
              className={`${
                isVideoOn ? "bg-gray-500" : "bg-green-500"
              } text-white hover:bg-gray-600 transition-colors duration-300`}
            >
              {isVideoOn ? "Turn Off Video" : "Turn On Video"}
            </Button>
            <Button
              onClick={toggleMic}
              className={`${
                isMicOn ? "bg-gray-500" : "bg-green-500"
              } text-white hover:bg-gray-600 transition-colors duration-300`}
            >
              {isMicOn ? "Mute Mic" : "Unmute Mic"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewInterface;
