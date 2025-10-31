"use client";
import { useEffect, useState } from 'react';

type Props = {
  totalPages: number;
};

export default function ProjectsPager({ totalPages }: Props) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll('[data-page]')) as HTMLElement[];
    items.forEach((el) => {
      const p = Number(el.getAttribute('data-page') || '1');
      el.style.display = p === page ? '' : 'none';
    });
  }, [page]);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        className="px-3 py-1 rounded-md border border-border disabled:opacity-50"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        aria-label="Página anterior"
        type="button"
      >
        Anterior
      </button>
      <div className="text-sm">
        {page} / {totalPages}
      </div>
      <button
        className="px-3 py-1 rounded-md border border-border disabled:opacity-50"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        aria-label="Próxima página"
        type="button"
      >
        Próxima
      </button>
    </div>
  );
}
