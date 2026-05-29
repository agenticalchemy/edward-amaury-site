import { useEffect } from "react";

interface OgMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

function setMeta(property: string, content: string, attrName: "name" | "property" = "property") {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function useOgMeta(meta: OgMeta) {
  useEffect(() => {
    const url = meta.url ?? window.location.href;
    const image = meta.image ?? `${window.location.origin}/opengraph.jpg`;
    const type = meta.type ?? "website";

    if (meta.title) {
      setMeta("og:title", meta.title);
      setMeta("twitter:title", meta.title, "name");
    }
    if (meta.description) {
      setMeta("og:description", meta.description);
      setMeta("twitter:description", meta.description, "name");
    }
    setMeta("og:image", image);
    setMeta("twitter:image", image, "name");
    setMeta("og:url", url);
    setMeta("og:type", type);
    setMeta("twitter:card", "summary_large_image", "name");
  }, [meta.title, meta.description, meta.image, meta.url, meta.type]);
}
