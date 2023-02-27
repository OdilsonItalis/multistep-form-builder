import React, { useMemo, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';

export default function useToastMessage() {
  const { addToast, removeAllToasts } = useToasts();
  const showSuccess = useCallback(
    (message = 'Success', persistent = false) => {
      addToast(<span>{message}</span>, {
        appearance: 'success',
        autoDismiss: !persistent,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (message = 'Error! Something went wrong', persistent = false) => {
      addToast(<span>{message}</span>, {
        appearance: 'error',
        autoDismiss: !persistent,
      });
    },
    [addToast]
  );

  const clearAll = useCallback(() => {
    removeAllToasts();
  }, [removeAllToasts]);

  return useMemo(
    () => ({ showSuccess, showError, clearAll }),
    [showSuccess, showError, clearAll]
  );
}
