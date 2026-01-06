// components/profile/ProfileSelector.tsx
import { useState, useRef } from 'react';
import { type Profile } from '@/domain/profile';
import { type ProfileEntry } from '@/storage/localStorage';
import { ProfileDropdown } from './ProfileDropdown';
import { ProfileDrawer } from './ProfileDrawer';
import { ProfileExportButton } from './ProfileExportButton';
import { ImportConflictDialog, type ImportConflictAction } from './ProfileImportConflictDialog';

type PendingImport = {
  profile: Profile;
  existingId: string;
};

type ProfileSelectorProps = {
  profiles: ProfileEntry[];
  activeProfile: ProfileEntry | null;
  onSelect: (profileId: string) => void;
  onCreate: (name: string, templateId: string, templateLink: string) => void;
  onImport: (profile: Profile, overwrite?: boolean) => void;
};

export function ProfileSelector({
  profiles,
  activeProfile,
  onSelect,
  onCreate,
  onImport,
}: ProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  const handleSelect = (profileId: string) => {
    onSelect(profileId);
    close();
  };

  const handleCreate = () => {
    const name = prompt('Enter profile name:');
    const templateLink = prompt('Enter template link:');
    if (name && templateLink) {
      onCreate(name, 'template-id', templateLink);
    }
    close();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const profile = JSON.parse(event.target?.result as string) as Profile;
        const existingProfile = profiles.find(p => p.id === profile.id);

        if (existingProfile) {
          setPendingImport({
            profile,
            existingId: existingProfile.id,
          });
        } else {
          onImport(profile);
          close();
        }
      } catch {
        alert('Invalid profile file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConflictAction = (action: ImportConflictAction) => {
    if (!pendingImport) return;

    const { profile } = pendingImport;

    switch (action) {
      case 'overwrite':
        onImport(profile, true);
        break;
      case 'duplicate':
        onImport(profile, false);
        break;
      case 'cancel':
        break;
    }

    setPendingImport(null);
    close();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const listProps = {
    profiles,
    onSelect: handleSelect,
    onCreate: handleCreate,
    onImport: handleImportClick,
  };

  return (
    <>
      {/* Desktop Dropdown */}
      <ProfileDropdown
        activeProfile={activeProfile}
        isOpen={isOpen}
        onToggle={toggle}
        onClose={close}
        {...listProps}
      />

      {/* Save Button */}
      <ProfileExportButton activeProfile={activeProfile} />

      {/* Mobile Drawer */}
      <ProfileDrawer
        activeProfile={activeProfile}
        isOpen={isOpen}
        onOpen={open}
        onClose={close}
        {...listProps}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Import Conflict Dialog */}
      <ImportConflictDialog
        isOpen={pendingImport !== null}
        profileName={pendingImport?.profile.name ?? ''}
        onAction={handleConflictAction}
      />
    </>
  );
}
