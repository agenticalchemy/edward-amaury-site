import { useEffect } from "react";

export function useJsonLd(id: string, data: object) {
  useEffect(() => {
    const elementId = `jsonld-${id}`;
    let script = document.getElementById(elementId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = elementId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(data);

    return () => {
      const cleanup = document.getElementById(elementId);
      if (cleanup) cleanup.remove();
    };
  }, [id, data]);
}
