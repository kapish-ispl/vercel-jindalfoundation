// middleware.ts  (project root, next to /app — or /src if you use a src folder)
import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "jindalfoundation.com";

// Junk query parameters that should be dropped (keys are matched by substring).
const JUNK_PARAMS = ["whoisdatacenter"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  let changed = false;

  // 1. www -> non-www (production only, so localhost / preview URLs keep working)
  const host = req.headers.get("host") ?? "";
  if (host === `www.${CANONICAL_HOST}`) {
    url.host = CANONICAL_HOST;
    url.port = "";
    changed = true;
  }

  // 2. Lowercase the path
  let path = url.pathname;
  const lower = path.toLowerCase();
  if (path !== lower) {
    path = lower;
    changed = true;
  }

  // 3. Remove trailing slash (except root) so we don't create a chain with
  //    Next.js' own trailing-slash 308
  if (path.length > 1 && path.endsWith("/")) {
    path = path.replace(/\/+$/, "");
    changed = true;
  }

  // 4. /home -> /
  if (path === "/home") {
    path = "/";
    changed = true;
  }

  // 5. Drop junk query params, keep everything else (UTM, gclid, etc.)
  for (const key of Array.from(url.searchParams.keys())) {
    if (JUNK_PARAMS.some((junk) => key.toLowerCase().includes(junk))) {
      url.searchParams.delete(key);
      changed = true;
    }
  }

  // One single 308, never a chain
  if (changed) {
    url.pathname = path;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (.png, .css, .xml ...)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};