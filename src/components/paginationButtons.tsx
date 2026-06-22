"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationContextProvider, {
  usePagination,
} from "@/contexts/pagination-context";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function PaginationDemo({ nextPageToken }: { nextPageToken: string }) {
  const { pageTokens, setPageTokens, currentPageToken, setCurrentPageToken } =
    usePagination();
  const params = useSearchParams();
  const pageTokenParam = params.get("pageToken");

  if (pageTokenParam === null) {
    setCurrentPageToken(undefined);
  }
  // Sync URL -> context. Must be in an effect, not in render body.
  useEffect(() => {
    if (pageTokenParam === null) return;
    setCurrentPageToken(pageTokenParam);
  }, [pageTokenParam, setCurrentPageToken]);

  useEffect(() => {
    if (!nextPageToken) return;

    setPageTokens((prevPageTokens) => {
      if (prevPageTokens.includes(nextPageToken)) return prevPageTokens;
      return [...prevPageTokens, nextPageToken];
    });
  }, [nextPageToken, setPageTokens]);

  const currentIndex = currentPageToken
    ? pageTokens.indexOf(currentPageToken)
    : -1;

  // currentIndex === -1 means we're on the first page (no token yet)
  const previousToken =
    currentIndex > 0 ? pageTokens[currentIndex - 1] : undefined;

  // The token to go forward to is the one *after* the current index,
  // not just "whatever is last in the array."
  const nextToken =
    currentIndex >= 0 && currentIndex < pageTokens.length - 1
      ? pageTokens[currentIndex + 1]
      : nextPageToken;

  const isFirstPage = pageTokenParam === null;
  const isLastPage = !nextToken;
  console.log(currentPageToken);
  console.log(`First: ${isFirstPage}, Last: ${isLastPage}`);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previousToken ? `?pageToken=${previousToken}` : "?"}
            className={
              isFirstPage
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : ""
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={nextToken ? `?pageToken=${nextToken}` : "#"}
            className={
              isLastPage
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default function PaginationButtons({
  nextPageToken,
}: {
  nextPageToken: string;
}) {
  return (
    <PaginationContextProvider>
      <PaginationDemo nextPageToken={nextPageToken} />
    </PaginationContextProvider>
  );
}
