import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useTemplateFetcher } from '@/hooks/useTemplateFetcher';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import { TemplateUrlInput } from '../TemplateUrlInput';

type ProfileEditTemplateUrlDialogProps = {
  onClose: () => void;
  profileId: string;
  templateId: string;
  currentUrl: string;
};

export function ProfileEditTemplateUrlDialog({
  onClose,
  profileId,
  templateId,
  currentUrl,
}: ProfileEditTemplateUrlDialogProps) {
  const { t } = useTranslation();
  const { url, setUrl, state } = useTemplateFetcher({
    initialUrl: currentUrl,
    expectedId: templateId,
  });

  const handleSave = () => {
    if (state.status === 'success' && url.trim() !== currentUrl) {
      useActiveProfileStore.getState().updateTemplateUrl(url);
      // Trigger reload
      useActiveProfileStore.getState().load(profileId);
    }
    onClose();
  };

  return (
    <ConfirmDialog
      isOpen={true}
      title={t('dialog.profile-edit-template-url.title')}
      options={[
        {
          label: t('common.save'),
          value: 'save',
          variant: 'primary',
          disabled: state.status !== 'success',
        },
      ]}
      onSelect={handleSave}
      onCancel={onClose}
    >
      <div className="space-y-4">
        <TemplateUrlInput
          url={url}
          onUrlChange={setUrl}
          state={state}
          templateId={templateId}
          autoFocus
        />

        {/* Error */}
        {state.status === 'error' && (
          <div className="rounded-lg bg-red-50 p-3">
            <pre className="text-sm whitespace-pre-wrap text-red-600">{state.message}</pre>
          </div>
        )}
      </div>
    </ConfirmDialog>
  );
}
