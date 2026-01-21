import { useTranslation } from 'react-i18next';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

type ProfileExportButtonProps = {
  text?: string;
  variant?: 'primary' | 'secondary';
};

const VariantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
};

export function ProfileExportButton({ text, variant = 'primary' }: ProfileExportButtonProps) {
  const { t } = useTranslation();
  const profile = useActiveProfileStore(state => state.profile);

  const handleExport = () => {
    if (!profile) return;

    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const filename = `my-ideals-profile-${profile.name}.json`;
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: filename }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!profile}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
        disabled:cursor-not-allowed disabled:opacity-50 ${VariantStyles[variant]}`}
    >
      <ArrowDownTrayIcon className="h-4 w-4" />
      <span className="hidden sm:inline">{text ?? t('profile.export')}</span>
    </button>
  );
}
