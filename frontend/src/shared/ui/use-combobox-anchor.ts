import * as React from "react"

/**
 * Хук для создания anchor элемента для Combobox
 * @returns Ref для anchor элемента
 */
export function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

