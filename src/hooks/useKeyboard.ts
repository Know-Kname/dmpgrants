import { useEffect } from 'react';

/**
 * Hook to handle keyboard shortcuts
 * @param key - The key to listen for (e.g., 'Escape', 'Enter')
 * @param callback - Function to call when key is pressed
 * @param deps - Dependencies array
 */
export function useKeyboard(
  key: string,
  callback: (event: KeyboardEvent) => void,
  deps: any[] = []
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, ...deps]);
}

/**
 * Hook to handle keyboard combinations (e.g., Ctrl+S)
 * @param keys - Object with modifier keys and main key
 * @param callback - Function to call when combination is pressed
 * @param deps - Dependencies array
 */
export function useKeyboardCombo(
  keys: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    key: string;
  },
  callback: (event: KeyboardEvent) => void,
  deps: any[] = []
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const ctrlMatch = keys.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = keys.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = keys.alt ? event.altKey : !event.altKey;

      if (ctrlMatch && shiftMatch && altMatch && event.key === keys.key) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [keys.ctrl, keys.shift, keys.alt, keys.key, ...deps]);
}
