"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

interface InfiniteScrollProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  fetchNextPage: (lastItem: T) => Promise<T[]>;
  fetchPreviousPage: (firstItem: T) => Promise<T[]>;
  loadingMessage: React.ReactNode;
  endingMessage: React.ReactNode;
  initialData: T[];
  threshold?: number;
  renderItem: (item: T) => React.ReactNode;
  renderKey: (item: T) => string;
}

export function InfiniteScroller<T>({
  fetchNextPage,
  fetchPreviousPage,
  endingMessage,
  loadingMessage,
  initialData = [],
  threshold = 100,
  renderItem,
  renderKey,
  ...props
}: InfiniteScrollProps<T>) {
  const nextObserverTarget = useRef(null);
  const previousObserverTarget = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<T>(initialData[initialData.length - 1]);
  const firstItemRef = useRef<T>(initialData[0]);
  const [renderedData, setRenderedData] = useState<T[]>(initialData);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const direction = entries[0].target.id;
        if (entries[0]?.isIntersecting && hasNextPage) {
          if (direction === "next") {
            const lastItemId = `scroll-item-${renderKey(lastItemRef.current)}`;

            fetchNextPage(lastItemRef.current)
              .then((data) => {
                setRenderedData((prev) => {
                  const newData = [...prev, ...data].slice(-threshold);
                  lastItemRef.current = newData[newData.length - 1];
                  firstItemRef.current = newData[0];
                  return newData;
                });
                if (data.length > 0) {
                  setHasNextPage(true);
                } else {
                  setHasNextPage(false);
                }
              })
              .finally(() => {
                document.getElementById(lastItemId)?.scrollIntoView(true);
              });
          } else {
            const firstItemId = `scroll-item-${renderKey(
              firstItemRef.current
            )}`;
            fetchPreviousPage(firstItemRef.current)
              .then((data) => {
                setRenderedData((prev) => {
                  const newData = [...data, ...prev].slice(0, threshold);
                  firstItemRef.current = newData[0];
                  lastItemRef.current = newData[newData.length - 1];
                  return newData;
                });
                if (data.length > 0) {
                  setHasPreviousPage(true);
                } else {
                  setHasPreviousPage(false);
                }
                firstItemRef.current = data[0];
              })
              .finally(() => {
                document.getElementById(firstItemId)?.scrollIntoView(false);
              });
          }
        }
      },

      { threshold: 1 }
    );

    if (nextObserverTarget.current) {
      observer.observe(nextObserverTarget.current);
    }

    if (previousObserverTarget.current) {
      observer.observe(previousObserverTarget.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div {...props} ref={containerRef}>
      {hasPreviousPage ? loadingMessage : endingMessage}
      <div ref={previousObserverTarget} id="previous" />
      {renderedData.map((item) => (
        <div key={renderKey(item)} id={`scroll-item-${renderKey(item)}`}>
          {renderItem(item)}
        </div>
      ))}
      <div ref={nextObserverTarget} id="next" />
      {hasNextPage ? loadingMessage : endingMessage}
    </div>
  );
}
