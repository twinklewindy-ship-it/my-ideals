import { useRef, useEffect } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { SettingsPanel } from './SettingsPanel';

type SettingsDropdownProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function SettingsDropdown({ isOpen, onToggle, onClose }: SettingsDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={onToggle}
        className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 focus:ring-2
          focus:ring-blue-500 focus:outline-none"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1
            shadow-lg"
        >
          <SettingsPanel onSelect={onClose} />
        </div>
      )}
    </div>
  );
}
