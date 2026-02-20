"use client";

import React, { use, useState, type ReactNode } from "react";

type PaginationContextType = {
  previousPage: string;
  nextPage: string;
  setPreviousPage: React.Dispatch<React.SetStateAction<string>>;
  setNextPage: React.Dispatch<React.SetStateAction<string>>;
};

export const PaginationContext =
  React.createContext<PaginationContextType | null>(null);

export default function PaginationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [previousPage, setPreviousPage] = useState<string>("");
  const [nextPage, setNextPage] = useState<string>("");
  return (
    <PaginationContext.Provider
      value={{ previousPage, nextPage, setPreviousPage, setNextPage }}
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
