'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Video,
  Play,
  RotateCcw,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface VideoFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  defaultUrl?: string;
  placeholder?: string;
}

export default function VideoField({
  label,
  value,
  onChange,
  hint,
  defaultUrl,
  placeholder = '/videos/hero-day.mp4 or https://...',
}: VideoFieldProps) {
  const { isNight } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onChange(json.url);
        setVideoError(false);
      } else {
        setUploadError(json.error || 'Failed to upload video');
      }
    } catch {
      setUploadError('Network error while uploading video');
    } finally {
      setUploading(false);
    }
  };

  const hasVideo = Boolean(value && value.trim() && !videoError);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8E9CAE]' : 'text-[#3D4752] font-bold'} uppercase tracking-wider`}>
          {label}
        </label>
        {hint && (
          <span className={`text-[10px] font-mono ${isNight ? 'text-[#627080]' : 'text-[#66707A]'}`}>
            {hint}
          </span>
        )}
      </div>

      <div
        className={`p-3.5 border transition-all ${
          isNight
            ? 'bg-[#11161E] border-[#1F2B38]'
            : 'bg-[#F9F8F5] border-[#DEDBD2] shadow-xs'
        }`}
      >
        {/* Top: Video Player Preview & Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Video Preview Box */}
          <div
            className={`w-full md:w-60 aspect-video rounded-none border overflow-hidden relative shrink-0 flex items-center justify-center ${
              isNight
                ? 'bg-[#080B0F] border-[#222E3C]'
                : 'bg-[#0A0D0F] border-[#D0CDC3]'
            }`}
          >
            {hasVideo ? (
              <video
                key={value}
                src={value}
                controls
                muted
                playsInline
                preload="metadata"
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-3 text-zinc-500 font-mono text-[10px] space-y-1">
                <Video className="w-6 h-6 mx-auto opacity-40 text-amber-500" />
                <p>No video selected or invalid path</p>
              </div>
            )}
          </div>

          {/* Right Side: URL Input & Actions */}
          <div className="flex-1 w-full space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={value || ''}
                onChange={(e) => {
                  onChange(e.target.value);
                  setVideoError(false);
                }}
                placeholder={placeholder}
                className={`flex-1 text-xs px-3 py-2 border font-mono outline-none transition-colors ${
                  isNight
                    ? 'bg-[#0E131A] border-[#222D3B] text-white focus:border-[#FFC107]'
                    : 'bg-white border-[#D6D2C7] text-[#11161A] focus:border-[#FFC107]'
                }`}
              />

              {defaultUrl && value !== defaultUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(defaultUrl);
                    setVideoError(false);
                  }}
                  title="Reset to default video"
                  className={`px-2.5 py-2 border text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                    isNight
                      ? 'border-[#222D3B] text-[#8695A5] hover:text-[#FFC107] hover:border-[#FFC107]'
                      : 'border-[#D6D2C7] text-[#55626F] hover:text-[#11161A] hover:border-[#11161A] bg-white'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>

            {/* Upload Buttons & Status */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                  e.target.value = '';
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3.5 py-1.5 bg-[#FFC107] hover:bg-[#E6A900] disabled:opacity-50 text-[#0A0D0F] font-mono font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading Video...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Upload Video (MP4)</span>
                  </>
                )}
              </button>

              {hasVideo && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Video active</span>
                </span>
              )}
            </div>

            {uploadError && (
              <div className="p-2 bg-red-950/70 border border-red-800 text-red-300 text-[11px] font-mono flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
