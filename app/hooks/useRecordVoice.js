"use client";
import { useEffect, useState, useRef } from "react";

export const useRecordVoice = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const websocket = useRef(null);

  useEffect(() => {
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://murmuring-brook-70982-594f2df149b8.herokuapp.com'
      : 'ws://localhost:3001';

    websocket.current = new WebSocket(wsUrl);

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
  
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0 && websocket.current.readyState === WebSocket.OPEN) {
          websocket.current.send(event.data);

          mediaRecorder.current.stop();
          mediaRecorder.current.start(5000);
        }
      };
  
      mediaRecorder.current.start(1000); // Send audio data every 1 second
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
      // Stop all tracks on the stream
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
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