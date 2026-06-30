import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar accion',
  message,
  confirmLabel = 'Eliminar',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="mb-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
      <p className="text-sm leading-6">{message}</p>
    </div>
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        disabled={loading}
        className="premium-button-secondary"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-red-700 disabled:opacity-50"
      >
        <Trash2 size={16} aria-hidden="true" />
        {loading ? 'Eliminando...' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
