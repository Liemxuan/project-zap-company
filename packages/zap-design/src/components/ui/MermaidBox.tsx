"use client";
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export const MermaidBox = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      fontFamily: 'inherit',
    });

    if (ref.current) {
      mermaid.render(`mermaid-svg-${Math.random().toString(36).substring(7)}`, chart).then((result) => {
        if (ref.current) {
          ref.current.innerHTML = result.svg;
        }
      }).catch((e) => console.error(e));
    }
  }, [chart]);

  return <div ref={ref} className="mermaid-wrapper my-8 overflow-x-auto w-full flex justify-center" suppressHydrationWarning />;
};
