import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, UsersIcon, LinkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useProfileListStore } from '@/stores/profileListStore';
import { useTemplateFetcher } from '@/hooks/useTemplateFetcher';
import { ProfileFlags, type ProfileFlag } from '@/domain/profile';
import { TemplateUrlInput } from '../TemplateUrlInput';

type ProfileCreateDialogProps = {
  onClose: () => void;
};

// --- G老师新增：定义预设模板 ---
const PRESETS = [
  {
    name: '🌸 樱坂46 - 藤吉夏铃',
    url: '/presets/sakurazaka46-karin.json',
    desc: '全单系列生写整理'
  },
  {
    name: '🌳 欅坂46 - 藤吉夏铃',
    url: '/presets/keyakizaka46-karin.json',
    desc: '早期生写整理'
  }
];

export function ProfileCreateDialog({ onClose }: ProfileCreateDialogProps) {
  const { t } = useTranslation();

  const [profileName, setProfileName] = useState('');
  const [enableCount, setEnableCount] = useState(false);

  const createProfile = useProfileListStore(state => state.createProfile);

  const {
    url,
    setUrl,
    state: fetchState,
    template,
  } = useTemplateFetcher({
    onSuccess: template => {
      setProfileName(template.name);
    },
  });

  const handleCreate = () => {
    const name = profileName.trim();
    if (fetchState.status !== 'success' || !name || !template) return;

    const flags: ProfileFlag[] = [];
    if (enableCount) flags.push(ProfileFlags.ENABLE_COUNT);

    // 如果是本地预设，url使用绝对路径，如果是外部链接保持原样
    createProfile(name, { id: template.id, link: url.trim(), revision: template.revision }, flags);
    onClose();
  };

  const canCreate = fetchState.status === 'success' && profileName.trim();

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="w-full max-w-lg rounded-lg bg-white text-left shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('dialog.profile-create.title')}
            </h2>
            <button onClick={onClose} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 px-4 py-4">
            
            {/* --- G老师新增：预设按钮区域 --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">快速选择模板</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    onClick={() => setUrl(preset.url)}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:bg-blue-50 hover:border-blue-300
                      ${url === preset.url 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-gray-200 bg-white'
                      }`}
                  >
                    <div className="mt-0.5 text-blue-500">
                      <DocumentTextIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center py-1">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink-0 px-2 text-xs text-gray-400">或者输入自定义链接</span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            {/* 原有的 URL 输入框 */}
            <TemplateUrlInput url={url} onUrlChange={setUrl} state={fetchState} />

            {/* Fetch Error */}
            {fetchState.status === 'error' && (
              <div className="rounded-lg bg-red-50 p-3">
                <pre className="text-sm whitespace-pre-wrap text-red-600">{fetchState.message}</pre>
              </div>
            )}

            {/* Success: Template Info + Name */}
            {fetchState.status === 'success' && template && (
              <>
                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                  <div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      <div className="mt-0.5 font-mono text-xs text-gray-500">
                        ID: {template.id} (rev. {template.revision})
                      </div>
                    </div>
                    {template.description && (
                      <div className="mt-1 text-sm whitespace-pre-line text-gray-500">
                        {template.description}
                      </div>
                    )}
                    {template.author && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <UsersIcon className="h-4 w-4" />
                        {template.author}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('dialog.profile-create.profile-name')}
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2
                      text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                      focus:outline-none"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enableCount}
                    onChange={e => setEnableCount(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t('dialog.profile-create.enable-count')}
                  </span>
                </label>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleCreate}
              disabled={!canCreate}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
                hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('common.create')}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
