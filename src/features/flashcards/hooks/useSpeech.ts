import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load available system voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (
      text: string,
      audioUrl?: string,
      options: UseSpeechOptions = {},
      onEnd?: () => void
    ) => {
      stop();

      // If a custom audio file is provided, prioritize it
      if (audioUrl) {
        try {
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          setIsSpeaking(true);

          audio.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            onEnd?.();
          };

          audio.onerror = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            // Fallback to Web Speech API
            speakWebSpeech(text, options, onEnd);
          };

          audio.play().catch(() => {
            speakWebSpeech(text, options, onEnd);
          });
          return;
        } catch {
          // Fall through to Web Speech API
        }
      }

      speakWebSpeech(text, options, onEnd);
    },
    [stop, voices]
  );

  const speakWebSpeech = (
    text: string,
    options: UseSpeechOptions = {},
    onEnd?: () => void
  ) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    const cleanText = text.replace(/[`*_[\]()#]/g, '').trim();
    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    // Detect language: check for Vietnamese diacritics
    const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/.test(
      cleanText
    );
    const targetLang = options.lang && options.lang !== 'auto'
      ? options.lang
      : isVietnamese
      ? 'vi-VN'
      : 'en-US';

    utterance.lang = targetLang;

    // Match best voice
    const matchedVoice = voices.find((v) => v.lang.startsWith(targetLang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  return { speak, stop, isSpeaking, voices };
}
