import toast from 'react-hot-toast';

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export async function copyToClipboard({
  text,
  event,
}: {
  text: string;
  event?: React.MouseEvent | Event;
}) {
  event?.stopPropagation?.();

  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (err) {
    toast.error('Failed to copy!');
  }
}
