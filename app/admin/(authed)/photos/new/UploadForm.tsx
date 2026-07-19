'use client';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { uploadPhoto } from '@/app/admin/actions';
import { cn } from '@/lib/utils';

export function UploadForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.tiff'] },
    multiple: false,
    onDrop: (accepted) => {
      const f = accepted[0];
      if (!f) return;
      setFile(f);
    },
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError('Please select an image');
      return;
    }
    setError('');
    setPending(true);
    const fd = new FormData();
    fd.set('file', file);
    fd.set('title', title);
    try {
      await uploadPhoto(fd);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed p-12 sm:p-16 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-accent bg-paper-warm' : 'border-line hover:border-ink/40 bg-paper',
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <ImageIcon className="w-8 h-8 text-accent" />
            <p className="text-sm text-ink">{file.name}</p>
            <p className="caption">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-ink-muted">
            <UploadCloud className="w-10 h-10" />
            <p className="text-sm">Drag & drop an image here, or click to browse</p>
            <p className="caption">JPG, PNG, WebP, TIFF, up to 50 MB</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre (optionnel)</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Généré par l'IA si laissé vide"
        />
        <p className="caption">
          Laissé vide, le titre et la description (FR et EN) sont générés automatiquement à partir de
          l'image et des métadonnées. Vous pourrez les modifier à l'étape suivante.
        </p>
      </div>

      {error && <p className="text-xs text-red-700">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!file || pending}>
          {pending ? 'Traitement…' : 'Upload & continue'}
        </Button>
        {pending && (
          <p className="caption">Traitement de l'image et génération du titre, quelques secondes.</p>
        )}
      </div>
    </form>
  );
}
