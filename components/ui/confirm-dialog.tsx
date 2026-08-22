'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, Trash2, X, AlertCircle } from 'lucide-react';

export type DialogVariant = 'danger' | 'warning' | 'info' | 'success' | 'default';
export type DialogType = 'confirm' | 'alert';

export interface ConfirmDialogProps {
  isOpen: boolean;
  type?: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  type = 'confirm',
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter') {
        onConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  // Icon & Style configuration by variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-red-600" />,
          iconBg: 'bg-red-100 border-red-200',
          confirmBtnBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white shadow-xs',
          defaultConfirmText: 'Yes, Delete',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-100 border-amber-200',
          confirmBtnBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white shadow-xs',
          defaultConfirmText: 'Confirm',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          iconBg: 'bg-emerald-100 border-emerald-200',
          confirmBtnBg: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white shadow-xs',
          defaultConfirmText: 'OK',
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6 text-sky-600" />,
          iconBg: 'bg-sky-100 border-sky-200',
          confirmBtnBg: 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 text-white shadow-xs',
          defaultConfirmText: 'OK',
        };
      case 'default':
      default:
        return {
          icon: <AlertCircle className="w-6 h-6 text-slate-700" />,
          iconBg: 'bg-slate-100 border-slate-200',
          confirmBtnBg: 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-700 text-white shadow-xs',
          defaultConfirmText: 'Confirm',
        };
    }
  };

  const style = getVariantStyles();
  const finalConfirmText = confirmText || (type === 'alert' ? 'OK' : style.defaultConfirmText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl border ${style.iconBg} shrink-0`}>
              {style.icon}
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-900 leading-6">{title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{message}</p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {type === 'confirm' && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${style.confirmBtnBg}`}
            >
              {finalConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
