/**
 * useCursorPaginationState Hook
 *
 * Manages cursor-based pagination state for APIs that use
 * CursorPaginationMeta + CursorPaginationLinks (e.g., V2 RBAC endpoints).
 *
 * Maintains a cursor stack for forward/backward navigation and exposes
 * a PF Pagination-compatible interface for indeterminate item count mode.
 */

import { useCallback, useState } from 'react';

/**
 * Shape of cursor pagination links from the API response.
 * Compatible with CursorPaginationLinks from @redhat-cloud-services/rbac-client/v2/types.
 */
export interface CursorLinks {
  next: string | null;
  previous: string | null;
}

export interface UseCursorPaginationStateOptions {
  /** Initial items per page */
  initialPerPage: number;
  /** Available per-page options */
  perPageOptions: number[];
}

export interface UseCursorPaginationStateReturn {
  /** Current logical page number (1-based, for display) */
  page: number;
  /** Items per page */
  perPage: number;
  /** Available per-page options */
  perPageOptions: number[];
  /** Cursor string to pass to the API query (undefined for first page) */
  cursor: string | undefined;
  /** Whether there is a next page (links.next !== null) */
  hasNextPage: boolean;
  /** Whether there is a previous page (page > 1) */
  hasPreviousPage: boolean;
  /** Navigate to the next page (pushes cursor from links.next onto stack) */
  onNextPage: () => void;
  /** Navigate to the previous page (pops cursor from stack) */
  onPreviousPage: () => void;
  /** PF-compatible page change handler (only supports +1/-1 relative to current) */
  onPageChange: (page: number) => void;
  /** Change items per page (resets cursor stack and page to 1) */
  onPerPageChange: (perPage: number) => void;
  /** Reset page to 1 (clears cursor stack, used when filters/sort change) */
  resetPage: () => void;
  /** Feed the API response links back to the hook after each fetch */
  setCursorLinks: (links: CursorLinks) => void;
}

/**
 * Extract the cursor query parameter from a full API URL string.
 * Returns undefined if the URL is null or doesn't contain a cursor param.
 */
function extractCursorFromUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  try {
    // Handle both absolute URLs and relative paths
    const parsed = new URL(url, 'http://placeholder');
    return parsed.searchParams.get('cursor') ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Hook for managing cursor-based pagination state.
 *
 * Maintains a stack of cursor tokens for forward/backward navigation.
 * Page 1 has no cursor (undefined). When the user navigates forward,
 * the cursor from `links.next` is pushed onto the stack.
 * When navigating backward, the stack is popped.
 */
export function useCursorPaginationState({ initialPerPage, perPageOptions }: UseCursorPaginationStateOptions): UseCursorPaginationStateReturn {
  // Minimum valid perPage is the smallest perPageOption (typically 10)
  const minPerPage = perPageOptions[0] ?? 10;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(Math.max(minPerPage, initialPerPage));

  // Cursor stack: index 0 = cursor for page 2, index 1 = cursor for page 3, etc.
  // Page 1 always has cursor = undefined.
  const [cursorStack, setCursorStack] = useState<string[]>([]);

  // Store only the extracted next cursor token — single source of truth
  // for whether a next page exists, avoiding redundant links state.
  const [nextCursor, setNextCursor] = useState<string | undefined>();

  // Current cursor is derived from the stack and page
  const cursor = page === 1 ? undefined : cursorStack[page - 2];

  const hasNextPage = nextCursor !== undefined;
  const hasPreviousPage = page > 1;

  const setCursorLinks = useCallback((newLinks: CursorLinks) => {
    setNextCursor(extractCursorFromUrl(newLinks.next));
  }, []);

  const onNextPage = useCallback(() => {
    if (nextCursor === undefined) return; // No next page

    setCursorStack((prev) => {
      const newStack = [...prev];
      // Ensure the stack has the cursor for the next page
      newStack[page - 1] = nextCursor; // page is 1-based, stack is 0-based for page 2+
      return newStack;
    });
    setPage((p) => p + 1);
  }, [page, nextCursor]);

  const onPreviousPage = useCallback(() => {
    if (page <= 1) return;
    setPage((p) => p - 1);
    // Don't pop from stack - keep cursors so user can go forward again
  }, [page]);

  const onPageChange = useCallback(
    (newPage: number) => {
      if (newPage === page) {
        return; // No-op — PF can fire onSetPage with the current page on blur/validation
      } else if (newPage === page + 1) {
        onNextPage();
      } else if (newPage === page - 1) {
        onPreviousPage();
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[useCursorPaginationState] onPageChange only supports next/previous (page±1). ` +
            `Requested page ${newPage} from page ${page} was ignored.`,
        );
      }
    },
    [page, onNextPage, onPreviousPage],
  );

  const onPerPageChange = useCallback(
    (newPerPage: number) => {
      const clamped = Math.max(minPerPage, newPerPage);
      setPerPage(clamped);
      setPage(1);
      setCursorStack([]);
      setNextCursor(undefined);
    },
    [minPerPage],
  );

  const resetPage = useCallback(() => {
    setPage(1);
    setCursorStack([]);
    setNextCursor(undefined);
  }, []);

  return {
    page,
    perPage,
    perPageOptions,
    cursor,
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
    onPageChange,
    onPerPageChange,
    resetPage,
    setCursorLinks,
  };
}
