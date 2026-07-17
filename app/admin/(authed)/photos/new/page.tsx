import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { UploadForm } from './UploadForm';

export default function NewPhotoPage() {
  return (
    <Container size="narrow">
      <Link
        href="/admin/photos"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux photos
      </Link>
      <div className="space-y-2 mb-10">
        <h1 className="text-2xl font-semibold text-ink">Ajouter une photo</h1>
        <p className="text-sm text-ink-muted">
          L'image sera traitee (preview + miniature), les EXIF extraits, et sauvegardee en brouillon. Vous editerez les metadonnees a l'etape suivante.
        </p>
      </div>
      <UploadForm />
    </Container>
  );
}
