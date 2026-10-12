'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  HardDrive,
  Check,
  X,
  Maximize2,
  Sparkles,
  Info,
} from 'lucide-react';
import { MediaItem } from './MediaLibraryModal';
import { useTheme } from '@/components/ThemeProvider';

export default function MediaLibraryTab() {
  const { isNight } = useTheme();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'uploads' | 'presets'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
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
    fetchMedia();
  }, []);

  const handleFileUpload = async (files: FileList | File[]) => {
    setUploadError(null);

    const fileList = Array.from(files);
    const allowed = ['.jpeg', '.jpg', '.png', '.webp'];

    for (const file of fileList) {
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      const isDoc = ['.pdf', '.docx', '.doc'].includes(ext) || file.type.includes('pdf') || file.type.includes('word');
      if (isDoc || !allowed.includes(ext)) {
        setUploadError(`"${file.name}": Only JPEG, PNG, JPG, and WEBP photos are allowed. PDF and DOCX files are not permitted.`);
        return;
      }
    }

    setUploading(true);

    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'photo');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          setUploadError(json.error || `Failed to upload ${file.name}`);
          break;
        }
      }
      await fetchMedia();
    } catch {
      setUploadError('Network error while uploading photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (item: MediaItem) => {
    if (item.folder !== 'uploads') return;
    if (!confirm(`Are you sure you want to delete "${item.name}" from uploaded media?`)) return;

    try {
      const res = await fetch(`/api/upload?file=${encodeURIComponent(item.name)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (previewItem?.url === item.url) {
          setPreviewItem(null);
        }
        await fetchMedia();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const uploadedCount = items.filter((i) => i.folder === 'uploads').length;
  const presetsCount = items.filter((i) => i.folder === 'presets').length;

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'all' || item.folder === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hidden File Input for Toolbar Upload Button */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept=".jpeg,.jpg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFileUpload(e.target.files);
          }
          e.target.value = '';
        }}
      />

      {uploadError && (
        <div className="px-4 py-2 bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono">
          {uploadError}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className={`${
        isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-[#F9F8F5] border-[#E2DFD7] shadow-sm'
      } border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isNight ? 'text-[#5D6B7A]' : 'text-[#7D8B9B]'}`} />
            <input
              type="text"
              placeholder="Search by filename or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 ${
                isNight
                  ? 'bg-[#121821] border-[#212C3A] text-white placeholder-[#546170]'
                  : 'bg-white border-[#D6D3C8] text-[#12161A] placeholder-[#8C98A5]'
              } border text-xs font-mono outline-none focus:border-[#FFC107]`}
            />
          </div>

          {/* Filter Pills */}
          <div className={`flex items-center ${isNight ? 'bg-[#10161E] border-[#1E2835]' : 'bg-[#EDECE6] border-[#D6D3C8]'} border p-1 text-xs font-mono`}>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#FFC107] text-[#0A0D0F] font-bold'
                  : isNight ? 'text-[#8492A2] hover:text-white' : 'text-[#647180] hover:text-[#12161A]'
              }`}
            >
              All Assets ({items.length})
            </button>
            <button
              onClick={() => setFilter('uploads')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                filter === 'uploads'
                  ? 'bg-[#FFC107] text-[#0A0D0F] font-bold'
                  : isNight ? 'text-[#8492A2] hover:text-white' : 'text-[#647180] hover:text-[#12161A]'
              }`}
            >
              Uploaded ({uploadedCount})
            </button>
            <button
              onClick={() => setFilter('presets')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                filter === 'presets'
                  ? 'bg-[#FFC107] text-[#0A0D0F] font-bold'
                  : isNight ? 'text-[#8492A2] hover:text-white' : 'text-[#647180] hover:text-[#12161A]'
              }`}
            >
              Site Presets ({presetsCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFC107] hover:bg-[#E6A900] disabled:opacity-50 text-[#0A0D0F] font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs shrink-0"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Upload Photos</span>
              </>
            )}
          </button>
          <div className={`text-[11px] font-mono ${isNight ? 'text-[#6A7888]' : 'text-[#7D8B9B]'}`}>
            Showing {filteredItems.length} of {items.length} assets
          </div>
        </div>
      </div>

      {/* Grid of Photos */}
      {loading ? (
        <div className={`flex flex-col items-center justify-center py-24 ${isNight ? 'text-[#606E7F]' : 'text-[#7D8B9B]'} font-mono text-xs gap-3`}>
          <Loader2 className="w-8 h-8 animate-spin text-[#FFC107]" />
          <span>Loading Brahmani Media Catalog...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={`p-16 border border-dashed ${
          isNight ? 'border-[#1E2734] bg-[#0C1016]' : 'border-[#D6D3C8] bg-[#F9F8F5]'
        } text-center`}>
          <ImageIcon className={`w-12 h-12 ${isNight ? 'text-[#3D4956]' : 'text-[#A5B2C0]'} mx-auto mb-3`} />
          <h4 className={`text-sm font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} mb-1`}>No media files found</h4>
          <p className={`text-xs font-mono ${isNight ? 'text-[#6D7B8C]' : 'text-[#647180]'} mb-4`}>
            Try adjusting your search query or upload a new photo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.url}
              className={`group ${
                isNight
                  ? 'bg-[#0C1016] border-[#1E2734]'
                  : 'bg-white border-[#E2DFD7] shadow-sm'
              } border hover:border-[#FFC107] transition-all flex flex-col overflow-hidden relative`}
            >
              {/* Image Thumbnail */}
              <div className={`relative aspect-[4/3] w-full ${isNight ? 'bg-[#06080B]' : 'bg-[#EDECE6]'} overflow-hidden`}>
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Folder Badge */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm text-[9px] font-mono text-[#9BA8B8] border border-white/10 z-10">
                  {item.folder === 'uploads' ? 'UPLOADED' : 'PRESET'}
                </div>

                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                  <button
                    onClick={() => setPreviewItem(item)}
                    title="Inspect photo in full size"
                    className="p-2 bg-[#141C25] hover:bg-[#1E2835] text-white border border-[#2B3A4C] transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopyUrl(item.url)}
                    title="Copy direct URL"
                    className="p-2 bg-[#141C25] hover:bg-[#1E2835] text-white border border-[#2B3A4C] transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {item.folder === 'uploads' && (
                    <button
                      onClick={() => handleDeleteItem(item)}
                      title="Delete uploaded photo"
                      className="p-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Info footer */}
              <div className={`p-3 ${
                isNight ? 'bg-[#090D12] border-[#161F2B]' : 'bg-[#F9F8F5] border-[#E8E5DC]'
              } border-t flex flex-col gap-1`}>
                <p className={`text-xs font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} truncate`} title={item.name}>
                  {item.name}
                </p>
                <div className={`flex items-center justify-between text-[10px] font-mono ${isNight ? 'text-[#617080]' : 'text-[#7D8B9B]'}`}>
                  <span>{formatFileSize(item.size)}</span>
                  {copiedUrl === item.url ? (
                    <span className="text-[#FFC107] font-bold">LINK COPIED!</span>
                  ) : (
                    <span className={`truncate max-w-[100px] ${isNight ? 'text-[#4D5A6A]' : 'text-[#8E9CA9]'}`}>
                      {new Date(item.modifiedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Full-screen Inspection Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${
                isNight ? 'bg-[#0C1016] border-[#232F3E]' : 'bg-white border-[#D6D3C8] shadow-2xl'
              } border max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col`}
            >
              <div className={`p-4 border-b ${
                isNight ? 'border-[#1A2532] bg-[#080B0F]' : 'border-[#E6E3DB] bg-[#F7F5F0]'
              } flex items-center justify-between`}>
                <div className="font-mono">
                  <h4 className={`text-sm font-bold ${isNight ? 'text-white' : 'text-[#12161A]'}`}>{previewItem.name}</h4>
                  <p className={`text-[11px] ${isNight ? 'text-[#718090]' : 'text-[#647180]'}`}>
                    {formatFileSize(previewItem.size)} &bull; Direct URL:{' '}
                    <span className="text-[#FFC107]">{previewItem.url}</span>
                  </p>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className={`p-1.5 ${isNight ? 'text-[#6B7B8B] hover:text-white' : 'text-[#7D8B9B] hover:text-[#12161A]'} cursor-pointer`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`relative w-full aspect-video ${isNight ? 'bg-[#050709]' : 'bg-[#EAE8E0]'} flex items-center justify-center overflow-hidden`}>
                <Image
                  src={previewItem.url}
                  alt={previewItem.name}
                  fill
                  className="object-contain"
                />
              </div>

              <div className={`p-4 border-t ${
                isNight ? 'border-[#1A2532] bg-[#0A0E13]' : 'border-[#E6E3DB] bg-[#F7F5F0]'
              } flex items-center justify-between font-mono text-xs`}>
                <button
                  onClick={() => handleCopyUrl(previewItem.url)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${
                    isNight
                      ? 'bg-[#141C25] hover:bg-[#1E2835] border-[#253242] text-white'
                      : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#12161A]'
                  } border cursor-pointer`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUrl === previewItem.url ? 'COPIED TO CLIPBOARD' : 'COPY DIRECT URL'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${
                      isNight
                        ? 'bg-[#182330] hover:bg-[#202E3F] text-[#FFC107] border-[#2A3B4E]'
                        : 'bg-[#EDECE6] hover:bg-[#E2DFD4] text-[#9E7400] border-[#D8D5CA]'
                    } border`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>OPEN FULL RESOLUTION</span>
                  </a>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="px-4 py-1.5 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] font-bold cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
