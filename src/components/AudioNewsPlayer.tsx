import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, X, Gauge } from 'lucide-react';
import {
  speakHindiText,
  pauseHindiSpeech,
  resumeHindiSpeech,
  stopHindiSpeech,
  isSpeechSupported,
} from '../utils/hindiHelpers';

interface AudioNewsPlayerProps {
  title: string;
  textToRead: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const AudioNewsPlayer: React.FC<AudioNewsPlayerProps> = ({
  title,
  textToRead,
  isOpen,
  onClose,
  className = '',
}) => {
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Estimate total listening duration (Hindi avg ~130 words per minute at 1.0x)
  const wordCount = (textToRead || '').trim().split(/\s+/).length;
  const estimatedTotalSeconds = Math.max(15, Math.round((wordCount / (130 * speechRate)) * 60));

  // Timer ticker
  useEffect(() => {
    if (playbackState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => Math.min(prev + 1, estimatedTotalSeconds));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playbackState, estimatedTotalSeconds]);

  // Clean up when unmounting or closed
  useEffect(() => {
    return () => {
      stopHindiSpeech();
    };
  }, []);

  useEffect(() => {
    if (!isOpen && playbackState !== 'idle') {
      stopHindiSpeech();
      setPlaybackState('idle');
      setElapsedSeconds(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlay = (rateOverride?: number) => {
    const rateToUse = rateOverride ?? speechRate;
    stopHindiSpeech();
    setPlaybackState('playing');
    speakHindiText(
      textToRead,
      () => {
        setPlaybackState('idle');
        setElapsedSeconds(0);
      },
      {
        rate: rateToUse,
        onStart: () => setPlaybackState('playing'),
        onError: () => setPlaybackState('idle'),
      }
    );
  };

  const handlePause = () => {
    pauseHindiSpeech();
    setPlaybackState('paused');
  };

  const handleResume = () => {
    resumeHindiSpeech();
    setPlaybackState('playing');
  };

  const handleStop = () => {
    stopHindiSpeech();
    setPlaybackState('idle');
    setElapsedSeconds(0);
  };

  const handleSpeedChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (playbackState === 'playing') {
      // Restart speech with new rate
      handlePlay(newRate);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, Math.round((elapsedSeconds / estimatedTotalSeconds) * 100));

  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-xs p-3 sm:p-3.5 shadow-2xs transition-all ${className}`}
      role="region"
      aria-label="ऑडियो बुलेटिन प्लेयर"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: Indicator & Headline info */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                खबर सुनें <span className="text-[10px] text-red-600 font-semibold">(ऑडियो बुलेटिन)</span>
              </span>

              {/* Minimalist animated soundwave indicator */}
              {playbackState === 'playing' ? (
                <div className="flex items-end space-x-0.5 h-3 px-1" title="ऑडियो सक्रिय है">
                  <span className="w-0.5 bg-red-600 rounded-full animate-pulse h-2" />
                  <span className="w-0.5 bg-red-600 rounded-full animate-pulse delay-75 h-3" />
                  <span className="w-0.5 bg-red-600 rounded-full animate-pulse delay-150 h-1.5" />
                  <span className="w-0.5 bg-red-600 rounded-full animate-pulse delay-100 h-2.5" />
                </div>
              ) : playbackState === 'paused' ? (
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  रोका गया
                </span>
              ) : null}
            </div>

            <p className="text-[11px] text-slate-500 truncate max-w-[240px] sm:max-w-xs" title={title}>
              {title}
            </p>
          </div>
        </div>

        {/* Right: Controls & Speed Selector */}
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 shrink-0">
          {/* Play/Pause/Stop Buttons */}
          <div className="flex items-center space-x-1">
            {playbackState === 'idle' ? (
              <button
                type="button"
                onClick={() => handlePlay()}
                className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
                title="खबर सुनना शुरू करें"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>सुनें</span>
              </button>
            ) : playbackState === 'playing' ? (
              <button
                type="button"
                onClick={handlePause}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
                title="रोकें (Pause)"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>रोकें</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResume}
                className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
                title="पुनः शुरू करें"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>चालू रखें</span>
              </button>
            )}

            {playbackState !== 'idle' && (
              <button
                type="button"
                onClick={handleStop}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                title="बंद करें (Stop)"
              >
                <Square className="w-3.5 h-3.5 fill-current text-slate-600" />
              </button>
            )}
          </div>

          {/* Speed Selector (0.75x, 1x, 1.25x) */}
          <div className="flex items-center space-x-1 bg-slate-100/90 rounded-md p-0.5 border border-slate-200">
            {[0.75, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleSpeedChange(rate)}
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold transition cursor-pointer ${
                  speechRate === rate
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title={`गति: ${rate}x`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Time indicator */}
          <span className="text-[11px] font-mono text-slate-500 tabular-nums shrink-0">
            {formatTime(elapsedSeconds)} / {formatTime(estimatedTotalSeconds)}
          </span>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="ऑडियो प्लेयर छुपाएं"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar (Minimalist 1px hairline bar) */}
      {playbackState !== 'idle' && (
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-2.5">
          <div
            className="bg-red-600 h-full rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
