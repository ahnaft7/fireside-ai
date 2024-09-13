"use client";
import { useEffect, useState, useRef, useCallback } from "react";

const SILENCE_THRESHOLD = -50; // dB
const SILENCE_DURATION = 3000; // 3 seconds

export const useRecordVoice = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [recording, setRecording] = useState(false);
  const [responding, setRespondingState] = useState(false);
  const mediaRecorder = useRef(null);
  const websocket = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const silenceStart = useRef(null);
  const rafId = useRef(null);
  const audioChunks = useRef([]);
  const isRecording = useRef(false);
  const isMicOn = useRef(true);
  const isCallActive = useRef(true);
  const isResponding = useRef(false);

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
        console.log("responding state before setting Response: ", responding)
        setRespondingState(true)
        isResponding.current = true;
        console.log("responding state while setting Response: ", responding)
        setResponse(data.response);
        if (isMicOn.current && isCallActive.current) {
          startRecording();
        }
      }
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  const stopRecording = useCallback(() => {
    console.log("Entered stop Recording function")
    console.log("recording state entering stopRecording: ", recording)
    console.log("mediaRecorder status: ", mediaRecorder.current)
    if (mediaRecorder.current && isRecording.current) {
      console.log("mediaRecorder.current and recording")
      console.log("recording state before turning off: ", recording)
      mediaRecorder.current.stop();
      isRecording.current = false;
      setRecording(false);
      isResponding.current = true
      console.log("recording state after turning off: ", recording)
      // Stop all tracks on the stream
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(rafId.current);
      silenceStart.current = null;
    }
  }, []);

  const detectSilence = useCallback(() => {
    if (!isRecording.current) return;

    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const db = 20 * Math.log10(average / 255);
    console.log("Current db level: ", db)

    if (db < SILENCE_THRESHOLD) {
      console.log("db is less than silence threshold of: ", SILENCE_THRESHOLD)
      if (silenceStart.current === null) {
        console.log("Silence timer is null and restarting")
        silenceStart.current = Date.now();
      } else if (Date.now() - silenceStart.current > SILENCE_DURATION) {
        console.log("Silence time is greater than silence duration of: ", SILENCE_DURATION)
        console.log("recording state before stopRecording after 3 sec silence: ", recording)
        stopRecording();
        console.log("recording state after stopRecording after 3 sec silence: ", recording)
        console.log("should've stopped recording")
        return;
      }
    } else {
      console.log("db is more than silence threshold")
      silenceStart.current = null;
    }

    rafId.current = requestAnimationFrame(detectSilence);
  }, [stopRecording]);

  const startRecording = useCallback(async () => {
    if (!isMicOn.current || !isCallActive.current) return;

    try {
      if (mediaRecorder.current) {
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      }
      console.log("responding state when starting recording: ", responding)
      setRespondingState(false)
      isResponding.current = false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);

      audioChunks.current = []; // Reset audio chunks

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
        audioChunks.current = []; // Clear audio chunks after sending
      };

      mediaRecorder.current.start(1000); // Send audio data every 1 second
      console.log("recording state before recording set to true in startRecording: ", recording)
      isRecording.current = true;
      setRecording(true); // this is not setting recording to true for some reason??????????????????
      console.log("recording state after recording set to true in startRecording: ", recording)
      silenceStart.current = null;
      rafId.current = requestAnimationFrame(detectSilence);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [detectSilence]);

  const toggleRecording = useCallback(async () => {
    if (isRecording.current) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [startRecording, stopRecording]);

  // const setMicState = useCallback((state) => {
  //   isMicOn.current = state;
  //   if (!state && isRecording.current) {
  //     stopRecording();
  //   } else if (state && !isRecording.current && isCallActive.current) {
  //     startRecording();
  //   }
  // }, [stopRecording, startRecording]);

  const setMicState = useCallback((state) => {
    console.log("This is mic state: ", state)
    isMicOn.current = state;
    if (!state && isRecording.current) {
      console.log("stopping recording")
      stopRecording();
    } else if (state && !isRecording.current) {
      console.log("Mic and recording was off and wants to turn on")
      startRecording();
    }
  }, [stopRecording, startRecording]);
  
  const setCallState = useCallback((state) => {
    isCallActive.current = state;
    if (!state && isRecording.current) {
      stopRecording();
    }
  }, [stopRecording]);

  useEffect(() => {
    console.log("Recording state changed:", recording);
  }, [recording]);

  return { isRecording: isRecording.current, recording, toggleRecording, text, response, setMicState, setCallState, responding, setRespondingState, isResponding: isResponding.current };
};