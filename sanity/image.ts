import imageUrlBuilder, {
  type ImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { sanityEnv } from "./env";

const builder = sanityEnv.isConfigured
  ? imageUrlBuilder({
      dataset: sanityEnv.dataset,
      projectId: sanityEnv.projectId,
    })
  : null;

/**
 * Builds a Sanity CDN image URL without requiring Next.js runtime image
 * optimization. Returns null while Sanity is not connected.
 */
export function urlForImage(
  source: SanityImageSource,
): ImageUrlBuilder | null {
  return builder?.image(source) ?? null;
}

