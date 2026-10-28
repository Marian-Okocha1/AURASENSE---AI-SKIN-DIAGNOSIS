import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Camera,
  Mic,
  MicOff,
  Globe,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { LanguageOption } from '../types';
import { LANGUAGES } from '../data/languages';
import { SKIN_PRESETS } from '../data/mockData';

interface LeftPanelInputVoiceProps {
  voiceContext: string;
  onVoiceChange: (val: string) => void;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
  onApplyContext: () => void;
  onImageUploaded: (imgUrl: string) => void;
  onSelectPreset: (presetName: string) => void;
  activePresetName: string;
}

export const LeftPanelInputVoice: React.FC<LeftPanelInputVoiceProps> = ({
  voiceContext,
  onVoiceChange,
  selectedLanguage,
  onSelectLanguage,
  onApplyContext,
  onImageUploaded,
  onSelectPreset,
  activePresetName,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition safely with Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
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
          onVoiceChange(
            voiceContext ? `${voiceContext.trim()} ${finalTrans.trim()}` : finalTrans.trim()
          );
          setInterimTranscript('');
        } else {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setRecognitionError('Microphone permission was denied by your browser.');
        } else {
          setRecognitionError(`Speech engine: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('SpeechRecognition initialization notice:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [selectedLanguage, onVoiceChange, voiceContext]);

  const handleToggleRecord = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setRecognitionError('Voice input is not supported in this browser environment.');
        return;
      }
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsRecording(false);
    } else {
      setRecognitionError(null);
      try {
        recognitionRef.current?.start();
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          setRecognitionError('Microphone access denied. Please allow microphone permissions.');
        } else {
          // Restart instance if needed
          try {
            recognitionRef.current?.stop();
            setTimeout(() => {
              recognitionRef.current?.start();
            }, 150);
          } catch (_) {
            setRecognitionError('Microphone is active. Speak clearly into your mic.');
          }
        }
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUploaded(url);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUploaded(url);
    }
  };

  return (
    <div className="studio-card rounded-2xl p-5 flex flex-col gap-5 border border-[#374151] shadow-xl bg-[#1f2937] text-[#F9FAFB]">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400/50" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
            01. Client Intake & Voice
          </h3>
        </div>
        <span className="text-[11px] font-mono-numbers text-slate-400 font-medium">Step 1 of 3</span>
      </div>

      {/* Image Uploader & Live Camera */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
          <span>Facial Photo Intake</span>
          <span className="text-[10px] text-cyan-400 font-mono-numbers">HD Biometrics</span>
        </label>

        {/* Drag & Drop Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-950/30'
              : 'border-[#374151] hover:border-cyan-500/60 bg-[#111827] hover:bg-[#161f2e]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-[#1f2937] border border-[#374151] flex items-center justify-center text-cyan-400 mb-2 shadow-sm">
            <Upload className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-xs font-semibold text-[#F9FAFB]">
            Drop your facial photo here
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            or click to browse files
          </span>
        </div>

        {/* Live Camera Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#111827] hover:bg-[#283344] text-[#F9FAFB] border border-[#374151] transition-colors shadow-sm"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>Live Camera Capture</span>
        </button>

        {/* Skin Profile Selector */}
        <div className="pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Or choose skin profile:</span>
          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
            {SKIN_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => onSelectPreset(p.name)}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border text-left transition-all ${
                  activePresetName === p.name
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-md'
                    : 'border-[#374151] bg-[#111827] text-slate-300 hover:border-cyan-500/50 hover:bg-[#283344]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Context Assistant */}
      <div className="pt-3 border-t border-[#374151] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#F9FAFB] flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Voice Context Assistant</span>
          </label>

          {/* Expanded Multi-lingual Dropdown */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedLanguage.code}
              onChange={(e) => {
                const found = LANGUAGES.find((l) => l.code === e.target.value);
                if (found) onSelectLanguage(found);
              }}
              className="text-[11px] font-medium bg-[#111827] border border-[#374151] text-[#F9FAFB] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer shadow-sm"
            >
              <optgroup label="Global Languages" className="bg-[#1f2937] text-white">
                {LANGUAGES.slice(0, 10).map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Regional African Languages" className="bg-[#1f2937] text-white">
                {LANGUAGES.slice(10).map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Live "🔴 Recording..." Indicator Banner */}
        {isRecording && (
          <div className="p-2.5 bg-red-950/60 border border-red-500/60 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-red-200">
                🔴 Recording... Speak now
              </span>
              <div className="flex items-center gap-0.5 h-4 px-1.5 bg-red-900/60 rounded">
                <div className="w-1 bg-red-400 rounded audio-bar-1" />
                <div className="w-1 bg-red-400 rounded audio-bar-2" />
                <div className="w-1 bg-red-400 rounded audio-bar-3" />
                <div className="w-1 bg-red-400 rounded audio-bar-4" />
              </div>
            </div>
            <button
              onClick={handleToggleRecord}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold rounded shadow-sm"
            >
              Stop
            </button>
          </div>
        )}

        {recognitionError && (
          <div className="p-2 bg-amber-950/50 border border-amber-500/50 rounded-lg flex items-center gap-1.5 text-[11px] text-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{recognitionError}</span>
          </div>
        )}

        {/* Text Field for Occasion & Concerns */}
        <div className="relative">
          <textarea
            rows={3}
            value={voiceContext}
            onChange={(e) => onVoiceChange(e.target.value)}
            placeholder={`e.g. "${selectedLanguage.samplePhrase}"`}
            dir={selectedLanguage.rtl ? 'rtl' : 'ltr'}
            className="w-full text-xs bg-[#111827] border border-[#374151] text-[#F9FAFB] rounded-xl p-3 pr-28 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 placeholder:text-slate-500 transition-all shadow-sm"
          />

          {/* Microphone Action Button */}
          <div className="absolute right-2.5 bottom-2.5">
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isRecording
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-md shadow-cyan-500/20'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-white" />
                  <span>Use Mic</span>
                </>
              )}
            </button>
          </div>
        </div>

        {interimTranscript && (
          <div className="text-[11px] text-cyan-300 italic">
            Transcribing: &ldquo;{interimTranscript}&rdquo;
          </div>
        )}

        {/* Quick Context Prompt & Apply Action */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => onVoiceChange(selectedLanguage.samplePhrase)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 text-left line-clamp-1 underline underline-offset-2"
          >
            Insert sample: &ldquo;{selectedLanguage.samplePhrase}&rdquo;
          </button>

          <button
            onClick={onApplyContext}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold bg-[#111827] hover:bg-[#283344] text-[#F9FAFB] border border-[#374151] hover:border-cyan-500/50 shadow-sm transition-all active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Feed Context into AI Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
