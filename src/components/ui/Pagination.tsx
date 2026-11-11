interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// 1 … 4 5 6 … 20  (first, last and the neighbours of the current page)
function getPageList(page: number, totalPages: number): Array<number | 'gap'> {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result: Array<number | 'gap'> = [];
  pages.forEach((p, index) => {
    if (index > 0 && p - pages[index - 1] > 1) result.push('gap');
    result.push(p);
  });
  return result;
}

const ITEM = 'flex min-h-11 min-w-11 items-center justify-center rounded-xl border-2 px-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-brand';

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button type="button" className={`${ITEM} border-line bg-surface hover:bg-surface-muted disabled:opacity-40`} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        ‹
      </button>
      {getPageList(page, totalPages).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-ink-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={`${ITEM} ${item === page ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface hover:bg-surface-muted'}`}
          >
            {item}
          </button>
        ),
      )}
      <button type="button" className={`${ITEM} border-line bg-surface hover:bg-surface-muted disabled:opacity-40`} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        ›
      </button>
    </nav>
  );
}
