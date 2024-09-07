import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using Shadcn buttons
import { useRecordVoice } from "@/app/hooks/useRecordVoice"; // Import the hook
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const DEBOUNCE_DELAY = 1000; // 1 second debounce

const InterviewInterface = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false); // State for AI speaking animation
  const [timer, setTimer] = useState(0); // State to track elapsed time
  const [videoDevices, setVideoDevices] = useState([]); // List of video devices
  const [audioDevices, setAudioDevices] = useState([]); // List of audio devices
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(""); // Selected video device
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(""); // Selected audio device
  const [conversationHistory, setConversationHistory] = useState([]);
  const { user } = useUser();
  const userVideoRef = useRef(null); // Reference to the user's video
  const streamRef = useRef(null);
  const { recording, toggleRecording, text, response } = useRecordVoice();

  const lastTextRef = useRef("");
  const lastResponseRef = useRef("");
  const textTimeoutRef = useRef(null);
  const responseTimeoutRef = useRef(null);

  const addToConversationHistory = useCallback((type, content) => {
    if (content && content.trim() !== "") {
      setConversationHistory(prev => {
        const lastEntry = prev[prev.length - 1];
        if (!lastEntry || lastEntry.type !== type || lastEntry.text !== content) {
          return [...prev, { type, text: content, timestamp: timer }];
        }
        return prev;
      });
    }
  }, [timer]);

  const debouncedAddToHistory = useCallback((type, content, timeoutRef) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      addToConversationHistory(type, content);
    }, DEBOUNCE_DELAY);
  }, [addToConversationHistory]);

  useEffect(() => {
    if (text !== lastTextRef.current) {
      debouncedAddToHistory('user', text, textTimeoutRef);
      lastTextRef.current = text;
    }
  }, [text, debouncedAddToHistory]);

  useEffect(() => {
    if (response !== lastResponseRef.current) {
      debouncedAddToHistory('ai', response, responseTimeoutRef);
      lastResponseRef.current = response;
      setAiSpeaking(true);
      const timeout = setTimeout(() => setAiSpeaking(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [response, debouncedAddToHistory]);

  // useEffect(() => {
  //   if (text && (conversationHistory.length === 0 || text !== conversationHistory[conversationHistory.length - 1]?.text)) {
  //     setConversationHistory(prev => [...prev, { type: 'user', text, timestamp: timer }]);
  //   }
  // }, [text, timer]);

  // useEffect(() => {
  //   if (response && (conversationHistory.length === 0 || response !== conversationHistory[conversationHistory.length - 1]?.text)) {
  //     setAiSpeaking(true);
  //     setConversationHistory(prev => [...prev, { type: 'ai', text: response, timestamp: timer }]);
  //     const timeout = setTimeout(() => setAiSpeaking(false), 3000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [response, timer]);

  // Function to fetch available devices
  const fetchDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setVideoDevices(devices.filter(device => device.kind === 'videoinput'));
      setAudioDevices(devices.filter(device => device.kind === 'audioinput'));
    } catch (err) {
      console.error("Error fetching media devices:", err);
    }
  };

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  // Function to start the interview session
  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDevice ? { deviceId: selectedVideoDevice } : true,
        audio: selectedAudioDevice ? { deviceId: selectedAudioDevice } : true,
      });
      userVideoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsStarted(true);
      setIsVideoOn(true);
      console.log("recording state in startInterview before toggleRecording: ", recording)
      if (!recording) toggleRecording(); // Start recording when the interview starts
      console.log("recording state in startInterview after toggleRecording: ", recording)
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const saveTranscriptToFirebase = async () => {
    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      // Clear any pending debounced updates
      clearTimeout(textTimeoutRef.current);
      clearTimeout(responseTimeoutRef.current);

      const transcriptRef = await addDoc(collection(db, "transcripts"), {
        userId: user.id,
        date: serverTimestamp(),
        conversationHistory,
        duration: timer
      });

      console.log("Transcript saved with ID: ", transcriptRef.id);
      return transcriptRef.id;
    } catch (error) {
      console.error("Error saving transcript: ", error);
    }
  };

  // Function to end the interview session
  const endInterview = async () => {
    streamRef.current.getTracks().forEach((track) => track.stop());
    setIsStarted(false);
    setIsVideoOn(false);
    setIsMicOn(false);
    if (recording) toggleRecording();

    const transcriptId = await saveTranscriptToFirebase();
    if (transcriptId) {
      console.log("Interview session saved. Transcript ID:", transcriptId);
    }

    setTimer(0);
    setConversationHistory([]);
  };

  // Function to switch camera
  const switchCamera = async (newDeviceId) => {
    try {
      const stream = streamRef.current;
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: newDeviceId ? { deviceId: newDeviceId } : true,
        audio: selectedAudioDevice ? { deviceId: selectedAudioDevice } : true,
      });

      // Replace the video track in the current stream
      const videoTrack = newStream.getVideoTracks()[0];
      const oldVideoTrack = stream.getVideoTracks()[0];

      // Replace the old track with the new track
      stream.removeTrack(oldVideoTrack);
      stream.addTrack(videoTrack);

      // Update the video element source
      userVideoRef.current.srcObject = stream;

      // Update the selected device
      setSelectedVideoDevice(newDeviceId);
    } catch (err) {
      console.error("Error switching camera:", err);
    }
  };

  // Function to switch microphone
  const switchMic = async (newDeviceId) => {
    try {
      const stream = streamRef.current;
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDevice ? { deviceId: selectedVideoDevice } : true,
        audio: newDeviceId ? { deviceId: newDeviceId } : true,
      });

      // Replace the audio track in the current stream
      const audioTrack = newStream.getAudioTracks()[0];
      const oldAudioTrack = stream.getAudioTracks()[0];

      // Replace the old track with the new track
      stream.removeTrack(oldAudioTrack);
      stream.addTrack(audioTrack);

      // Update the video element source
      userVideoRef.current.srcObject = stream;

      // Update the selected device
      setSelectedAudioDevice(newDeviceId);
    } catch (err) {
      console.error("Error switching microphone:", err);
    }
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
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
  
      // Also, pause or resume the recording based on the mic state
      if (audioTrack.enabled) {
        if (!recording) toggleRecording(); // Resume recording when the mic is on
      } else {
        if (recording) toggleRecording(); // Pause/Stop recording when the mic is off
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isStarted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000); // Update every second
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4" style={{ backgroundColor: "#2A2A2A" }}>
      <div className="relative w-full h-[60vh] max-w-4xl bg-black rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
        {/* Pulse Wave Effects (conditionally rendered based on aiSpeaking) */}
        {aiSpeaking && (
          <div className="absolute flex items-center justify-center">
            <div className="pulse-wave"></div>
            <div className="pulse-wave"></div>
            <div className="pulse-wave"></div>
          </div>
        )}
        {/* AI Interviewer's Video */}
        {/* <div className="w-full h-full bg-black mb-4 relative">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            src="/path-to-ai-interviewer-video.mp4" // Placeholder video for AI interviewer
          />
        </div> */}
        <div className="w-full h-auto max-w-3xl flex items-center justify-center">
          <img
            src="/fireside_logo.png" // Placeholder for AI interviewer logo
            alt="AI Interviewer"
            className={`w-40 h-40 object-contain ${aiSpeaking ? "animate-sound" : ""}`}
          />
        </div>

        {/* User's Video (bottom right corner) */}
        <div className="absolute bottom-4 right-4 w-1/4 h-1/4 bg-gray-800 border border-gray-600 rounded-md overflow-hidden shadow-md" style={{ backgroundColor: "#333333" }}>
            <video
                ref={userVideoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
            />
        </div>
      </div>

      {/* Timer Display */}
      {isStarted && (
        <div className="mt-4 text-white text-xl font-semibold">
          Call Duration: {formatTime(timer)}
        </div>
      )}

      {/* Device Selection Dropdowns */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-white">Select Camera:</label>
          <select
            value={selectedVideoDevice}
            onChange={(e) => switchCamera(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white" style={{ backgroundColor: "#333333" }}
          >
            <option value="">Default Camera</option>
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-white">Select Microphone:</label>
          <select
            value={selectedAudioDevice}
            onChange={(e) => switchMic(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white" style={{ backgroundColor: "#333333" }}
          >
            <option value="">Default Microphone</option>
            {audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
        <Button onClick={startInterview} disabled={isStarted} className="bg-blue-500 text-white hover:bg-blue-600">
          Start Call
        </Button>
        <Button onClick={endInterview} disabled={!isStarted} className="bg-red-500 text-white hover:bg-red-600">
          End Call
        </Button>
        {isStarted && (
          <>
            <Button onClick={toggleVideo} className={`${
              isVideoOn ? "bg-gray-500" : "bg-green-500"
              } text-white hover:bg-gray-600`}>
              {isVideoOn ? "Turn Off Video" : "Turn On Video"}
            </Button>
            <Button onClick={toggleMic} className={`${
              isMicOn ? "bg-gray-500" : "bg-green-500"
              } text-white hover:bg-gray-600`}>
              {isMicOn ? "Mute Mic" : "Unmute Mic"}
            </Button>
          </>
        )}
      </div>

      {/* Display Transcription and LLM Response */}
      <div className="mt-4 text-white">
        <h3 className="text-lg font-semibold">Transcription:</h3>
        <p>{text}</p>
        <h3 className="text-lg font-semibold mt-2">LLM Response:</h3>
        <p>{response}</p>
      </div>

      {/* Live Transcript and LLM Response */}
      <div className="mt-8 w-full max-w-4xl bg-gray-800 rounded-lg p-4 overflow-y-auto h-96" style={{ backgroundColor: "#333333" }}>
        <h3 className="text-xl font-semibold text-white mb-4">Live Transcript</h3>
        {conversationHistory.map((entry, index) => (
          <div key={index} className={`mb-4 ${entry.type === 'user' ? 'text-blue-300' : 'text-green-300'}`}>
            <span className="font-semibold">{entry.type === 'user' ? 'You' : 'AI'} ({formatTime(entry.timestamp)}):</span>
            <p className="ml-4">{entry.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default InterviewInterface;
