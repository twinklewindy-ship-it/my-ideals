// components/Navbar.tsx
import { useState, useRef } from 'react';
import { useProfileManager } from '../hooks/useProfileManager';
import { type ProfileIndex } from '../storage/localStorage';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

type ProfileListProps = {
  profileIndex: ProfileIndex;
  onSelect: (profileId: string) => void;
  onCreate: () => void;
  onImport: () => void;
};

function ProfileList({ profileIndex, onSelect, onCreate, onImport }: ProfileListProps) {
  return (
    <>
      {profileIndex.profiles.length > 0 && (
        <div className="py-1">
          <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Profiles</div>
          {profileIndex.profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => onSelect(profile.id)}
              className={`
                flex w-full items-center gap-2 px-3 py-2 text-left text-sm
                ${
                  profile.id === profileIndex.active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {profile.id === profileIndex.active ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <span className="w-4" />
              )}
              <span className="truncate">{profile.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200" />

      <div className="py-1">
        <button
          onClick={onCreate}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <PlusIcon className="h-4 w-4" />
          New Profile
        </button>
        <button
          onClick={onImport}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <ArrowUpTrayIcon className="h-4 w-4" />
          Import Profile
        </button>
      </div>
    </>
  );
}

type NavbarProps = {
  profileIndex: ProfileIndex;
  onSelectProfile: (profileId: string) => void;
};

export function Navbar({ profileIndex, onSelectProfile }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProfile = profileIndex.profiles.find(p => p.id === profileIndex.active);

  const handleSelect = (profileId: string) => {
    onSelectProfile(profileId);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              My Ideals - Idol Namashashin Tracking
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop: Profile Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
                  flex w-56 items-center justify-between gap-2 rounded-lg border border-gray-300
                  bg-white px-3 py-2 text-sm font-medium text-gray-700
                  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              >
                <span className="truncate">{activeProfile?.name ?? 'Select Profile'}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Desktop Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
                    <ProfileList
                      profileIndex={profileIndex}
                      onSelect={handleSelect}
                      onCreate={() => {}}
                      onImport={() => {}}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={() => {}}
              disabled={!profileIndex.active}
              className="
                flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2
                text-sm font-medium text-white
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Mobile: Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="
                rounded-lg border border-gray-300 p-2 text-gray-700
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                lg:hidden
              "
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Side Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl lg:hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Current Profile */}
            {activeProfile && (
              <div className="border-b border-gray-200 px-4 py-3">
                <div className="text-xs font-semibold uppercase text-gray-500">Current Profile</div>
                <div className="mt-1 truncate font-medium text-gray-900">{activeProfile.name}</div>
              </div>
            )}

            {/* Profile List */}
            <div className="overflow-y-auto">
              <ProfileList
                profileIndex={profileIndex}
                onSelect={handleSelect}
                onCreate={() => {}}
                onImport={() => {}}
              />
            </div>
          </div>
        </>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        // onChange={handleImport}
        className="hidden"
      />
    </nav>
  );
}
