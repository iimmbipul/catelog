/* Fails the build if an admin page, server action or route handler can run
 * without calling requireAdmin() first. See src/lib/auth.ts for why neither the
 * admin layout nor proxy.ts is enough. Reads source files only.
 *
 *   node scripts/check-admin-guards.mjs
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ADMIN_DIR = "src/app/admin";

/* These two hold no data: each only redirects to the Clerk auth pages. */
const NO_GUARD_NEEDED = new Set([
  "src/app/admin/login/page.tsx",
  "src/app/admin/logout/route.ts",
]);

const GUARD = /^\s*await requireAdmin\(\);\s*$/;
const USE_SERVER = /^\s*["']use server["'];?\s*$/;
const HANDLER = /^export (async function|function|const) (GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS)\b/;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name).replaceAll("\\", "/");
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const problems = [];

/* The entry point opens on line `i` and its first statement must be the guard. */
function expectGuard(file, lines, i) {
  const opensAsyncFn = /^export (default )?async function .*\{$/.test(lines[i].trim());
  if (!opensAsyncFn || !GUARD.test(lines[i + 1] ?? "")) {
    problems.push(`${file}:${i + 1}  first statement must be await requireAdmin();`);
  }
}

for (const file of walk(ADMIN_DIR)) {
  if (!/\.tsx?$/.test(file) || NO_GUARD_NEEDED.has(file)) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const name = file.split("/").pop();
  const isActionFile = USE_SERVER.test(lines.find((l) => l.trim()) ?? "");

  lines.forEach((line, i) => {
    if (USE_SERVER.test(line) && !(isActionFile && !lines.slice(0, i).some((l) => l.trim()))) {
      problems.push(`${file}:${i + 1}  inline "use server" is not checked; move it to an actions.ts`);
    }
    if (isActionFile && line.startsWith("export ")) expectGuard(file, lines, i);
    if (name === "page.tsx" && line.startsWith("export default")) expectGuard(file, lines, i);
    if (name === "route.ts" && HANDLER.test(line)) expectGuard(file, lines, i);
  });
}

if (problems.length) {
  console.error(`Admin guard check failed:\n${problems.map((p) => `  ${p}`).join("\n")}`);
  process.exit(1);
}
console.log("Admin guard check passed.");
