export type ListParams = {
  page: number;
  pageSize: number;
  sort: string;
  dir: 'asc' | 'desc';
  q: string;
  skip: number;
  take: number;
};

export function parseListParams(
  searchParams: Record<string, string | string[] | undefined>,
  opts: {
    sortable: string[];
    defaultSort: string;
    defaultDir?: 'asc' | 'desc';
    pageSize?: number;
  },
): ListParams {
  const pageSize = opts.pageSize ?? 20;
  const defaultDir = opts.defaultDir ?? 'asc';

  const rawPage = searchParams['page'];
  const pageStr = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);

  const rawSort = searchParams['sort'];
  const sortStr = Array.isArray(rawSort) ? rawSort[0] : rawSort;
  const sort =
    sortStr && opts.sortable.includes(sortStr) ? sortStr : opts.defaultSort;

  const rawDir = searchParams['dir'];
  const dirStr = Array.isArray(rawDir) ? rawDir[0] : rawDir;
  const dir: 'asc' | 'desc' =
    dirStr === 'asc' || dirStr === 'desc' ? dirStr : defaultDir;

  const rawQ = searchParams['q'];
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ) ?? '';

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, sort, dir, q, skip, take };
}

export function buildQuery(
  base: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value));
    }
  }
  const str = params.toString();
  return str ? `?${str}` : '';
}
