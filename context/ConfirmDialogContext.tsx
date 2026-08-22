'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmDialog, { DialogVariant, DialogType } from '@/components/ui/confirm-dialog';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
}

export interface AlertOptions {
  title: string;
  message: string;
  confirmText?: string;
  variant?: DialogVariant;
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  showAlert: (options: AlertOptions | string, message?: string) => Promise<void>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: DialogType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: DialogVariant;
    resolveFn?: (value: boolean) => void;
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        isOpen: true,
        type: 'confirm',
        title: options.title,
        message: options.message,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        variant: options.variant || 'danger',
        resolveFn: resolve,
      });
    });
  }, []);

  const showAlert = useCallback((options: AlertOptions | string, message?: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      const title = typeof options === 'string' ? 'Notice' : options.title;
      const msg = typeof options === 'string' ? options : (message || options.message);
      const variant = typeof options === 'string' ? 'info' : (options.variant || 'info');
      const confirmText = typeof options === 'string' ? 'OK' : (options.confirmText || 'OK');

      setDialogState({
        isOpen: true,
        type: 'alert',
        title,
        message: msg,
        confirmText,
        variant,
        resolveFn: () => resolve(),
      });
    });
  }, []);

  const handleConfirm = () => {
    if (dialogState.resolveFn) {
      dialogState.resolveFn(true);
    }
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (dialogState.resolveFn) {
      dialogState.resolveFn(false);
    }
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm, showAlert }}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        variant={dialogState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
}
