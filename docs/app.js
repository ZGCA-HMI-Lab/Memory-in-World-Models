// 知识地图：纵向是分类树（任意层级），横向是时间（新的在左）。
// 所有分类、名称和论文都从 config.json 指向的数据文件读取，页面不写死内容。

const UI = {
  zh: { other: "EN", load: "数据加载失败：", ranges: { "6": "近半年", "12": "近一年", all: "全部" },
        newer: "更新", earlier: "更早", themes: { auto: "跟随系统", light: "浅色", dark: "深色" }, older: n => `${n} 篇 · 点击展开`, fold: "收起", year: y => `${y} 年`, mon: m => `${m}月`, noMonth: "未注明月份", keyTip: n => `本月同类被引最多（${n} 次）` },
  en: { other: "中文", load: "Could not load data: ", ranges: { "6": "6 months", "12": "1 year", all: "All" },
        newer: "Newer", earlier: "Older", themes: { auto: "Auto", light: "Light", dark: "Dark" }, older: n => `${n} papers · expand`, fold: "Collapse", year: y => y, mon: m => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1], noMonth: "No month", keyTip: n => `Most cited in its category this month (${n})` },
};

let CFG, ROOT, BY = {}, LATEST, ROWS = [], COLS = [];
const S = { lang: "zh", range: "12", open: new Set(), years: new Set(), sel: null };

// 外观：默认浅色，可切到深色或跟随系统；选择记在本浏览器里（读写失败时按浅色处理）
const THEMES = ["light", "dark", "auto"];
let THEME = "light";
try { THEME = THEMES.includes(localStorage.getItem("theme")) ? localStorage.getItem("theme") : "light"; } catch (e) {}
function applyTheme() {
  if (typeof document === "undefined") return;
  if (THEME === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = THEME;
}
applyTheme();

async function boot() {
  try {
    // 数据文件每次都向服务器确认是否更新，避免改了数据浏览器仍用旧的
    const get = u => fetch(u, { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(`${u} ${r.status}`); return r.json(); });
    CFG = await get("config.json");
    const [tax, papers, cites] = await Promise.all([get(CFG.taxonomy), get(CFG.papers), CFG.cites ? get(CFG.cites) : []]);
    build(tax, papers);
    marks(cites, CFG.key || {});
    lineage(cites);
  } catch (e) { const el = document.getElementById("err"); el.hidden = false; el.textContent = UI[S.lang].load + e.message; return; }
  S.lang = CFG.lang || "zh";
  S.range = String(CFG.recent_months || 12);
  document.getElementById("lang").onclick = () => { S.lang = S.lang === "zh" ? "en" : "zh"; render(); };
  document.getElementById("theme").onclick = () => {
    THEME = THEMES[(THEMES.indexOf(THEME) + 1) % THEMES.length];
    try { localStorage.setItem("theme", THEME); } catch (e) {}
    applyTheme(); render();
  };
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && S.sel) unselect();
    else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) { e.preventDefault(); page(e.key === "ArrowLeft" ? -1 : 1); }
  });
  render();
}

// taxonomy.json → 树。任意深度；末端节点用 code 关联论文编号前缀。
function build(tax, papers) {
  const byLeaf = {};
  papers.filter(p => p.tag).forEach(p => { const c = p.tag.slice(0, p.tag.lastIndexOf(".")); (byLeaf[c] = byLeaf[c] || []).push(p); });
  let auto = 0;
  const make = (n, parent, depth, color) => {
    const pre = x => x.code ? x.code.split(".")[0] : (x.children || []).map(pre).find(Boolean);
    const node = { id: n.code || (depth === 1 ? pre(n) : null) || `n${auto++}`, name: { zh: n.name_zh || n.title_zh, en: n.name || n.title }, parent, depth, color, kids: [] };
    BY[node.id] = node;
    (n.children || []).forEach((c, i) => node.kids.push(make(c, node, depth + 1, depth === 0 ? `var(--c${i % 8})` : color)));
    node.papers = (n.code ? byLeaf[n.code] || [] : []).concat(...node.kids.map(k => k.papers));
    node.papers.forEach(p => { if (!p._leaf && n.code) p._leaf = node; });
    return node;
  };
  ROOT = make({ ...tax, children: tax.children }, null, 0, "var(--muted)");
  BY.root = ROOT; ROOT.id = "root"; delete BY[Object.keys(BY).find(k => BY[k] === ROOT && k !== "root")];
  LATEST = ROOT.papers.map(p => p.date).filter(d => d.length >= 7).sort().pop().slice(0, 7);
}

