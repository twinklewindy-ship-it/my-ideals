import { useState } from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import { ProfileDrawer } from './ProfileDrawer';
import { ProfileExportButton } from './ProfileExportButton';
import { SettingsDropdown } from './SettingsDropdown';

export function ProfileSelector() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeProfile = () => setIsProfileOpen(false);
  const toggleProfile = () => {
    closeSettings();
    setIsProfileOpen(prev => !prev);
  };

  const closeSettings = () => setIsSettingsOpen(false);
  const toggleSettings = () => {
    closeProfile();
    setIsSettingsOpen(prev => !prev);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Desktop: Profile Dropdown */}
      <ProfileDropdown isOpen={isProfileOpen} onToggle={toggleProfile} onClose={closeProfile} />

      {/* Save Button */}
      <ProfileExportButton />

      {/* Desktop: Settings Dropdown */}
      <SettingsDropdown isOpen={isSettingsOpen} onToggle={toggleSettings} onClose={closeSettings} />

      {/* Mobile: Drawer (Profile + Settings) */}
      <ProfileDrawer isOpen={isDrawerOpen} onOpen={openDrawer} onClose={closeDrawer} />
    </>
  );
}
