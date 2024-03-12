"use client";

import { useEffect, useState } from "react";

import { isBrowser } from "@/utils/browser";

export const VaulBodyPatcher = () => {
  const [observer, setObserver] = useState<MutationObserver | null>(null);

  useEffect(() => {
    const obs = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        const body = mutation.target as HTMLBodyElement;
        if (body.style.cssText === "right: unset;") {
          body.style.right = "";
        }
      }
    });
    setObserver(obs);
  }, [setObserver]);

  useEffect(() => {
    if (!isBrowser) return;

    observer?.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
      childList: false,
      subtree: false,
    });

    return () => {
      observer?.disconnect();
    };
  }, [observer]);

  return null;
};
