"use client";
import dynamic from 'next/dynamic';

export const DynamicMermaidBox = dynamic(
  () => import('./MermaidBox').then(mod => mod.MermaidBox),
  { ssr: false }
);
