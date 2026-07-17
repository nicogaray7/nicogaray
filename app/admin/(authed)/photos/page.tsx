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
        className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
          !publishedRaw && !featuredRaw
            ? 'border-ink bg-ink text-paper'
            : 'border-line text-ink-muted hover:text-ink'
        }`}
      >
        Tous
      </Link>
      <Link
        href={`/admin/photos${buildQuery({ ...baseQ, published: '1' })}`}
        className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
          publishedRaw === '1' && !featuredRaw
            ? 'border-ink bg-ink text-paper'
            : 'border-line text-ink-muted hover:text-ink'
        }`}
      >
        Publies
      </Link>
      <Link
        href={`/admin/photos${buildQuery({ ...baseQ, published: '0' })}`}
        className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
          publishedRaw === '0'
            ? 'border-ink bg-ink text-paper'
            : 'border-line text-ink-muted hover:text-ink'
        }`}
      >
        Brouillons
      </Link>
      <Link
        href={`/admin/photos${buildQuery({ ...baseQ, featured: '1' })}`}
        className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
          featuredRaw === '1'
            ? 'border-ink bg-ink text-paper'
            : 'border-line text-ink-muted hover:text-ink'
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
            className="inline-flex items-center px-5 py-2.5 bg-ink text-paper text-[11px] tracking-widest uppercase hover:bg-accent transition-colors"
          >
            + Upload
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
