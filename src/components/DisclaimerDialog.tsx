import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DISCLAIMER_ACCEPTED_KEY = 'my-ideals:disclaimer_accepted';

export function DisclaimerDialog() {
  const [isOpen, setIsOpen] = useState(!localStorage.getItem(DISCLAIMER_ACCEPTED_KEY));
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      localStorage.setItem(DISCLAIMER_ACCEPTED_KEY, 'true');
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 bg-amber-50 px-6 py-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-amber-800">
              <ExclamationTriangleIcon className="h-6 w-6" />
              Important Notice / 重要なお知らせ / 重要提示
            </h2>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
            {/* English */}
            <section className="mb-6">
              <h3 className="mb-2 font-semibold text-gray-900">Important Notice</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  This application does not upload any data to a server. All data is stored locally
                  in your browser only.
                </p>
                <p>
                  Clearing browser data, using private/incognito mode, or switching devices may
                  result in permanent data loss.
                </p>
                <p className="font-bold text-gray-800">
                  Please make sure to regularly back up your data using the Save button in the
                  top-right corner.
                </p>
                <p className="font-bold text-gray-800">
                  The developer is not responsible for any data loss and cannot assist with data
                  recovery.
                </p>
              </div>
            </section>

            {/* 日本語 */}
            <section className="mb-6">
              <h3 className="mb-2 font-semibold text-gray-900">重要なお知らせ</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  本アプリはサーバーへのデータ送信を行わず、すべてのデータはご利用のブラウザ内にのみ保存されます。
                </p>
                <p>
                  ブラウザのデータ削除、シークレットモードの使用、または端末の変更により、データが永久に失われる可能性があります。
                </p>
                <p className="font-bold text-gray-800">
                  定期的に右上の保存ボタンを使用して、必ずバックアップを行ってください。
                </p>
                <p className="font-bold text-gray-800">
                  データ消失に関して、開発者は一切の責任を負わず、復元対応もできません。
                </p>
              </div>
            </section>

            {/* 中文 */}
            <section>
              <h3 className="mb-2 font-semibold text-gray-900">重要提示</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>本应用不会将任何数据上传至服务器，所有数据仅保存在您的浏览器本地。</p>
                <p>清空浏览器数据、使用无痕模式或更换设备，都可能导致数据永久丢失。</p>
                <p className="font-bold text-gray-800">
                  请务必定期使用右上角的保存按钮备份您的数据。
                </p>
                <p className="font-bold text-gray-800">
                  开发者不对因数据丢失造成的任何损失负责，也无法协助恢复已丢失的数据。
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <label className="mb-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={e => setIsChecked(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I have read and understood the above <br />
                上記の内容を読み、理解しました <br />
                我已阅读并理解上述内容
              </span>
            </label>

            <button
              onClick={handleConfirm}
              disabled={!isChecked}
              className={`w-full rounded-lg px-4 py-2.5 text-base font-medium transition-colors ${
                isChecked
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
            >
              Confirm / 確認 / 确认
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
