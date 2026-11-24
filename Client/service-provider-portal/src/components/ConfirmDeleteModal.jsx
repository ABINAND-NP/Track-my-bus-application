import { AlertTriangle, Trash2, X } from "lucide-react";

/**
 * Reusable confirmation popup for delete actions.
 *
 * Props:
 *  isOpen       {boolean}   – controls visibility
 *  onClose      {function}  – called when user cancels or clicks backdrop
 *  onConfirm    {function}  – called when user confirms deletion
 *  isDeleting   {boolean}   – shows spinner on confirm button while request is in-flight
 *  title        {string}    – modal heading  (default: "Confirm Delete")
 *  description  {string}    – body text explaining what will be deleted
 *  itemName     {string}    – highlighted name shown in the description area
 *  itemRole     {string}    – e.g. "Staff (HR)", "Driver", "Conductor"
 */
export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "Confirm Deletion",
  description,
  itemName = "",
  itemRole = "member",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-rose-500/30 shadow-2xl shadow-rose-500/10 z-10 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone</p>
              </div>
            </div>

            {!isDeleting && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="mb-6 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
            {description ? (
              <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">
                You are about to permanently delete the {itemRole}{" "}
                <span className="font-bold text-white">&quot;{itemName}&quot;</span>.
                Their account and all associated data will be removed immediately.
              </p>
            )}
            <p className="text-xs text-rose-400/80 font-medium mt-1">
              ⚠ This cannot be reversed. Please confirm carefully.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete Permanently</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

