'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Image as ImageIcon,
  FolderOpen,
  X,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import MediaLibraryModal from './MediaLibraryModal';

interface PhotoFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspectRatio?: 'landscape' | 'square' | 'wide' | 'auto';
  placeholder?: string;
}

export default function PhotoField({
  label,
  value,
  onChange,
  hint,
  aspectRatio = 'landscape',
  placeholder = '/images/... or https://...',
}: PhotoFieldProps) {
  const { isNight } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);

    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const allowed = ['.jpeg', '.jpg', '.png', '.webp'];
    const isDoc = ['.pdf', '.docx', '.doc'].includes(ext) || file.type.includes('pdf') || file.type.includes('word');

    if (isDoc || !allowed.includes(ext)) {
      setUploadError('Only JPEG, PNG, JPG, and WEBP photos are allowed. PDF and DOCX files are not permitted.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'photo');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onChange(json.url);
        setImgError(false);
      } else {
        setUploadError(json.error || 'Failed to upload photo');
      }
    } catch {
      setUploadError('Network error while uploading photo');
    } finally {
      setUploading(false);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square w-24 sm:w-28';
      case 'wide':
        return 'aspect-video w-36 sm:w-44';
      case 'landscape':
      default:
        return 'aspect-[4/3] w-28 sm:w-36';
    }
  };

  const hasImage = Boolean(value && value.trim() && !imgError);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8E9CAE]' : 'text-[#4B5663] font-semibold'} uppercase tracking-wider`}>
          {label}
        </label>
        {hint && (
          <span className={`text-[10px] font-mono ${isNight ? 'text-[#627080]' : 'text-[#66707A]'}`}>
            {hint}
          </span>
        )}
      </div>

      <div className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center ${
        isNight ? 'bg-[#0B0F15] border-[#1E2734]' : 'bg-[#FAF9F6] border-[#DDD9CE]'
      } border p-3`}>
        {/* Thumbnail Preview Area */}
        <div
          className={`relative ${getAspectClass()} shrink-0 ${
            isNight ? 'bg-[#06080B] border-[#232F3D]' : 'bg-white border-[#DDD9CE]'
          } border overflow-hidden flex items-center justify-center group`}
        >
          {hasImage ? (
            <>
              <Image
                src={value}
                alt={label}
                fill
                sizes="180px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-2 py-1 bg-[#FFC107] text-[#0A0D0F] text-[9px] font-mono font-bold"
                >
                  CHANGE
                </button>
              </div>
            </>
          ) : (
            <div className={`flex flex-col items-center justify-center p-2 text-center ${isNight ? 'text-[#4B5868]' : 'text-[#7D8895]'}`}>
              <ImageIcon className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-mono">No Image</span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-1 z-10">
              <Loader2 className="w-5 h-5 text-[#FFC107] animate-spin" />
              <span className="text-[9px] font-mono text-[#FFC107]">Uploading...</span>
            </div>
          )}
        </div>

        {/* Action Controls & Input */}
        <div className="flex-1 w-full space-y-2">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".jpeg,.jpg,.png,.webp,image/jpeg,image/png,image/webp"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC107] hover:bg-[#E6A900] disabled:opacity-50 text-[#0A0D0F] text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>UPLOAD PHOTO</span>
            </button>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${
                isNight
                  ? 'bg-[#141C25] hover:bg-[#1E2835] border-[#263444] text-[#A6B4C4] hover:text-white'
                  : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#333D47] hover:text-[#11161A]'
              } border text-xs font-mono transition-colors cursor-pointer`}
            >
              <FolderOpen className={`w-3.5 h-3.5 ${isNight ? 'text-[#FFC107]' : 'text-[#B28200]'}`} />
              <span>MEDIA LIBRARY</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setImgError(false);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 ${
                  isNight
                    ? 'bg-red-950/40 hover:bg-red-950/70 border-red-900/40 text-red-300'
                    : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                } border text-xs font-mono transition-colors cursor-pointer`}
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Direct URL text field */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setImgError(false);
              }}
              placeholder={placeholder}
              className={`flex-1 ${
                isNight
                  ? 'bg-[#121821] border-[#212C3B] text-white focus:border-[#FFC107]/50'
                  : 'bg-white border-[#DDD9CE] text-[#11161A] focus:border-[#FFC107]'
              } border text-xs px-3 py-1.5 outline-none font-mono`}
            />
          </div>

          {uploadError && (
            <p className="text-[11px] font-mono text-red-500">{uploadError}</p>
          )}
        </div>
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setImgError(false);
        }}
        currentUrl={value}
        title={`Select Photo for: ${label}`}
      />
    </div>
  );
}
