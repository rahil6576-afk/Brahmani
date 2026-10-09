'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Search,
  Check,
  Trash2,
  Image as ImageIcon,
  Loader2,
  HardDrive,
  Copy,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export interface MediaItem {
  url: string;
  name: string;
  folder: 'uploads' | 'presets';
  size: number;
  modifiedAt: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
  title?: string;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  currentUrl,
  title = 'Select Photo Asset',
}: MediaLibraryModalProps) {
  const { isNight } = useTheme();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'uploads' | 'presets'>('all');
  const [selectedUrl, setSelectedUrl] = useState<string>(currentUrl || '');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/upload');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setItems(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentUrl || '');
      fetchMedia();
    }
  }, [isOpen, currentUrl]);

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
        setSelectedUrl(json.url);
        await fetchMedia();
      } else {
        setUploadError(json.error || 'Failed to upload photo');
      }
    } catch {
      setUploadError('Network error during photo upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    if (item.folder !== 'uploads') return;

    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;

    try {
      const res = await fetch(`/api/upload?file=${encodeURIComponent(item.name)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (selectedUrl === item.url) {
          setSelectedUrl('');
        }
        await fetchMedia();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCopyUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'all' || item.folder === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className={`w-full max-w-5xl ${
          isNight
            ? 'bg-[#090D12] border-[#1E2734]'
            : 'bg-white border-[#D6D3C8] shadow-2xl'
        } border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isNight
            ? 'border-[#18212C] bg-[#06090D]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${
              isNight ? 'bg-[#121820] border-[#222E3C]' : 'bg-[#EDECE6] border-[#D8D5CA]'
            } border flex items-center justify-center text-[#FFC107]`}>
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase tracking-wider`}>
                {title}
              </h3>
              <p className={`text-[11px] font-mono ${isNight ? 'text-[#6A7888]' : 'text-[#7D8B9B]'}`}>
                Brahmani Media Vault &bull; {items.length} Photos Available
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 ${
              isNight
                ? 'text-[#657383] hover:text-white hover:bg-[#121822] border-transparent hover:border-[#232F3D]'
                : 'text-[#7D8B9B] hover:text-[#12161A] hover:bg-[#EDECE6] border-transparent hover:border-[#D8D5CA]'
            } border transition-colors cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Filters */}
        <div className={`p-4 sm:p-5 border-b ${
          isNight
            ? 'border-[#18212C] bg-[#0A0E14]'
            : 'border-[#E6E3DB] bg-[#FAF9F6]'
        } flex flex-col sm:flex-row gap-3 sm:items-center justify-between shrink-0`}>
          {/* Search & Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isNight ? 'text-[#606D7D]' : 'text-[#7D8B9B]'}`} />
              <input
                type="text"
                placeholder="Search photos by filename..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 ${
                  isNight
                    ? 'bg-[#121821] border-[#202B38] text-white placeholder-[#546170]'
                    : 'bg-white border-[#D6D3C8] text-[#12161A] placeholder-[#8C98A5]'
                } border text-xs font-mono outline-none focus:border-[#FFC107]`}
              />
            </div>

            <div className={`flex items-center ${
              isNight ? 'bg-[#10161E] border-[#1E2835]' : 'bg-[#EDECE6] border-[#D6D3C8]'
            } border p-0.5 text-xs font-mono`}>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-[11px] transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#FFC107] text-[#0A0D0F] font-bold'
                    : isNight ? 'text-[#8492A2] hover:text-white' : 'text-[#647180] hover:text-[#12161A]'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilter('uploads')}
                className={`px-3 py-1 text-[11px] transition-colors cursor-pointer ${
                  filter === 'uploads'
                    ? 'bg-[#FFC107] text-[#0A0D0F] font-bold'
                    : isNight ? 'text-[#8492A2] hover:text-white' : 'text-[#647180] hover:text-[#12161A]'
                }`}
              >
                Uploaded ({items.filter((i) => i.folder === 'uploads').length})
              </button>
              <button
                onClick={() => setFilter('presets')}
                className={`px-3 py-1 text-[11px] transition-colors cursor-pointer ${
                  filter === 'presets'
                    ? 'bg-[#FFC107] text-[#0A0D0F] font-bold'
                    : isNight ? 'text-[#8492A2] hover:text-white' : 'text-[#647180] hover:text-[#12161A]'
                }`}
              >
                Presets ({items.filter((i) => i.folder === 'presets').length})
              </button>
            </div>
          </div>

          {/* Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/jpg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] font-bold text-xs font-mono tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(255,193,7,0.2)]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>UPLOADING PHOTO...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>UPLOAD NEW PHOTO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="px-5 py-2.5 bg-red-950/70 border-b border-red-800 text-red-300 text-xs font-mono flex items-center justify-between">
            <span>{uploadError}</span>
            <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-white">
              &times;
            </button>
          </div>
        )}

        {/* Photo Grid Viewport */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isNight ? 'bg-[#07090C]' : 'bg-[#FAF9F6]'}`}>
          {loading ? (
            <div className={`flex flex-col items-center justify-center py-20 ${isNight ? 'text-[#606E7F]' : 'text-[#7D8B9B]'} font-mono text-xs gap-3`}>
              <Loader2 className="w-6 h-6 animate-spin text-[#FFC107]" />
              <span>Scanning Media Vault...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-20 border border-dashed ${
              isNight ? 'border-[#1C2531]' : 'border-[#D6D3C8]'
            } text-center p-6`}>
              <ImageIcon className={`w-10 h-10 ${isNight ? 'text-[#404D5C]' : 'text-[#A5B2C0]'} mb-3`} />
              <p className={`text-sm font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} mb-1`}>No photos match your filter</p>
              <p className={`text-xs font-mono ${isNight ? 'text-[#6A7888]' : 'text-[#647180]'} mb-4`}>
                Upload a photo from your computer or adjust the search query.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-4 py-2 ${
                  isNight
                    ? 'bg-[#121822] hover:bg-[#1A232E] border-[#253242]'
                    : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA]'
                } border text-xs font-mono text-[#FFC107] cursor-pointer`}
              >
                + Upload Photo Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.url}
                    onClick={() => setSelectedUrl(item.url)}
                    className={`group relative ${
                      isNight ? 'bg-[#0C1016]' : 'bg-white'
                    } border transition-all cursor-pointer flex flex-col overflow-hidden ${
                      isSelected
                        ? 'border-[#FFC107] shadow-[0_0_20px_rgba(255,193,7,0.3)] ring-1 ring-[#FFC107]'
                        : isNight
                        ? 'border-[#1C242F] hover:border-[#2D3A4B]'
                        : 'border-[#E2DFD7] hover:border-[#B5B0A2] shadow-sm'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className={`relative aspect-square w-full ${isNight ? 'bg-[#06080B]' : 'bg-[#EDECE6]'} overflow-hidden`}>
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Selected check badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#FFC107] text-[#0A0D0F] flex items-center justify-center font-bold shadow-md z-10">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Folder pill */}
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm text-[9px] font-mono text-[#9BA8B8] border border-white/10 z-10">
                        {item.folder === 'uploads' ? 'UPLOAD' : 'PRESET'}
                      </div>

                      {/* Hover action bar */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                        <button
                          type="button"
                          onClick={(e) => handleCopyUrl(e, item.url)}
                          title="Copy image link"
                          className="p-1.5 bg-[#141C25] hover:bg-[#1E2835] text-white border border-[#2B3A4C] transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {item.folder === 'uploads' && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteItem(e, item)}
                            title="Delete uploaded photo"
                            className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className={`p-2.5 ${
                      isNight ? 'bg-[#090D12] border-[#161F2B]' : 'bg-[#F9F8F5] border-[#E8E5DC]'
                    } border-t flex flex-col gap-0.5`}>
                      <p
                        className={`text-[11px] font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} truncate`}
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <div className={`flex items-center justify-between text-[10px] font-mono ${isNight ? 'text-[#5E6D7E]' : 'text-[#7D8B9B]'}`}>
                        <span>{formatFileSize(item.size)}</span>
                        {copiedUrl === item.url && (
                          <span className="text-[#FFC107] font-bold">COPIED!</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          isNight
            ? 'border-[#18212C] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0`}>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7D8B9B] truncate max-w-lg">
            <span className={isNight ? 'text-[#A4B2C2]' : 'text-[#5C6B7B]'}>Selected:</span>
            <span className="text-[#FFC107] truncate font-bold">
              {selectedUrl || 'None chosen'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end font-mono text-xs">
            <button
              onClick={onClose}
              className={`px-4 py-2 ${
                isNight
                  ? 'bg-[#121821] hover:bg-[#1A222E] border-[#222E3C] text-[#8694A4]'
                  : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#5C6B7B]'
              } border transition-colors cursor-pointer`}
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                if (selectedUrl) {
                  onSelect(selectedUrl);
                  onClose();
                }
              }}
              disabled={!selectedUrl}
              className="px-5 py-2 bg-[#FFC107] hover:bg-[#E6A900] disabled:opacity-40 text-[#0A0D0F] font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(255,193,7,0.3)]"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>APPLY THIS PHOTO</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
