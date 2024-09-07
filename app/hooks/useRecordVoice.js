"use client";
import { useEffect, useState, useRef } from "react";

export const useRecordVoice = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const websocket = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const microphone = useRef(null);
  const silenceTimer = useRef(null);
  const audioChunks = useRef([]); // Store all audio chunks in this array
  const silenceThreshold = 0.4; // Adjust this value to fine-tune silence detection
  const silenceDelay = 300; // Time in milliseconds before stopping after silence is detected
  
  useEffect(() => {
    websocket.current = new WebSocket('ws://localhost:3001');

    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcription') {
        setText(data.text);
      } else if (data.type === 'llmResponse') {
        setResponse(data.response);
      }
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      // Set up AudioContext for volume monitoring
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      microphone.current = audioContext.current.createMediaStreamSource(stream);
      microphone.current.connect(analyser.current);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data); // Accumulate all audio chunks
        }
      };

      mediaRecorder.current.start(); // Start recording continuously
      setRecording(true);
      monitorVolume(); // Start monitoring the volume for silence detection
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const monitorVolume = () => {
    const dataArray = new Uint8Array(analyser.current.fftSize);

    const checkVolume = () => {
      analyser.current.getByteFrequencyData(dataArray);

      let maxVolume = 0;
      for (let i = 0; i < dataArray.length; i++) {
        maxVolume = Math.max(maxVolume, dataArray[i]);
      }

      const normalizedVolume = maxVolume / 256; // Normalize volume to 0-1 range
      console.log(`Normalized Volume: ${normalizedVolume}`);

      if (normalizedVolume < silenceThreshold) {
        console.log('Silence detected');
        
        if (!silenceTimer.current) {
          // Set silenceTimer to track the silence delay countdown
          silenceTimer.current = Date.now();
          console.log("Starting silence timer");
        } else {
          // Check if the silence period has lasted for the silenceDelay
          const elapsedTime = Date.now() - silenceTimer.current;
          console.log(`Elapsed silence time: ${elapsedTime}`);
  
          if (elapsedTime >= silenceDelay) {
            console.log("Silence period reached threshold, stopping recording.");
            stopRecording();  // Trigger stopRecording after the silenceDelay has passed
            silenceTimer.current = null; // Reset the silence timer
          }
        }
      } else {
        // Reset the silence timer if noise is detected
        if (silenceTimer.current) {
          console.log('Noise detected, resetting silence timer');
          silenceTimer.current = null;
        }
      }
  
      requestAnimationFrame(checkVolume); // Continuously check the volume
    };

    checkVolume();
  };
  
  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop(); // Stop the media recorder
      setRecording(false);

      // Stop all tracks on the stream
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      
      if (audioContext.current) {
        audioContext.current.close();
      }
      
      // Once recording is stopped, process the accumulated audio chunks
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      sendAudioFile(audioBlob);

      console.log("Stopped recording due to silence.");
    }
  };

  const sendAudioFile = (audioBlob) => {
    // Ensure the audioBlob is in the correct format (webm, wav, etc.)
    const fileType = audioBlob.type;
  
    if (fileType !== "audio/webm" && fileType !== "audio/wav") {
      console.error("Unsupported audio format. Please use webm or wav.");
      return;
    }
  
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(audioBlob); // Send the combined audio file
    }
  
    // Clear the audioChunks after sending the file
    audioChunks.current = [];
  };
  
  

  const toggleRecording = async () => {
    if (recording) {

      stopRecording();
    } else {
      await startRecording();
    }
  };

  return { recording, toggleRecording, text, response };
};
