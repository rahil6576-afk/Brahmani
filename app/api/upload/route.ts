import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const PHOTO_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.webp'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm'];
const ALLOWED_EXTENSIONS = [...PHOTO_EXTENSIONS, ...VIDEO_EXTENSIONS];
const DISALLOWED_DOCS = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.ppt', '.pptx', '.txt', '.zip', '.rar'];

export async function GET() {
  try {
    const mediaList: {
      url: string;
      name: string;
      folder: 'uploads' | 'presets';
      size: number;
      modifiedAt: string;
    }[] = [];

    // 1. Read uploaded files
    if (fs.existsSync(UPLOADS_DIR)) {
      const uploadFiles = fs.readdirSync(UPLOADS_DIR);
      for (const file of uploadFiles) {
        const ext = path.extname(file).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          const filePath = path.join(UPLOADS_DIR, file);
          const stat = fs.statSync(filePath);
          mediaList.push({
            url: `/uploads/${file}`,
            name: file,
            folder: 'uploads',
            size: stat.size,
            modifiedAt: stat.mtime.toISOString(),
          });
        }
      }
    }

    // 2. Read preset site images and videos
    if (fs.existsSync(IMAGES_DIR)) {
      const siteFiles = fs.readdirSync(IMAGES_DIR);
      for (const file of siteFiles) {
        const ext = path.extname(file).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          const filePath = path.join(IMAGES_DIR, file);
          const stat = fs.statSync(filePath);
          mediaList.push({
            url: `/images/${file}`,
            name: file,
            folder: 'presets',
            size: stat.size,
            modifiedAt: stat.mtime.toISOString(),
          });
        }
      }
    }

    if (fs.existsSync(VIDEOS_DIR)) {
      const videoFiles = fs.readdirSync(VIDEOS_DIR);
      for (const file of videoFiles) {
        const ext = path.extname(file).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          const filePath = path.join(VIDEOS_DIR, file);
          const stat = fs.statSync(filePath);
          mediaList.push({
            url: `/videos/${file}`,
            name: file,
            folder: 'presets',
            size: stat.size,
            modifiedAt: stat.mtime.toISOString(),
          });
        }
      }
    }

    // Sort by newest first
    mediaList.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ success: true, data: mediaList });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list media files' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName).toLowerCase();
    const mime = (file.type || '').toLowerCase();
    const mediaType = formData.get('type') as string | null;

    // Explicitly reject PDF, DOCX, and documents
    if (
      DISALLOWED_DOCS.includes(ext) ||
      mime.includes('pdf') ||
      mime.includes('word') ||
      mime.includes('officedocument') ||
      mime.includes('document')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'PDF and DOCX document files are not allowed. Only JPEG, PNG, JPG, and WEBP photos are permitted.',
        },
        { status: 400 }
      );
    }

    // Check if video upload was specifically requested
    const isVideoUpload = mediaType === 'video' || VIDEO_EXTENSIONS.includes(ext);

    if (isVideoUpload) {
      if (!VIDEO_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid video format. Allowed video formats: ${VIDEO_EXTENSIONS.join(', ')}`,
          },
          { status: 400 }
        );
      }
    } else {
      // Photo upload check: strictly JPEG, JPG, PNG, WEBP
      if (!PHOTO_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid file format. Only JPEG, PNG, JPG, and WEBP photos are allowed. PDF and DOCX are not permitted.',
          },
          { status: 400 }
        );
      }
    }

    // 100MB limit check (to allow HD MP4 hero background videos)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum allowed limit of 100MB' },
        { status: 400 }
      );
    }

    // Create unique sanitized filename
    const cleanBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 40);
    const uniqueFilename = `${Date.now()}-${cleanBase}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueFilename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      originalName,
      size: file.size,
      folder: 'uploads',
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'File parameter is required' },
        { status: 400 }
      );
    }

    // Security check: Only allow deleting from uploads, prevent path traversal
    const safeName = path.basename(fileName);
    const filePath = path.join(UPLOADS_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'File not found in uploads directory' },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true, message: 'Photo deleted successfully' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
