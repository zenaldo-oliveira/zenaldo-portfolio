"use client";

import { useCallback, useSyncExternalStore } from "react";

type HtmlPreferenceConfig<T extends string> = {
  // Atributo no <html> (ex.: data-theme). Também é aplicado antes do primeiro
  // paint pelo script inline de app/layout.tsx — por isso o estado vive no
  // DOM, não no React: evita flash e mantém todas as instâncias em sincronia.
  attribute: string;
  storageKey: string;
  fallback: T;
  parse: (value: string | null) => T;
  // Valor gravado no atributo/localStorage; null remove o atributo.
  serialize: (value: T) => string | null;
};

// Preferência persistida (localStorage) e refletida em um atributo do <html>.
// Qualquer componente que use o mesmo hook lê o mesmo valor — nunca há duas
// fontes de verdade (problema do antigo ThemeToggle com estado local).
export function createHtmlPreference<T extends string>(
  config: HtmlPreferenceConfig<T>,
) {
  const { attribute, storageKey, fallback, parse, serialize } = config;

  function subscribe(onChange: () => void) {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attribute],
    });
    return () => observer.disconnect();
  }

  function getSnapshot(): T {
    return parse(document.documentElement.getAttribute(attribute));
  }

  function getServerSnapshot(): T {
    return fallback;
  }

  function write(value: T) {
    const serialized = serialize(value);

    if (serialized === null) {
      document.documentElement.removeAttribute(attribute);
    } else {
      document.documentElement.setAttribute(attribute, serialized);
    }

    try {
      window.localStorage.setItem(storageKey, serialized ?? "");
    } catch {
      // Storage indisponível (modo privado/bloqueado): a preferência vale só
      // para esta visita — o atributo já foi aplicado acima.
    }
  }

  return function usePreference(): [T, (value: T) => void] {
    const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const setValue = useCallback((next: T) => write(next), []);
    return [value, setValue];
  };
}
