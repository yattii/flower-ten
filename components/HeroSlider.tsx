"use client";
import { useEffect, useState } from "react";
import Image from "next/image";


export type HeroImage = { src: string; alt?: string };
export default function HeroSlider({ images, intervalMs = 4000 }: { images: HeroImage[]; intervalMs?: number }) {
const [index, setIndex] = useState(0);
useEffect(() => {
const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
return () => clearInterval(id);
}, [images.length, intervalMs]);


return (
<div className="relative h-[58vh] md:h-[70vh]">
{images.map((img, i) => (
<div
key={i}
className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
>
<Image src={img.src} alt={img.alt ?? ""} fill priority={i === 0} sizes="100vw" className="object-cover" />
</div>
))}
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
{images.map((_, i) => (
<button key={i} onClick={() => setIndex(i)} aria-label={`slide ${i+1}`} className={`h-2 w-2 rounded-full border ${i===index?"bg-white":"bg-white/50"}`} />
))}
</div>
</div>
);
}
