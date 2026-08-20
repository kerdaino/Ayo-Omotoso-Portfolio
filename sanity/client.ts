import { createClient, type SanityClient } from "@sanity/client";

import { sanityEnv } from "./env";

let publicClient: SanityClient | null | undefined;

/**
 * Returns a token-free client for published public content, or null while this
 * repository is intentionally disconnected from a Sanity project.
 */
export function getSanityClient(): SanityClient | null {
  if (!sanityEnv.isConfigured) {
    return null;
  }

  if (publicClient === undefined) {
    publicClient = createClient({
      apiVersion: sanityEnv.apiVersion,
      dataset: sanityEnv.dataset,
      perspective: "published",
      projectId: sanityEnv.projectId,
      // Static builds should read the freshest published content once at build time.
      useCdn: false,
    });
  }

  return publicClient;
}

