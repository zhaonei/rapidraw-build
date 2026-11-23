import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { invoke } from '@tauri-apps/api/core';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLutFolderDialog } from '../../store/useLutFolderDialog';

export default function LutFolderDialog() {
  const { t } = useTranslation();
  const isOpen = useLutFolderDialog((s) => s.isOpen);
  const name = useLutFolderDialog((s) => s.name);
  const setName = useLutFolderDialog((s) => s.setName);
  const close = useLutFolderDialog((s) => s.close);
  const markCreated = useLutFolderDialog((s) => s.markCreated);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 30);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error(t('ui.lut.folderNameRequired'));
      return;
    }
    try {
      await invoke<string[]>('create_lut_folder', { name: trimmed });
      markCreated();
      close();
    } catch (err) {
      console.error('Failed to create LUT folder:', err);
      toast.error(String(err));
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60">
      <div className="w-72 rounded-lg border border-surface bg-bg-secondary p-3 shadow-2xl">
        <span className="mb-2 block select-none text-sm text-text-primary">{t('ui.lut.newFolder')}</span>
        <input
          ref={inputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit();
            if (event.key === 'Escape') close();
          }}
          enterKeyHint="done"
          placeholder={t('ui.lut.folderName')}
          className="w-full rounded-md bg-bg-tertiary px-2 py-2 text-sm outline-none"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={close}
            className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:bg-surface"
          >
            {t('ui.lut.cancel')}
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-accent px-3 py-1.5 text-xs text-button-text"
          >
            {t('ui.lut.confirm')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
