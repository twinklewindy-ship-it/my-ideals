import { useState } from 'react';

type ImageCheckCardProps = {
  src: string;
  fallbackSrc?: string;
  text: string;
  checked: boolean;
  onChange: () => void;
};

export function ImageCheckCard({ src, fallbackSrc, text, checked, onChange }: ImageCheckCardProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [showAlt, setShowAlt] = useState(false);

  return (
    <label className="relative block w-full cursor-pointer select-none">
      {/* Hidden controlling checkbox */}
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />

      {/* Image */}
      {showAlt ? (
        <div
          className="flex aspect-[7/10] w-full items-center justify-center rounded-md bg-gray-200
            p-2 text-center text-sm whitespace-pre-line text-gray-600 transition
            peer-not-checked:opacity-50"
        >
          {text.split(' ').join('\n')}
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={text}
          loading="lazy"
          decoding="async"
          onError={() =>
            fallbackSrc && imgSrc !== fallbackSrc ? setImgSrc(fallbackSrc) : setShowAlt(true)
          }
          className="aspect-[7/10] w-full rounded-md object-cover transition
            peer-not-checked:opacity-50"
        />
      )}

      {/* Bottom bar */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-md
          bg-black/50 px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:py-1 sm:text-xs"
      >
        <span className="truncate">{text}</span>
        {/* Visual checkbox (mirrors state) */}
        <input type="checkbox" checked={checked} readOnly className="pointer-events-none" />
      </div>
    </label>
  );
}
