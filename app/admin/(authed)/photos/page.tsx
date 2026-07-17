import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { parseListParams, buildQuery } from '@/lib/admin/list-params';
import { PageHeader, SearchInput, Toolbar, Pagination } from '@/components/admin';
import { PhotosTable } from './PhotosTable';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function sp(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function AdminPhotosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { page, pageSize, sort, dir, q, skip, take } = parseListParams(params, {
    sortable: ['createdAt', 'title', 'price', 'sortOrder'],
    defaultSort: 'createdAt',
    defaultDir: 'desc',
    pageSize: 24,
  });

  const publishedRaw = sp(params['published']);
  const featuredRaw = sp(params['featured']);
  const countryRaw = sp(params['country']);

  const where: Prisma.PhotoWhereInput = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { country: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (publishedRaw === '1') where.published = true;
  if (publishedRaw === '0') where.published = false;
  if (featuredRaw === '1') where.featured = true;
  if (countryRaw) where.countryCode = countryRaw;

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where,
      orderBy: { [sort]: dir },
      skip,
      take,
      select: {
        id: true,
        slug: true,
        title: true,
        country: true,
        countryCode: true,
        price: true,
        currency: true,
        published: true,
        featured: true,
        thumbKey: true,
        sortOrder: true,
        createdAt: true,
      },
    }),
    prisma.photo.count({ where }),
  ]);

  const baseQ = { q: q || undefined, sort, dir };

  const filterLinks = (
    <div className="flex items-center gap-2 flex-wrap">
      <Link
        href={`/admin/photos${buildQuery({ ...baseQ })}`}
        className={`rounded-md px-3 py-1.5 text-sm border transition-colors ${
          !publishedRaw && !featuredRaw
            ? 'bg-ink text-white border-ink'
            : 'border-line text-ink-muted hover:text-ink hover:bg-paper-cool'
        }`}
      >
        Tous
      </Link>
      <Link
        href={`/admin/photos${buildQuery({ ...baseQ, published: '1' })}`}
        className={`rounded-md px-3 py-1.5 text-sm border transition-colors ${
          publishedRaw === '1' && !featuredRaw
            ? 'bg-ink text-white border-ink'
            : 'border-line text-ink-muted hover:text-ink hover:bg-paper-cool'
        }`}
      >
        Publiees
      </Link>
      <Link
        href={`/admin/photos${buildQuery({ ...baseQ, published: '0' })}`}
        className={`rounded-md px-3 py-1.5 text-sm border transition-colors ${
          publishedRaw === '0'
            ? 'bg-ink text-white border-ink'
            : 'border-line text-ink-muted hover:text-ink hover:bg-paper-cool'
        }`}
      >
        Brouillons
      </Link>
      <Link
        href={`/admin/photos${buildQuery({ ...baseQ, featured: '1' })}`}
        className={`rounded-md px-3 py-1.5 text-sm border transition-colors ${
          featuredRaw === '1'
            ? 'bg-ink text-white border-ink'
            : 'border-line text-ink-muted hover:text-ink hover:bg-paper-cool'
        }`}
      >
        Featured
      </Link>
    </div>
  );

  return (
    <Container size="wide">
      <PageHeader
        eyebrow="Catalogue"
        title="Photos"
        actions={
          <Link
            href="/admin/photos/new"
            className="inline-flex items-center rounded-md bg-ink text-white px-4 py-2 text-sm font-medium hover:bg-ink-soft transition-colors"
          >
            Ajouter une photo
          </Link>
        }
      />

      <Toolbar
        search={<SearchInput placeholder="Rechercher une photo" />}
        filters={filterLinks}
        count={total}
      />

      <PhotosTable photos={photos} sort={sort} dir={dir} />

      <Pagination page={page} pageSize={pageSize} total={total} />
    </Container>
  );
}
