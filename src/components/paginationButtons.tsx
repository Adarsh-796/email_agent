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
import { useEffect } from "react";

export function PaginationDemo({ pageToken }: { pageToken: string }) {
  const { pageTokens, setPageTokens } = usePagination();

  useEffect(() => {
    if (!pageToken) return;

    setPageTokens((prevPageTokens) => {
      if (prevPageTokens.at(-1) === pageToken) return prevPageTokens;
      return [...prevPageTokens, pageToken];
    });
  }, [pageToken, setPageTokens]);

  const previousToken =
    pageTokens.length >= 2 ? pageTokens[pageTokens.length - 2] : undefined;

  const nextToken = pageTokens.at(-1);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`?pageToken=${previousToken}`} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`?pageToken=${nextToken}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default function PaginationButtons({
  pageToken,
}: {
  pageToken: string;
}) {
  return (
    <PaginationContextProvider>
      <PaginationDemo pageToken={pageToken} />
    </PaginationContextProvider>
  );
}
