import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { UploadForm } from './UploadForm';

export default function NewPhotoPage() {
  return (
    <Container size="narrow">
      <Link
        href="/admin/photos"
        className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to photos
      </Link>
      <div className="space-y-3 mb-10">
        <p className="eyebrow text-accent">Upload</p>
        <h1 className="text-display-lg font-display text-ink">New photo</h1>
        <p className="caption">
          The image will be processed (preview + thumbnail), EXIF extracted, and saved as a draft. You'll edit metadata on the next screen.
        </p>
      </div>
      <UploadForm />
    </Container>
  );
}
