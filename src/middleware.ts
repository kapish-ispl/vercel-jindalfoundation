import { NextResponse, type NextRequest } from "next/server";
import { CANONICAL_HOST, normalizePagePath } from "@/lib/seo";

// Junk query parameters that should be dropped (keys are matched by substring).
const JUNK_PARAMS = ["whoisdatacenter"];

export function middleware(req: NextRequest) {
  // Native URL avoids NextURL re-appending the request's original trailing slash.
  const url = new URL(req.nextUrl.toString());
  let changed = false;

  // Only production hosts are forced to HTTPS; local and preview hosts still work.
  const host = (req.headers.get("host") ?? url.host).split(":")[0].toLowerCase();
  if (host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`) {
    changed = url.host !== CANONICAL_HOST || url.protocol !== "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    url.protocol = "https:";
  }

  const path = normalizePagePath(url.pathname);
  changed = changed || path !== url.pathname;

  // 5. Drop junk query params, keep everything else (UTM, gclid, etc.)
  for (const key of Array.from(url.searchParams.keys())) {
    if (JUNK_PARAMS.some((junk) => key.toLowerCase().includes(junk))) {
      url.searchParams.delete(key);
      changed = true;
    }
  }

  // Combine all application-level normalization into one permanent redirect.
  if (changed) {
    url.pathname = path;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Preserve case-sensitive assets and API paths, including dotted filenames.
  matcher: ["/((?!_next/|api/|api$|.*\\..*).*)"],
};
