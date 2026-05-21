import fs from "fs";
import path from "path";

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, list);
    else if (name.endsWith(".tsx")) list.push(p);
  }
  return list;
}

const tokens = new Set();

function ingest(str) {
  if (!str) return;
  const noExpr = String(str).replace(/\$\{[^}]+\}/g, " ");
  noExpr.split(/\s+/).forEach((t) => {
    const x = t.trim();
    if (!x || x.startsWith("//")) return;
    if (x.startsWith("styles.")) return;
    tokens.add(x);
  });
}

function extractFromContent(c) {
  for (const m of c.matchAll(/className="([^"]*)"/g)) ingest(m[1]);
  for (const m of c.matchAll(/className=\{\`([\s\S]*?)\`\}/g)) ingest(m[1]);
  const navDef = [...c.matchAll(/const\s+(\w+)\s*=\s*"([^"]*)"/g)];
  const map = {};
  navDef.forEach((m) => (map[m[1]] = m[2]));
  const templateBlocks = [...c.matchAll(/\`([\s\S]*?)\`/g)].map((m) => m[1]);
  for (const blk of templateBlocks) {
    if (blk.includes("className")) continue;
    if (/\$\{.*?navLink|\$\{.*?Active|\$\{/g.test(blk)) ingest(blk);
  }
}

const files = walk("src");
for (const f of files) extractFromContent(fs.readFileSync(f, "utf8"));

const out = [...tokens].filter(Boolean).sort();
fs.writeFileSync("_class-tokens.json", JSON.stringify(out, null, 0));
console.log("count:", out.length);
console.log(out.slice(0, 100).join("\n"));
