"use client";

import { useState, useEffect } from "react";
import {
  NAVIGATION_FILTER_GROUPS,
  NavigationFilterGroup,
  FilterItem,
  buildDynamicFilterGroups,
} from "@/data/navigationFilters";

// Module-level in-memory cache and promise deduplication
let cachedFilterGroups: NavigationFilterGroup[] | null = null;
let inflightPromise: Promise<NavigationFilterGroup[] | null> | null = null;

async function fetchDynamicTaxonomies(): Promise<NavigationFilterGroup[] | null> {
  if (inflightPromise) return inflightPromise;

  inflightPromise = (async () => {
    try {
      const [catsRes, spacesRes] = await Promise.all([
        fetch(`/api/v1/taxonomies/categories?status=published`),
        fetch(`/api/v1/spaces?status=published`),
      ]);

      let catItems: FilterItem[] | undefined;
      let spaceItems: FilterItem[] | undefined;

      if (catsRes.ok) {
        const catsData = await catsRes.json();
        if (Array.isArray(catsData.categories) && catsData.categories.length > 0) {
          catItems = catsData.categories
            .filter((c: any) => c.status !== "draft")
            .map((c: any) => ({
              name: c.name,
              href: `/product-category/${c.slug}`,
              slug: c.slug,
              filterKey: "category",
              filterValue: c.slug,
            }));
        }
      }

      if (spacesRes.ok) {
        const spacesData = await spacesRes.json();
        if (Array.isArray(spacesData.spaces) && spacesData.spaces.length > 0) {
          spaceItems = spacesData.spaces
            .filter((s: any) => s.status !== "draft" && !s.name.toLowerCase().includes("rooftop"))
            .map((s: any) => ({
              name: s.name,
              href: `/${s.slug}`,
              slug: s.slug,
              filterKey: "space",
              filterValue: s.name,
            }));
        }
      }

      if (catItems || spaceItems) {
        const groups = buildDynamicFilterGroups(catItems, spaceItems);
        cachedFilterGroups = groups;
        return groups;
      }
      return null;
    } catch (err) {
      console.warn("Could not rehydrate dynamic navigation filters:", err);
      return null;
    } finally {
      inflightPromise = null;
    }
  })();

  return inflightPromise;
}

export function useNavigationFilterGroups(): NavigationFilterGroup[] {
  const [filterGroups, setFilterGroups] = useState<NavigationFilterGroup[]>(
    () => cachedFilterGroups || NAVIGATION_FILTER_GROUPS
  );

  useEffect(() => {
    let isMounted = true;

    // If not cached yet, fetch once
    if (!cachedFilterGroups) {
      fetchDynamicTaxonomies().then((groups) => {
        if (isMounted && groups) {
          setFilterGroups(groups);
        }
      });
    }

    const handleUpdate = () => {
      cachedFilterGroups = null;
      fetchDynamicTaxonomies().then((groups) => {
        if (isMounted && groups) {
          setFilterGroups(groups);
        }
      });
    };

    window.addEventListener("timex-taxonomy-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("timex-taxonomy-updated", handleUpdate);
    };
  }, []);

  return filterGroups;
}
