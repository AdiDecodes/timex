"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CustomCodeSettings } from "@/services/seo";

interface CustomCodeInjectorProps {
  initialSettings?: CustomCodeSettings;
}

export function CustomCodeInjector({ initialSettings }: CustomCodeInjectorProps) {
  const pathname = usePathname();
  const currentSettingsRef = useRef<CustomCodeSettings | undefined>(initialSettings);

  useEffect(() => {
    // SECURITY & ISOLATION: Never run custom code inside /admin
    if (pathname?.startsWith("/admin")) {
      cleanupCustomCode();
      return;
    }

    const executeInjection = (config: CustomCodeSettings | undefined) => {
      if (!config) return;

      // If disabled, remove all existing custom injected code
      if (!config.enabled) {
        cleanupCustomCode();
        return;
      }

      cleanupCustomCode();

      // 1. Inject Head Code
      if (config.head_code && config.head_code.trim()) {
        injectSnippet(config.head_code, "head", "custom-head-element");
      }

      // 2. Inject Body Start Code
      if (config.body_start_code && config.body_start_code.trim()) {
        injectSnippet(config.body_start_code, "body-start", "custom-body-start-element");
      }

      // 3. Inject Body End Code
      if (config.body_end_code && config.body_end_code.trim()) {
        injectSnippet(config.body_end_code, "body-end", "custom-body-end-element");
      }
    };

    // Apply initial settings immediately
    executeInjection(currentSettingsRef.current);

    // Live Rehydration: fetch latest custom code from API
    fetch(`/api/v1/seo/custom-code?_t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.custom_code) {
          currentSettingsRef.current = data.custom_code;
          executeInjection(data.custom_code);
        }
      })
      .catch(() => {});

    return () => {
      // Keep on navigation unless navigating into /admin
    };
  }, [pathname]);

  return null;
}

function cleanupCustomCode() {
  if (typeof document === "undefined") return;
  const elements = document.querySelectorAll("[data-timex-custom-code='true']");
  elements.forEach((el) => el.remove());
}

function injectSnippet(html: string, target: "head" | "body-start" | "body-end", marker: string) {
  if (typeof document === "undefined" || !html) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const container = doc.body.firstElementChild;
  if (!container) return;

  const nodes = Array.from(container.childNodes);

  nodes.forEach((node) => {
    let elementToInsert: Node | null = null;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // Handle Script tags: browsers do not execute scripts created via innerHTML
      if (el.tagName.toLowerCase() === "script") {
        const script = document.createElement("script");
        Array.from(el.attributes).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });
        script.text = el.innerHTML;
        script.setAttribute("data-timex-custom-code", "true");
        script.setAttribute("data-timex-slot", marker);
        elementToInsert = script;
      } else {
        const cloned = el.cloneNode(true) as HTMLElement;
        cloned.setAttribute("data-timex-custom-code", "true");
        cloned.setAttribute("data-timex-slot", marker);
        elementToInsert = cloned;
      }
    } else if (node.nodeType === Node.COMMENT_NODE) {
      elementToInsert = node.cloneNode(true);
    }

    if (elementToInsert) {
      if (target === "head") {
        document.head.appendChild(elementToInsert);
      } else if (target === "body-start") {
        if (document.body.firstChild) {
          document.body.insertBefore(elementToInsert, document.body.firstChild);
        } else {
          document.body.appendChild(elementToInsert);
        }
      } else if (target === "body-end") {
        document.body.appendChild(elementToInsert);
      }
    }
  });
}
