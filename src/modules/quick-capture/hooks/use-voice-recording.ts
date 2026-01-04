/**
 * Voice Recording Hook
 * Handles browser audio recording with fallbacks
 */

import { useState, useRef, useCallback } from "react";

export interface UseVoiceRecordingReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
}

export interface VoiceRecordingOptions {
  onAudioReady?: (base64Audio: string, mimeType: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceRecording(options: VoiceRecordingOptions = {}): UseVoiceRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);

    // Check browser support
    if (typeof MediaRecorder === "undefined") {
      const msg = "Voice input not supported in this browser";
      setError(msg);
      options.onError?.(msg);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Find supported mime type
      const preferredTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
      const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t));
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType || "audio/webm",
          });

          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = (reader.result as string).split(",")[1];
            options.onAudioReady?.(base64Audio, mediaRecorder.mimeType || "audio/webm");
          };
          reader.readAsDataURL(audioBlob);
        } finally {
          // Clean up stream
          streamRef.current?.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      const msg = "Microphone access denied";
      setError(msg);
      options.onError?.(msg);
    }
  }, [options]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
  };
}
