"use client";

import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });

export default function ClientChrome() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
    </>
  );
}
