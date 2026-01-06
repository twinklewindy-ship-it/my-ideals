import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export type ImportConflictAction = 'overwrite' | 'duplicate' | 'cancel';

type ImportConflictDialogProps = {
  isOpen: boolean;
  profileName: string;
  onAction: (action: ImportConflictAction) => void;
};

export function ImportConflictDialog({ isOpen, profileName, onAction }: ImportConflictDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Profile Already Exists"
      message={`A profile named "${profileName}" already exists. What would you like to do?`}
      options={[
        {
          label: 'Create Copy',
          value: 'duplicate',
          variant: 'primary',
        },
        {
          label: 'Overwrite',
          value: 'overwrite',
          variant: 'danger',
        },
      ]}
      onSelect={value => onAction(value as ImportConflictAction)}
      onCancel={() => onAction('cancel')}
    />
  );
}