// 代表论文：同一末端分类、同一个月发表的论文里，被本分类其他论文引用最多的那篇（并列时最多 max 篇）。
// 当月只有一篇，或当月都还没被引用（少于 min 次），就不标。只用引用关系，不读论文内容。
function marks(cites, opt) {
  const min = opt.min || 1, max = opt.max || 2;
  Object.values(BY).filter(n => !n.kids.length && n !== ROOT).forEach(n => {
    const own = new Set(n.papers.map(p => p.id)), cnt = {}, months = {};
    cites.forEach(([a, b]) => { if (own.has(a) && own.has(b)) cnt[b] = (cnt[b] || 0) + 1; });
    n.papers.forEach(p => (months[monthKey(p.date)] = months[monthKey(p.date)] || []).push(p));
    Object.values(months).forEach(ps => {
      if (ps.length < 2) return;
      const top = Math.max(...ps.map(p => cnt[p.id] || 0)), win = ps.filter(p => (cnt[p.id] || 0) === top);
      if (top >= min && win.length <= max) win.forEach(p => p._key = top);
    });
  });
}

// 同类沿袭：同一末端分类内"新论文引用旧论文"的关系。
// 去掉逆时间方向的引用（修订版互引造成），再去掉能经由其他论文绕到的边，只留直接前驱。
// 结果存在 p._up（它直接沿用的论文）和 p._down（直接沿用它的论文）。
function lineage(cites) {
  const byId = {};
  ROOT.papers.forEach(p => { byId[p.id] = p; p._up = []; p._down = []; });
  const same = (a, b) => a && b && a._leaf && a._leaf === b._leaf;
  const pairs = new Set(cites.map(([a, b]) => a + " " + b));
  const up = {};
  cites.forEach(([a, b]) => {
    const pa = byId[a], pb = byId[b];
    if (!same(pa, pb)) return;
    const d = pa.date.localeCompare(pb.date);
    if (d < 0 || (d === 0 && pairs.has(b + " " + a))) return;
    (up[a] = up[a] || []).push(b);
  });
  const reach = (from, to, skip) => {
    const seen = new Set(), stack = (up[from] || []).filter(x => x !== skip);
    while (stack.length) { const x = stack.pop(); if (x === to) return true; if (seen.has(x)) continue; seen.add(x); stack.push(...(up[x] || [])); }
    return false;
  };
  Object.entries(up).forEach(([a, bs]) => bs.forEach(b => {
    if (reach(a, b, b)) return;
    byId[a]._up.push(byId[b]); byId[b]._down.push(byId[a]);
  }));
}
// 一篇论文的整条沿袭：所有上游和下游
function reach(p, dir) {
  const out = new Set();
  const walk = x => x[dir].forEach(y => { if (!out.has(y)) { out.add(y); walk(y); } });
  walk(p);
  return out;
}
function chain(p) { return new Set([p, ...reach(p, "_up"), ...reach(p, "_down")]); }

// 当前可见的行：焦点节点的子树，按展开状态逐层列出
function visibleRows() {
  const f = ROOT, rows = [];
  const walk = (n, lvl) => { rows.push({ node: n, lvl, open: n.kids.length > 0 && S.open.has(n.id) }); if (n.kids.length && S.open.has(n.id)) n.kids.forEach(k => walk(k, lvl + 1)); };
  if (f.kids.length) f.kids.forEach(k => walk(k, 0)); else rows.push({ node: f, lvl: 0, open: false });
  return rows;
}

const monthKey = d => d.length >= 7 ? d.slice(0, 7) : d.slice(0, 4) + "-00";
const addMonths = (k, n) => { let y = +k.slice(0, 4), m = +k.slice(5, 7) + n; while (m < 1) { m += 12; y--; } while (m > 12) { m -= 12; y++; } return `${y}-${String(m).padStart(2, "0")}`; };

