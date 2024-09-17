"use client";

import { InfiniteScroller } from "@/packages/InfiniteScroller";
import { useState } from "react";

function App() {
  const [elements, setElements] = useState([...Array(50).keys()]);

  const [inputValue, setInputValue] = useState("");
  function fetchNextPage(lastItem: number): Promise<number[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({ length: 10 }, (_, i) => +lastItem + i + 1)); // 修改此处
      }, 500);
    });
  }

  function fetchPreviousPage(lastItem: number): Promise<number[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (lastItem > 0) {
          resolve(
            Array.from({ length: 10 }, (_, i) => +lastItem - i - 1).reverse()
          ); // 修改此处
        } else {
          resolve([]);
        }
      }, 500);
    });
  }

  return (
    <main className="grid grid-cols-2">
      <div className="flex h-screen flex-col bg-black text-center text-xl text-white relative">
        <h1 className="underline">Inverse Scroll</h1>
        <InfiniteScroller<number>
          fetchNextPage={fetchNextPage}
          loadingMessage={<p>Loading...</p>}
          endingMessage={<p>The beginning of time...</p>}
          className="flex flex-1 flex-col-reverse overflow-auto"
          fetchPreviousPage={fetchPreviousPage}
          initialData={elements}
          renderItem={(el) => <div key={crypto.randomUUID()}>{el}</div>}
          renderKey={(el) => el.toString()}
          key={elements.length}
        />
        <input
          type="text"
          className="absolute bottom-0 w-full text-black"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setElements((prev) => [+inputValue, ...prev]);
            }
          }}
        />
      </div>
    </main>
  );
}

export default App;
