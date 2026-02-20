"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationContextProvider, {
  usePagination,
} from "@/contexts/pagination-context";
import { useEffect } from "react";

export function PaginationDemo({ pageToken }: { pageToken: string }) {
  const { nextPage, previousPage, setPreviousPage, setNextPage } =
    usePagination();
  useEffect(() => {
    setPreviousPage(nextPage);
    setNextPage(pageToken);
  }, [pageToken]);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`?pageToken=${previousPage}`} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`?pageToken=${nextPage}`} />
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
