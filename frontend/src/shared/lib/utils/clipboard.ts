/**
 * @file: clipboard.ts
 * @description: Утилита для работы с буфером обмена
 * @created: 2025-01-XX
 */

/**
 * Копирует текст в буфер обмена
 * @param text - текст для копирования
 * @returns Promise<boolean> - true если успешно, false если ошибка
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (err) {
        textArea.remove();
        return false;
      }
    }
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}

