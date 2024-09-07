"use client";
import { useEffect, useState, useRef } from "react";

const SILENCE_THRESHOLD = -50; // dB
const SILENCE_DURATION = 3000; // 3 seconds

export const useRecordVoice = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const websocket = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const silenceStart = useRef(null);
  const rafId = useRef(null);
  const audioChunks = useRef([]);

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

  const detectSilence = () => {
    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const db = 20 * Math.log10(average / 255);

    if (db < SILENCE_THRESHOLD) {
      if (silenceStart.current === null) {
        silenceStart.current = Date.now();
      } else if (Date.now() - silenceStart.current > SILENCE_DURATION) {
        console.log("Silence is greater than silence duration of: ", SILENCE_DURATION)
        stopRecording();
        return;
      }
    } else {
      silenceStart.current = null;
    }

    rafId.current = requestAnimationFrame(detectSilence);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        if (websocket.current.readyState === WebSocket.OPEN) {
          websocket.current.send(audioBlob);
        }
        audioChunks.current = [];
      };

      mediaRecorder.current.start(1000); // Send audio data every 1 second
      setRecording(true);
      silenceStart.current = null;
      rafId.current = requestAnimationFrame(detectSilence);
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
      cancelAnimationFrame(rafId.current);
      silenceStart.current = null;
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