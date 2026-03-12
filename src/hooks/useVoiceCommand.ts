import { useEffect, useRef, useState } from "react";

const TRIGGER_WORDS = ["help me", "emergency", "help", "save me"];

export function useVoiceCommand(onTrigger: () => void) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      const transcript = last[0].transcript.toLowerCase().trim();
      if (TRIGGER_WORDS.some((w) => transcript.includes(w))) {
        onTrigger();
      }
    };

    recognition.onend = () => {
      if (listening) {
        try { recognition.start(); } catch {}
      }
    };

    return () => {
      try { recognition.stop(); } catch {}
    };
  }, [onTrigger, listening]);

  const startListening = () => {
    setListening(true);
    try { recognitionRef.current?.start(); } catch {}
  };

  const stopListening = () => {
    setListening(false);
    try { recognitionRef.current?.stop(); } catch {}
  };

  return { listening, startListening, stopListening };
}
