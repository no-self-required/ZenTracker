import { useEffect } from 'react';

export const useGlobalKeyListener = (handleKeydown) => {
  useEffect(() => {
    const listener = (event) => {
      // Check if the event occurred outside of input or textarea elements
      if (!['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        handleKeydown(event);
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleKeydown]);
};