// 时间列：近期窗口逐月（新的在左）；窗口外按年折叠，点开后逐月
function columns(rows) {
  const papers = rows.filter(r => !r.open).flatMap(r => r.node.papers);
  const keys = new Set(papers.map(p => monthKey(p.date)));
  const cols = [];
  if (S.range === "all") {
    [...keys].sort().reverse().forEach(k => cols.push({ type: "m", key: k }));
    return cols;
  }
  const n = +S.range, win = new Set();
  for (let i = 0; i < n; i++) { const k = addMonths(LATEST, -i); win.add(k); cols.push({ type: "m", key: k }); }
  const years = [...new Set([...keys].filter(k => !win.has(k)).map(k => k.slice(0, 4)))].sort().reverse();
  years.forEach(y => {
    if (S.years.has(y)) [...keys].filter(k => k.startsWith(y) && !win.has(k)).sort().reverse().forEach((k, i) => cols.push({ type: "m", key: k, yearStart: i === 0 ? y : null }));
    else cols.push({ type: "y", key: y, count: papers.filter(p => p.date.startsWith(y) && !win.has(monthKey(p.date))).length });
  });
  return cols;
}
function colOf(p, cols) {
  const k = monthKey(p.date);
  return cols.findIndex(c => (c.type === "m" && c.key === k) || (c.type === "y" && k.startsWith(c.key)));
}

function render() {
  const t = UI[S.lang], L = S.lang;
  document.documentElement.lang = L === "zh" ? "zh-CN" : "en";
  document.title = ROOT.name[L];
  document.getElementById("title").textContent = ROOT.name[L];
  document.getElementById("lang").textContent = t.other;
  document.getElementById("theme").textContent = t.themes[THEME];
  // 时间范围
  document.getElementById("range").innerHTML = Object.entries(t.ranges).map(([k, v]) => `<button data-r="${k}" aria-pressed="${S.range === k}">${v}</button>`).join("");
  document.querySelectorAll("#range button").forEach(b => b.onclick = () => { S.range = b.dataset.r; S.sel = null; render(); });

  const rows = visibleRows(), focus = selected(rows);
  // 选中论文时，时间轴只留它的沿袭所在的月份，整条链收在一屏内；换选另一篇时按新论文重新收拢；取消选中后恢复完整时间轴
  const cols = focus ? [...new Set(focus.set.map(x => monthKey(x.date)))].sort().reverse().map(k => ({ type: "m", key: k })) : columns(rows);
  ROWS = rows; COLS = cols;
  // 选中时收拢后的月份铺满一屏（列宽按屏幕分配，不够才滚动）；平时列宽固定，用翻页按钮、←/→ 或在表头滚滚轮前后翻
  let html = `<div class="grid${focus ? " fit" : ""}" style="grid-template-columns:var(--labelW) repeat(${cols.length},${focus ? "minmax(var(--minW),1fr)" : "var(--colW)"})">`;
  html += `<div class="corner"><button class="pg" data-pg="-1">‹ ${t.newer}</button><button class="pg" data-pg="1">${t.earlier} ›</button></div>`;
  let lastYear = null;
  cols.forEach(c => {
    if (c.type === "y") { html += `<div class="hcell fold" data-y="${c.key}" title="${t.older(c.count)}"><b>${t.year(c.key)} ▸</b>${t.older(c.count)}</div>`; lastYear = c.key; return; }
    const y = c.key.slice(0, 4), m = +c.key.slice(5, 7);
    html += `<div class="hcell${c.yearStart ? " fold" : ""}" data-k="${c.key}"${c.yearStart ? ` data-y="${c.yearStart}" title="${t.fold}"` : ""}><b>${m ? t.mon(m) : t.noMonth}</b>${t.year(y)}${c.yearStart ? " ◂" : ""}</div>`;
  });
  rows.forEach((r, i) => {
    const n = r.node, band = r.lvl === 0 && i > 0 ? " g0" : "";
    const caret = n.kids.length ? `<button class="caret" data-o="${n.id}" aria-label="toggle">${r.open ? "▾" : "▸"}</button>` : `<span class="caret"></span>`;
    html += `<div class="label d${n.depth}${band}" style="padding-left:${10 + r.lvl * 18}px;--gc:${n.color}">${caret}${n.kids.length ? `<button class="name" data-n="${n.id}" aria-expanded="${r.open}">` : `<span class="name">`}<span class="t">${n.name[L]}</span><span class="c">${n.papers.length}</span>${n.kids.length ? "</button>" : "</span>"}</div>`;
    if (r.open) { cols.forEach(() => html += `<div class="cell${band}"></div>`); return; }
    const cells = cols.map(() => []);
    n.papers.forEach(p => { const ci = colOf(p, cols); if (ci >= 0) cells[ci].push(p); });
    cells.forEach((ps, ci) => {
      ps.sort((a, b) => b.date.localeCompare(a.date) || (a.short || "").localeCompare(b.short || ""));
      html += `<div class="cell${band}" data-r="${i}" data-c="${ci}">${ps.map(p => chip(p, n, i)).join("")}</div>`;
    });
  });
  html += `</div>`;
  const view = document.getElementById("view");
  const sx = view.scrollLeft, sy = view.scrollTop;
  view.innerHTML = html;
  view.scrollLeft = sx; view.scrollTop = sy;
  view.querySelectorAll("[data-n]").forEach(b => b.onclick = () => { const id = b.dataset.n; S.open.has(id) ? S.open.delete(id) : S.open.add(id); render(); });
  view.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { S.open.has(b.dataset.o) ? S.open.delete(b.dataset.o) : S.open.add(b.dataset.o); render(); });
  view.querySelectorAll("[data-y]").forEach(b => b.onclick = () => { S.years.has(b.dataset.y) ? S.years.delete(b.dataset.y) : S.years.add(b.dataset.y); render(); });
  view.querySelectorAll(".chip").forEach(a => {
    a.onmousemove = e => tip(e, a.dataset.tip);
    a.onmouseleave = () => tip(null);
    // 第一次点：选中，高亮同类沿袭；再点已选中的：打开论文
    a.onclick = e => {
      const row = ROWS[+a.dataset.r].node.id, id = a.dataset.id;
      if (S.sel && S.sel.row === row && S.sel.id === id) return;
      e.preventDefault(); e.stopPropagation();
      smooth(() => { S.sel = { row, id }; render(); }, a.dataset.r + "|" + id);
    };
  });
  view.onclick = e => { if (S.sel && !e.target.closest(".chip, button")) unselect(); };
  view.querySelectorAll("[data-pg]").forEach(b => b.onclick = () => page(+b.dataset.pg));
  view.querySelectorAll(".hcell, .corner").forEach(h => h.addEventListener("wheel", e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault(); view.scrollLeft += e.deltaY;
  }, { passive: false }));
  view.onscroll = pager;
  pager();
  pick();
}

