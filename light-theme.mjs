import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = "C:\\Projects\\paid-ads-platform";

// Files/dirs to skip
const SKIP = ["node_modules", ".next", ".git", "light-theme.mjs"];

function allTsx(dir) {
  const results = [];
  for (const f of readdirSync(dir)) {
    if (SKIP.some(s => f.startsWith(s))) continue;
    const full = join(dir, f);
    if (statSync(full).isDirectory()) results.push(...allTsx(full));
    else if ([".tsx", ".ts", ".css"].includes(extname(f))) results.push(full);
  }
  return results;
}

// Ordered replacements — most specific first
const R = [
  // ── Backgrounds ──────────────────────────────────────────────
  [/bg-\[#0e0e14\]/g,          "bg-slate-50"],
  [/bg-\[#111116\]/g,          "bg-white"],
  [/bg-\[#1c1c24\]/g,          "bg-white"],
  [/bg-\[#14141a\]\/80/g,      "bg-white/90"],
  // Chart tooltip / inline style hex
  [/"#0e0e14"/g,               '"#f8fafc"'],
  [/"#1c1c24"/g,               '"#ffffff"'],
  [/"#111116"/g,               '"#ffffff"'],
  // Subtle bg overlays
  [/bg-white\/15/g,            "bg-slate-200"],
  [/bg-white\/12/g,            "bg-slate-200"],
  [/bg-white\/10/g,            "bg-slate-200"],
  [/bg-white\/8/g,             "bg-slate-100"],
  [/bg-white\/6/g,             "bg-slate-100"],
  [/bg-white\/5/g,             "bg-slate-100"],
  [/bg-white\/4/g,             "bg-slate-50"],
  [/bg-white\/3/g,             "bg-slate-50"],
  [/bg-white\/1\b/g,           "bg-white"],
  // Hover bg
  [/hover:bg-white\/12/g,      "hover:bg-slate-100"],
  [/hover:bg-white\/10/g,      "hover:bg-slate-100"],
  [/hover:bg-white\/5/g,       "hover:bg-slate-100"],
  [/hover:bg-white\/3/g,       "hover:bg-slate-50"],

  // ── Borders ──────────────────────────────────────────────────
  [/border-white\/25/g,        "border-slate-300"],
  [/border-white\/15/g,        "border-slate-200"],
  [/border-white\/12/g,        "border-slate-200"],
  [/border-white\/10/g,        "border-slate-200"],
  [/border-white\/8/g,         "border-slate-200"],
  [/border-white\/6/g,         "border-slate-200"],
  [/hover:border-white\/25/g,  "hover:border-slate-400"],
  [/hover:border-white\/15/g,  "hover:border-slate-300"],
  [/hover:border-white\/12/g,  "hover:border-slate-300"],
  // Inline border style
  [/"1px solid rgba\(255,255,255,0\.1\)"/g, '"1px solid #e2e8f0"'],
  [/"1px solid rgba\(255,255,255,0\.08\)"/g, '"1px solid #e2e8f0"'],

  // ── Text ─────────────────────────────────────────────────────
  // Chart tick/legend colors
  [/"#64748b"/g,               '"#94a3b8"'],   // axis ticks stay muted
  [/"#94a3b8"/g,               '"#64748b"'],   // legend → slightly darker
  [/"#f1f5f9"/g,               '"#0f172a"'],   // tooltip text dark → light bg
  // Tailwind text classes — order matters (more specific first)
  [/text-slate-600(?!\d)/g,    "text-slate-500"],
  [/hover:text-slate-300/g,    "hover:text-slate-700"],
  [/hover:text-slate-200/g,    "hover:text-slate-800"],
  [/hover:text-white(?=[ "'"])/g, "hover:text-slate-900"],
  // Primary text: text-white on its own (not on colored bg like text-white inside bg-blue-600 elements)
  // We replace text-white that's followed by a space or quote or closing paren (class attribute context)
  // text-white as standalone text class
  [/\btext-white\b/g,          "text-slate-900"],
  // text-slate-100 (rare, very light text)
  [/text-slate-100(?!\d)/g,    "text-slate-800"],
  [/text-slate-300(?!\d)/g,    "text-slate-700"],

  // ── Active nav / selected states ─────────────────────────────
  [/bg-blue-600\/20 text-blue-400 border border-blue-500\/20/g,
   "bg-blue-50 text-blue-700 border border-blue-200"],

  // ── Placeholder ──────────────────────────────────────────────
  [/placeholder:text-slate-500/g, "placeholder:text-slate-400"],

  // ── Scrollbar ────────────────────────────────────────────────
  [/rgba\(255, 255, 255, 0\.1\)/g, "rgba(0,0,0,0.12)"],
  [/rgba\(255, 255, 255, 0\.2\)/g, "rgba(0,0,0,0.2)"],
];

let totalChanges = 0;
for (const file of allTsx(ROOT)) {
  let src = readFileSync(file, "utf8");
  let out = src;
  for (const [from, to] of R) out = out.replace(from, to);
  if (out !== src) {
    writeFileSync(file, out, "utf8");
    const count = R.reduce((n, [from]) => n + (src.match(from) || []).length, 0);
    console.log(`✓ ${file.replace(ROOT, "").replace(/\\/g, "/")}  (${count} replacements)`);
    totalChanges++;
  }
}
console.log(`\nDone — ${totalChanges} files updated.`);
