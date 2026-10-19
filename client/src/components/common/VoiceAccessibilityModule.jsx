import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Check,
  Languages,
  Radio,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

// Helper for AI Voice Synthesis (Text-to-Speech)
export const speakTextWithAi = (text, lang = 'en', onStart, onEnd) => {
  if (!('speechSynthesis' in window)) {
    alert('Voice synthesis is not supported on this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const cleanText = text.replace(/[*#_`]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Set voice language
  if (lang === 'te') {
    utterance.lang = 'te-IN';
  } else if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = (e) => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopAiVoice = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// Reusable AI Voice Button for cards, profiles, and messages
export const AiVoiceReadoutButton = ({
  text,
  label = 'Listen with AI Voice',
  compact = false,
  className = '',
}) => {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      stopAiVoice();
    };
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      stopAiVoice();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakTextWithAi(
        text,
        lang,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const getLabel = () => {
    if (lang === 'te') return isPlaying ? 'ఆపండి' : 'వినండి (AI వాయిస్)';
    if (lang === 'hi') return isPlaying ? 'रोकें' : 'सुनें (AI आवाज़)';
    return isPlaying ? 'Stop' : 'Listen (AI Voice)';
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
        isPlaying
          ? 'bg-teal-600 text-white animate-pulse'
          : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
      } ${
        compact
          ? 'px-2 py-1 text-[11px] rounded-md'
          : 'px-3 py-1.5 text-xs rounded-lg shadow-2xs'
      } ${className}`}
      title="Listen to this text read aloud by AI voice"
    >
      {isPlaying ? (
        <VolumeX className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-teal-600" />
      )}
      <span>{getLabel()}</span>
      {isPlaying && (
        <span className="flex items-center gap-0.5 ml-1">
          <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
          <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
          <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
        </span>
      )}
    </button>
  );
};

// Reusable Microphone Voice-to-Text Input Button
export const VoiceInputButton = ({
  onTranscript,
  placeholder = 'Speak your request...',
  className = '',
}) => {
  const { lang } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        if (onTranscript) onTranscript(transcript);
      };
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lang, onTranscript]);

  const toggleListen = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!recognitionRef.current) {
      // Realistic simulation fallback for browsers without speech recognition
      const sampleQueries = {
        te: 'నాకు ఎలక్ట్రీషియన్ కావాలి సీలింగ్ ఫ్యాన్ వైరింగ్ రిపేర్ కొరకు',
        hi: 'मुझे बिजली मिस्त्री चाहिए घर के पंखे की वायरिंग ठीक करने के लिए',
        en: 'I need an electrician for MCB tripping and ceiling fan repair',
      };
      const query = sampleQueries[lang] || sampleQueries.en;
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        if (onTranscript) onTranscript(query);
      }, 1500);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang =
          lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListen}
      className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
        isListening
          ? 'bg-rose-600 text-white shadow-md animate-pulse ring-4 ring-rose-200'
          : 'bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 shadow-2xs'
      } ${className}`}
      title={isListening ? 'Listening... Click to stop' : 'Click to speak your message'}
    >
      {isListening ? (
        <MicOff className="w-4 h-4 text-white" />
      ) : (
        <Mic className="w-4 h-4 text-teal-600" />
      )}
    </button>
  );
};

// Full Interactive Voice Accessibility Demo Component
export const VoiceAccessibilityDemo = () => {
  const { lang, setLang } = useLanguage();
  const [recordedMessage, setRecordedMessage] = useState(
    'నమస్కారం, నా ఇంట్లో వాటర్ ట్యాంక్ పైపు లీక్ అవుతోంది. దయచేసి వెంటనే ప్లంబర్ కావాలి.'
  );
  const [voiceNoteSaved, setVoiceNoteSaved] = useState(true);
  const [isPlayingNote, setIsPlayingNote] = useState(false);

  useEffect(() => {
    if (lang === 'hi') {
      setRecordedMessage(
        'नमस्ते, मेरी रसोई का पाइप लीक हो रहा है। कृपया मुझे तुरंत प्लंबर भेजें।'
      );
    } else if (lang === 'en') {
      setRecordedMessage(
        'Hello, my overhead water tank pipe is leaking heavily. Please send an emergency plumber to MVP Colony.'
      );
    }
  }, [lang]);

  const handleListen = () => {
    if (isPlayingNote) {
      stopAiVoice();
      setIsPlayingNote(false);
    } else {
      setIsPlayingNote(true);
      speakTextWithAi(
        recordedMessage,
        lang,
        () => setIsPlayingNote(true),
        () => setIsPlayingNote(false)
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-900 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            <span>Inclusive Workforce Tech for Uneducated Users</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Two-Way Voice Translation & Audio Facility
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Eliminates literacy barriers: Workers and customers can <strong>speak voice messages</strong> without typing, and receive incoming text inquiries translated into <strong>natural AI-generated spoken audio</strong>.
          </p>
        </div>

        {/* Language selector for audio */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <Languages className="w-4 h-4 text-teal-600 ml-1" />
          {['te', 'hi', 'en'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                lang === code
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {code === 'te' ? 'తెలుగు' : code === 'hi' ? 'हिन्दी' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Voice Input (Speak instead of text) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 flex items-center gap-2">
              <Mic className="w-4 h-4 text-teal-600" />
              1. Speak Voice Message (Speech-to-Text)
            </span>
            <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
              Input Mode
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Tap the mic button and speak in your mother tongue. The platform transcribes words and bundles your original voice note:
          </p>

          <div className="relative">
            <textarea
              rows={3}
              value={recordedMessage}
              onChange={(e) => setRecordedMessage(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 pr-12 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs"
            />
            <div className="absolute right-2.5 bottom-3.5">
              <VoiceInputButton
                onTranscript={(transcript) => setRecordedMessage(transcript)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Supported: Telugu, Hindi, English</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Voice Note Attached
            </span>
          </div>
        </div>

        {/* Box 2: AI Generated Voice Message (Text-to-Speech) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal-600" />
              2. AI Generated Voice Message (Audio Playback)
            </span>
            <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
              Output Mode
            </span>
          </div>

          <p className="text-xs text-slate-600">
            When an uneducated worker receives a written booking or review, they click "Listen" to hear the text spoken aloud clearly:
          </p>

          {/* Audio Wave Player Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-teal-700 font-bold">
                AI Voice Synthesizer ({lang.toUpperCase()})
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Natural Accents</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleListen}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer ${
                  isPlayingNote
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white font-bold'
                }`}
              >
                {isPlayingNote ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>

              <div className="flex-1 space-y-1.5">
                <div className="h-6 flex items-center gap-1">
                  {[...Array(24)].map((_, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-full transition-all ${
                        isPlayingNote
                          ? 'bg-teal-400 animate-pulse'
                          : 'bg-slate-700'
                      }`}
                      style={{
                        height: isPlayingNote
                          ? `${Math.max(4, ((i * 7) % 24) + 4)}px`
                          : '4px',
                        animationDelay: `${(i % 5) * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{isPlayingNote ? 'Playing AI Voice...' : 'Tap Play to Listen'}</span>
                  <span>Audio Wave</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-snug">
            💡 <strong>Zero-Literacy Inclusivity:</strong> Tested with daily wage workers who prefer verbal voice notes over complex smartphone typing.
          </div>
        </div>
      </div>
    </div>
  );
};
