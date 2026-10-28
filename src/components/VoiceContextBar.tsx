import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe, Sparkles, AlertCircle } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { LanguageOption } from '../types';

interface VoiceContextBarProps {
  value: string;
  onChange: (val: string) => void;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
  onApplyContext: () => void;
}

export const VoiceContextBar: React.FC<VoiceContextBarProps> = ({
  value,
  onChange,
  selectedLanguage,
  onSelectLanguage,
  onApplyContext,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage.speechCode || 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecognitionError(null);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalTrans) {
          onChange(value ? `${value.trim()} ${finalTrans.trim()}` : finalTrans.trim());
          setInterimTranscript('');
        } else {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setRecognitionError('Microphone permission denied in browser.');
        } else if (event.error === 'no-speech') {
          setRecognitionError('No speech detected. Please speak closer to your mic.');
        } else {
          setRecognitionError(`Speech recognition: ${event.error}. You can also use the sample prompt.`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [selectedLanguage.speechCode]);

  const handleToggleRecord = async () => {
    setRecognitionError(null);

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsRecording(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (permErr) {
      setRecognitionError('Microphone access denied. You can still test with the sample phrase or type directly.');
      return;
    }

    if (recognitionRef.current && isSpeechSupported) {
      try {
        recognitionRef.current.lang = selectedLanguage.speechCode;
        recognitionRef.current.start();
      } catch (err: any) {
        simulateSpeechRecording();
      }
    } else {
      simulateSpeechRecording();
    }
  };

  const simulateSpeechRecording = () => {
    setIsRecording(true);
    setInterimTranscript(`Listening in ${selectedLanguage.name}...`);
    setTimeout(() => {
      onChange(selectedLanguage.samplePhrase);
      setInterimTranscript('');
      setIsRecording(false);
    }, 2200);
  };

  const handleUseSamplePhrase = () => {
    onChange(selectedLanguage.samplePhrase);
    setRecognitionError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Voice Context & Occasion Intake</span>
            <span className="text-xs font-normal text-slate-500">
              (Multi-Lingual)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe your event or skin concerns in your native language to adapt your diagnostic regimen.
          </p>
        </div>

        {/* Multi-lingual Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="language-select" className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Language:</span>
          </label>
          <select
            id="language-select"
            value={selectedLanguage.code}
            onChange={(e) => {
              const found = LANGUAGES.find((l) => l.code === e.target.value);
              if (found) onSelectLanguage(found);
            }}
            className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer"
          >
            <optgroup label="Global Languages">
              {LANGUAGES.slice(0, 10).map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} — {lang.nativeName}
                </option>
              ))}
            </optgroup>
            <optgroup label="Regional African Languages">
              {LANGUAGES.slice(10).map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} — {lang.nativeName}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Recording Status & Error Notices */}
      {isRecording && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>🔴 Recording... Speak now</span>
            </span>
            <div className="flex items-center gap-1 h-5 px-2 bg-rose-100 rounded-md">
              <div className="w-1 bg-rose-600 rounded-full audio-bar-1" />
              <div className="w-1 bg-rose-600 rounded-full audio-bar-2" />
              <div className="w-1 bg-rose-600 rounded-full audio-bar-3" />
              <div className="w-1 bg-rose-600 rounded-full audio-bar-4" />
              <div className="w-1 bg-rose-600 rounded-full audio-bar-5" />
            </div>
            <span className="text-xs text-rose-600 italic">
              Listening in {selectedLanguage.name}...
            </span>
          </div>
          <button
            onClick={handleToggleRecord}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md transition-colors"
          >
            Stop
          </button>
        </div>
      )}

      {recognitionError && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{recognitionError}</span>
          </div>
        </div>
      )}

      {/* Text Input Box & Action Controls */}
      <div className="mt-4 space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`e.g. "${selectedLanguage.samplePhrase}"`}
            dir={selectedLanguage.rtl ? 'rtl' : 'ltr'}
            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-3 pr-28 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 placeholder:text-slate-400 transition-colors"
          />

          {/* Micro Recording Action Trigger */}
          <div className="absolute right-2.5 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-300" />
                  <span>Start Voice Input</span>
                </>
              )}
            </button>
          </div>
        </div>

        {interimTranscript && (
          <div className="text-xs text-slate-500 italic pl-1">
            Transcribing: &ldquo;{interimTranscript}&rdquo;
          </div>
        )}

        {/* Quick Language Sample Chips & Match Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap text-slate-500">
            <span>Quick phrase in {selectedLanguage.name}:</span>
            <button
              onClick={handleUseSamplePhrase}
              className="text-slate-700 hover:text-slate-900 font-medium underline underline-offset-2 text-left line-clamp-1 max-w-md"
              title="Click to insert sample context"
            >
              &ldquo;{selectedLanguage.samplePhrase}&rdquo;
            </button>
          </div>

          <button
            onClick={onApplyContext}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition-colors flex items-center gap-1.5 ml-auto shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Update AI Diagnostics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