// 选中一篇论文时，分别标出它在同类里的上游（它沿用的）和下游（沿用它的），其余变淡。先后由时间轴看出，不画线。
// 当前选中的论文及其所在行、同类沿袭（只算这一行里的论文）；选中的论文已不可见时清空
function selected(rows) {
  if (!S.sel) return null;
  const ri = rows.findIndex(r => r.node.id === S.sel.row && !r.open);
  const p = ri >= 0 && rows[ri].node.papers.find(x => x.id === S.sel.id);
  if (!p) { S.sel = null; return null; }
  const inRow = new Set(rows[ri].node.papers);
  return { ri, p, set: [...chain(p)].filter(x => inRow.has(x)) };
}
function unselect() {
  const el = document.querySelector("#view .chip.sel");
  smooth(() => { S.sel = null; render(); }, el && el.dataset.r + "|" + el.dataset.id);
}

// 翻页：每次横向移动半屏（按整列对齐）；-1 往更新的方向，1 往更早的方向
function page(dir) {
  const view = document.getElementById("view"), h = view.querySelector(".hcell");
  if (!h) return;
  const lw = view.querySelector(".corner").offsetWidth, w = h.offsetWidth;
  const step = Math.max(1, Math.floor((view.clientWidth - lw) / w / 2)) * w;
  view.scrollBy({ left: dir * step, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
// 翻到头时对应按钮变灰
function pager() {
  const view = document.getElementById("view"), [a, b] = view.querySelectorAll("[data-pg]");
  if (!a) return;
  a.disabled = view.scrollLeft <= 1;
  b.disabled = view.scrollLeft >= view.scrollWidth - view.clientWidth - 1;
}

// 选中或取消时版面会变（时间轴收拢或恢复）：先记下每篇论文和月份的位置，重画后让它们从旧位置平滑滑到新位置，新出现的淡入。
function smooth(change, anchor) {
  const view = document.getElementById("view");
  const key = el => el.dataset.k ? "h|" + el.dataset.k : el.dataset.r + "|" + el.dataset.id;
  const items = () => [...view.querySelectorAll(".chip, .hcell[data-k]")];
  const old = new Map(items().map(el => [key(el), el.getBoundingClientRect()]));
  change();
  const now = items();
  const a = anchor && now.find(el => key(el) === anchor);
  if (S.sel) view.scrollLeft = 0;  // 收拢后整条链铺满一屏，从最新的开始
  else if (a) {                    // 取消选中：让刚才选中的论文留在视野中间
    const r = a.getBoundingClientRect(), v = view.getBoundingClientRect(), lw = view.querySelector(".corner").offsetWidth;
    if (r.left < v.left + lw || r.right > v.right) view.scrollLeft += r.left - (v.left + lw + (v.width - lw) / 2);
  }
  pager();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  now.forEach(el => {
    const o = old.get(key(el)), r = el.getBoundingClientRect();
    el.style.transition = "none";
    if (!o) el.style.opacity = "0";
    else if (o.left !== r.left || o.top !== r.top) el.style.transform = `translate(${o.left - r.left}px,${o.top - r.top}px)`;
  });
  requestAnimationFrame(() => requestAnimationFrame(() => now.forEach(el => {
    el.style.transition = "transform .24s ease, opacity .24s ease";
    el.style.transform = ""; el.style.opacity = "";
  })));
  setTimeout(() => now.forEach(el => { el.style.transition = ""; }), 320);
}

function pick() {
  const grid = document.querySelector("#view .grid");
  if (!grid) return;
  grid.classList.remove("focus");
  grid.querySelectorAll(".sel, .up, .down").forEach(c => c.classList.remove("sel", "up", "down"));
  const ri = S.sel ? ROWS.findIndex(r => r.node.id === S.sel.row && !r.open) : -1;
  const p = ri >= 0 && ROWS[ri].node.papers.find(x => x.id === S.sel.id);
  if (!p) { S.sel = null; return; }
  const inRow = new Set(ROWS[ri].node.papers);
  grid.classList.add("focus");
  grid.querySelector(`.chip[data-r="${ri}"][data-id="${CSS.escape(p.id)}"]`)?.classList.add("sel");
  const mark = (x, cls) => {
    if (!inRow.has(x)) return;
    grid.querySelector(`.chip[data-r="${ri}"][data-id="${CSS.escape(x.id)}"]`)?.classList.add(cls);
  };
  reach(p, "_up").forEach(x => mark(x, "up"));
  reach(p, "_down").forEach(x => mark(x, "down"));
}

function chip(p, row, ri) {
  const L = S.lang, leaf = p._leaf, tl = L === "zh" ? p.tldr_zh : p.tldr_en;
  const where = leaf && leaf !== row ? leaf.name[L] + "\n" : "";
  const k = p._key ? UI[L].keyTip(p._key) + "\n" : "";
  return `<a class="chip${p._key ? " key" : ""}" data-id="${esc(p.id)}" data-r="${ri}" style="--gc:${(leaf || row).color}" href="${p.url}" target="_blank" rel="noopener" data-tip="${esc(p.title + "\n" + p.date + "　" + where + k + "\n" + tl)}"><span>${esc(p.short || p.title)}</span></a>`;
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
function tip(e, text) {
  const el = document.getElementById("tip");
  if (!e) { el.hidden = true; return; }
  el.hidden = false; el.textContent = text;
  el.style.left = Math.min(e.clientX + 14, innerWidth - 440) + "px"; el.style.top = Math.min(e.clientY + 16, innerHeight - 170) + "px";
}
if (typeof document !== "undefined") boot();
else module.exports = { build, marks, lineage, chain, reach, get BY() { return BY; }, get ROOT() { return ROOT; } };
