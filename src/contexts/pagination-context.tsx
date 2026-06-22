"use client";

import React, { use, useState, type ReactNode } from "react";

type PaginationContextType = {
  pageTokens: Array<string>;
  setPageTokens: React.Dispatch<React.SetStateAction<string[]>>;
  currentPageToken: string | undefined;
  setCurrentPageToken: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const PaginationContext =
  React.createContext<PaginationContextType | null>(null);

export default function PaginationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pageTokens, setPageTokens] = useState<Array<string>>([]);
  const [currentPageToken, setCurrentPageToken] = useState<
    string | undefined
  >();
  return (
    <PaginationContext.Provider
      value={{
        pageTokens,
        setPageTokens,
        currentPageToken,
        setCurrentPageToken,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
}

export function usePagination() {
  const context = use(PaginationContext);
  if (!context) {
    throw new Error("Pagination context must be used with in it's consumer");
  }
  return context;
}
