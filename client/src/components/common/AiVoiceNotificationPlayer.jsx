import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Languages,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  SUPPORTED_VOICE_LANGUAGES,
  translateNotificationText,
  generateSpokenNotificationScript,
  globalVoiceCoordinator,
  getBestVoiceForLanguage,
  estimateDurationSeconds,
} from '../../services/voiceTranslationService.js';

export const AiVoiceNotificationPlayer = ({
  enquiry,
  initialExpanded = false,
  className = '',
}) => {
  const { lang: appLang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [selectedLang, setSelectedLang] = useState(() => {
    return ['te', 'hi', 'en', 'ta', 'kn', 'bn'].includes(appLang) ? appLang : 'te';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const timerRef = useRef(null);
  const utteranceRef = useRef(null);

  const customerName =
    enquiry?.customerContact?.name ||
    enquiry?.customerId?.displayName ||
    'Customer';
  const locality = enquiry?.locality || '';
  const categoryName = enquiry?.categoryId?.name || 'Service';
  const originalMessage = enquiry?.message || '';
  const preferredTime = enquiry?.preferredTime || '';

  // Generate translated text and full spoken script
  const translatedMessage = translateNotificationText(originalMessage, selectedLang);
  const spokenScript = generateSpokenNotificationScript({
    customerName,
    locality,
    categoryName,
    message: originalMessage,
    preferredTime,
    lang: selectedLang,
  });

  // Calculate dynamic duration based on script length
  useEffect(() => {
    const est = estimateDurationSeconds(spokenScript, 0.92);
    setDuration(est);
  }, [spokenScript]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (globalVoiceCoordinator.isActive(enquiry?._id)) {
        globalVoiceCoordinator.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enquiry?._id]);

  // Stop playback handler
  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  // Play / Resume speech
  const handlePlayOrResume = () => {
    setErrorMessage('');

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setErrorMessage(
        'Speech synthesis is not supported on this browser. Please use Chrome, Edge, Safari, or Firefox.'
      );
      return;
    }

    // If currently paused, resume
    if (isPaused && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      startTimer();
      return;
    }

    // Otherwise, start fresh playback
    handleStop();

    // Register with global coordinator to stop any other card from playing simultaneously
    globalVoiceCoordinator.registerActive(enquiry?._id, () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
    });

    try {
      const utterance = new SpeechSynthesisUtterance(spokenScript);
      const voiceConfig =
        SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === selectedLang) ||
        SUPPORTED_VOICE_LANGUAGES[0];

      utterance.lang = voiceConfig.voiceLang;
      utterance.rate = 0.92; // Slightly slower, highly clear articulation
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : volume;

      const matchedVoice = getBestVoiceForLanguage(selectedLang);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentTime(0);
        startTimer();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(duration);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsPlaying(false);
        setIsPaused(false);
        if (timerRef.current) clearInterval(timerRef.current);

        // If error isn't just user cancellation
        if (e.error && e.error !== 'canceled' && e.error !== 'interrupted') {
          setErrorMessage(
            `Unable to play voice audio (${e.error}). Please verify device volume or speech settings.`
          );
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to trigger speech:', err);
      setErrorMessage('Failed to trigger voice playback. Please check audio permissions.');
      setIsPlaying(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          clearInterval(timerRef.current);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Pause playback
  const handlePause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    handleStop();
    setTimeout(() => {
      handlePlayOrResume();
    }, 100);
  };

  // Change volume
  const handleVolumeChange = (newVol) => {
    const vol = parseFloat(newVol);
    setVolume(vol);
    setIsMuted(vol === 0);
    // If speaking, cancel and replay with new volume
    if (isPlaying) {
      handleReplay();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) setVolume(1);
    } else {
      setIsMuted(true);
    }
  };

  // Language switch
  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    handleStop();
    // If user was actively listening, seamlessly restart in new language
    if (isPlaying || isExpanded) {
      setTimeout(() => {
        handlePlayOrResume();
      }, 150);
    }
  };

  // Format seconds mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 1. Large, Prominent Teal "Listen to Notification" Button */}
      {!isExpanded ? (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(true);
              handlePlayOrResume();
            }}
            className="w-full group relative overflow-hidden inline-flex items-center justify-between gap-3 px-5 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-teal-500/80 focus:outline-none focus:ring-4 focus:ring-teal-400/40"
            aria-label="Listen to voice notification in your language"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                <Volume2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="block text-sm sm:text-base font-extrabold tracking-tight">
                  🔊 Listen to Notification
                </span>
                <span className="block text-xs text-teal-100 font-medium">
                  {selectedLang === 'te'
                    ? 'వాయిస్ నోటిఫికేషన్ వినండి (తెలుగు)'
                    : selectedLang === 'hi'
                    ? 'आवाज़ में सूचना सुनें (हिन्दी)'
                    : selectedLang === 'ta'
                    ? 'குரல் அறிவிப்பைக் கேளுங்கள் (தமிழ்)'
                    : selectedLang === 'kn'
                    ? 'ಧ್ವನಿ ಅಧಿಸೂಚನೆ ಕೇಳಿ (ಕನ್ನಡ)'
                    : 'Hear spoken audio in your language'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-lg border border-white/20 hidden sm:inline-block">
                AI Voice Sahayak
              </span>
              <span className="w-8 h-8 rounded-full bg-white text-teal-700 flex items-center justify-center shadow-sm">
                <Play className="w-4 h-4 ml-0.5 fill-teal-700" />
              </span>
            </div>
          </button>
        </div>
      ) : (
        /* 2. Expanded Interactive Voice Control Center */
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border-2 border-teal-500 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Top Bar: Title, Active Status, and Minimize Button */}
          <div className="flex items-center justify-between border-b border-teal-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-navy-950 flex items-center gap-1.5">
                  <span>AI Voice Notification Player</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white uppercase tracking-wider">
                    Live Speech
                  </span>
                </h4>
                <p className="text-[11px] text-teal-800 font-medium">
                  Clear, natural spoken voice for workers with limited literacy.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleStop();
                setIsExpanded(false);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-teal-100 transition cursor-pointer"
              title="Close voice player"
              aria-label="Close voice player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message if Speech Synthesis fails */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Tip: Make sure system media volume is unmuted or try another language.
                </p>
              </div>
            </div>
          )}

          {/* 3. Language Selector Supporting Telugu, Hindi, English, Tamil, Kannada, Bengali */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-teal-600" />
                <span>Spoken Language / భాష / भाषा:</span>
              </label>
              <span className="text-[11px] font-semibold text-teal-700">
                Auto-Translated Speech
              </span>
            </div>

            {/* Language Quick Pills */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {SUPPORTED_VOICE_LANGUAGES.map((langItem) => {
                const isSelected = selectedLang === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    type="button"
                    onClick={() => handleLanguageChange(langItem.code)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm scale-102 ring-2 ring-teal-400/40'
                        : 'bg-white text-slate-700 hover:bg-teal-50 border-slate-200'
                    }`}
                  >
                    <span className="text-xs leading-none">{langItem.name}</span>
                    <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                      {langItem.localName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Notification Texts Display: Original & Translated Audio Script */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Original Customer Message */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Original Customer Message:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-navy-950 leading-relaxed">
                "{originalMessage}"
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Customer: <strong className="text-slate-800">{customerName}</strong></span>
                {locality && <span>• Locality: <strong className="text-slate-800">{locality}</strong></span>}
                {preferredTime && <span>• Time: <strong className="text-slate-800">{preferredTime}</strong></span>}
              </div>
            </div>

            {/* Translated Spoken Script (for non-English or selected language) */}
            <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    Spoken Voice Script (
                    {SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === selectedLang)?.localName}
                    ):
                  </span>
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                  TTS Script
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                "{spokenScript}"
              </p>
            </div>
          </div>

          {/* 5. Playback Deck: Progress Bar, Time Display & Soundwave Visualizer */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            {/* Progress Bar & Counter */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">
                    {formatTime(currentTime)}
                  </span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Animated Soundwave Equalizer while speaking */}
                {isPlaying && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-teal-50 rounded-md border border-teal-200">
                    <span className="text-[10px] font-sans font-semibold text-teal-700 mr-1">
                      Speaking...
                    </span>
                    <span className="w-1 h-3.5 bg-teal-600 rounded-full animate-bounce" />
                    <span className="w-1 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-4 bg-teal-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <span className="w-1 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-3.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              {/* Seek / Progress Bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Control Buttons & Volume Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Play / Pause / Replay Buttons */}
              <div className="flex items-center gap-2">
                {/* Main Play / Pause Button */}
                <button
                  type="button"
                  onClick={isPlaying ? handlePause : handlePlayOrResume}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
                  aria-label={isPlaying ? 'Pause notification' : 'Play notification'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isPaused ? 'Resume' : 'Play'}</span>
                    </>
                  )}
                </button>

                {/* Replay Button */}
                <button
                  type="button"
                  onClick={handleReplay}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="Replay from beginning"
                  aria-label="Replay audio notification"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay</span>
                </button>
              </div>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-slate-600 hover:text-teal-600 cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-teal-600" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(e.target.value)}
                  className="w-16 sm:w-20 accent-teal-600 h-1.5 cursor-pointer"
                  aria-label="Audio Volume Slider"
                />

                <span className="text-[10px] font-mono font-bold text-slate-500 w-7 text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiVoiceNotificationPlayer;
