// 知识地图：纵向是分类树（任意层级），横向是时间（新的在左）。
// 所有分类、名称和论文都从 config.json 指向的数据文件读取，页面不写死内容。

const UI = {
  zh: { load: "数据加载失败：", required: "记忆为必选标签", paper: "阅读论文", other: "EN", time: "时间", appearance: "外观", language: "语言", tags: "调研标签", summary: "研究内容", citations: "总被引", scopedCitations: { same: "同类被引", other: "跨类被引" }, ranges: { "6": "近半年", "12": "近一年", all: "全部" },
        newer: "更新", earlier: "更早", themes: { auto: "跟随系统", light: "浅色", dark: "深色" }, more: n => `+${n}`, groupTip: "展开这一类", yearTip: "展开这一年", yearCount: n => `${n} 篇`, older: n => `${n} 篇 · 点击展开`, fold: "收起", year: y => `${y} 年`, mon: m => `${m}月`, noMonth: "未注明月份", keyTip: { same: n => `本月同类被引最多（${n} 次）`, other: n => `本月跨类被引最多（${n} 次）` } },
  en: { load: "Could not load data: ", required: "Memory is required", paper: "Read paper", other: "中文", time: "Time", appearance: "Theme", language: "Language", tags: "Research tags", summary: "Overview", citations: "Total citations", scopedCitations: { same: "Same-category citations", other: "Cross-category citations" }, ranges: { "6": "6 months", "12": "1 year", all: "All" },
        newer: "Newer", earlier: "Older", themes: { auto: "Auto", light: "Light", dark: "Dark" }, more: n => `+${n}`, groupTip: "Expand this category", yearTip: "Expand this year", yearCount: n => `${n} papers`, older: n => `${n} papers · expand`, fold: "Collapse", year: y => y, mon: m => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1], noMonth: "No month", keyTip: { same: n => `Most cited in its category this month (${n})`, other: n => `Most cited by other categories this month (${n})` } },
};

let CFG, ROOT, BY = {}, LATEST, ROWS = [], COLS = [], DATA;
const S = { lang: "zh", range: "12", open: new Set(), years: new Set(), sel: null, tags: new Set() };
let tipTimer;

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

// 标签共同筛选：required 标签始终选中；选中标签时补齐 requires，取消时一并取消依赖它的标签。
const match = (p, tags) => [...tags].every(t => (p.tags || []).includes(t));
let CAP = 2;  // 收起的一级分类每格露出的篇数，由 config.json 的 cap 覆盖
function toggleTag(id, selected, defs) {
  const tags = new Set(selected), def = defs.find(t => t.id === id);
  if (def.required) return tags;
  if (tags.has(id)) {
    const remove = key => { tags.delete(key); defs.filter(t => tags.has(t.id) && (t.requires || []).includes(key)).forEach(t => remove(t.id)); };
    remove(id);
  } else {
    const add = key => { if (tags.has(key)) return; tags.add(key); (defs.find(t => t.id === key).requires || []).forEach(add); };
    add(id);
  }
  return tags;
}

// 每格的排序与折叠：代表论文在前（按分类配置的被引范围计数），再按被引次数、日期；只显示前 cap 篇，其余计入"+N"
// 展开的行里，按年折叠的列最多占几格：与本行最高的月份格一样高（至少 CAP 格，"+N" 也占一格）
function yearCap(monthCounts) { return Math.max(CAP, ...monthCounts); }
function cell(ps, cap) {
  const order = [...ps].sort((a, b) => (b._key || 0) - (a._key || 0) || (b.cited || 0) - (a.cited || 0) || b.date.localeCompare(a.date) || (a.short || "").localeCompare(b.short || ""));
  return { show: order.slice(0, cap), rest: Math.max(0, order.length - cap) };
}

async function boot() {
  try {
    // 数据文件每次都向服务器确认是否更新，避免改了数据浏览器仍用旧的
    const get = u => fetch(u, { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(`${u} ${r.status}`); return r.json(); });
    CFG = await get("config.json");
    const [tax, papers, cites] = await Promise.all([get(CFG.taxonomy), get(CFG.papers), CFG.cites ? get(CFG.cites) : []]);
    DATA = { tax, papers, cites };
    S.tags = new Set([...JSON.parse(localStorage.getItem("tags") || "[]"), ...CFG.tags.filter(t => t.required).map(t => t.id)]);
    if (CFG.cap > 0) CAP = CFG.cap;
    apply();
  } catch (e) { const el = document.getElementById("err"); el.hidden = false; el.textContent = UI[S.lang].load + e.message; return; }
  S.lang = CFG.lang || "zh";
  S.range = String(CFG.recent_months || 12);
  document.getElementById("lang").onclick = () => { S.lang = S.lang === "zh" ? "en" : "zh"; render(); };
  document.getElementById("theme").onclick = () => {
    THEME = THEMES[(THEMES.indexOf(THEME) + 1) % THEMES.length];
    try { localStorage.setItem("theme", THEME); } catch (e) {}
    applyTheme(); render();
  };
  document.getElementById("range").onclick = e => {
    const b = e.target.closest("button");
    if (!b) return;
    S.range = b.dataset.r; S.sel = null; render();
  };
  document.getElementById("tags").onclick = e => {
    const b = e.target.closest("button");
    if (!b) return;
    S.tags = toggleTag(b.dataset.tag, S.tags, CFG.tags);
    localStorage.setItem("tags", JSON.stringify([...S.tags]));
    S.sel = null; apply(); render();
  };
  document.getElementById("tip").onmouseenter = () => clearTimeout(tipTimer);
  document.getElementById("tip").onmouseleave = () => tip(null);
  document.getElementById("tip").onfocusout = e => { if (!e.currentTarget.contains(e.relatedTarget)) tip(null); };
  window.addEventListener("resize", () => tip(null));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { tip(null); if (S.sel) unselect(); }
    else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) { e.preventDefault(); page(e.key === "ArrowLeft" ? -1 : 1); }
  });
  render();
}

// 按当前标签筛出论文，重建分类树、代表论文和沿袭（只在筛出的论文之间计算）
function apply() {
  const ps = DATA.papers.filter(p => match(p, S.tags));
  view(DATA.tax, ps, DATA.cites, CFG.key || {});
  LATEST = DATA.papers.map(p => p.date).filter(d => d.length >= 7).sort().pop().slice(0, 7);  // 时间轴按全部论文定，筛选时不跳动
}
function view(tax, papers, cites, key) {
  BY = {};
  build(tax, papers);
  marks(cites, key);
  lineage(cites);
}

// taxonomy.json → 树。任意深度；末端节点用 code 关联论文编号前缀。
function build(tax, papers) {
  papers.forEach(p => { delete p._leaf; delete p._key; });
  const byLeaf = {};
  papers.filter(p => p.tag).forEach(p => { const c = p.tag.slice(0, p.tag.lastIndexOf(".")); (byLeaf[c] = byLeaf[c] || []).push(p); });
  let auto = 0;
  const make = (n, parent, depth, color) => {
    const pre = x => x.code ? x.code.split(".")[0] : (x.children || []).map(pre).find(Boolean);
    const node = { id: n.code || (depth === 1 ? pre(n) : null) || `n${auto++}`, name: { zh: n.name_zh || n.title_zh, en: n.name || n.title }, parent, depth, color, references: { ...parent?.references, ...n.references }, kids: [] };
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

// 施引范围由分类 references.scope 决定；计数和选中展示共用这份直接引用索引。
const REFERENCE_SCOPES = {
  same: (p, source) => p._leaf === source._leaf,
  other: (p, source) => p._leaf !== source._leaf,
};
function inScope(p, papers) { return papers.filter(other => REFERENCE_SCOPES[p._leaf.references.scope](p, other)); }

// 代表论文：同一末端分类、同一个月发表的论文里，在配置范围内被引最多的那篇（并列时最多 max 篇）。
// 当月只有一篇，或当月都还没被引用（少于 min 次），就不标。只用引用关系，不读论文内容。
function marks(cites, opt) {
  const min = opt.min || 1, max = opt.max || 2;
  const byId = Object.fromEntries(ROOT.papers.map(p => { p._cites = []; p._citedBy = []; return [p.id, p]; }));
  cites.forEach(([a, b]) => { if (byId[a] && byId[b]) { byId[a]._cites.push(byId[b]); byId[b]._citedBy.push(byId[a]); } });
  ROOT.papers.forEach(p => { p._refCount = inScope(p, p._citedBy).length; });
  Object.values(BY).filter(n => !n.kids.length && n !== ROOT).forEach(n => {
    const months = {};
    n.papers.forEach(p => (months[monthKey(p.date)] = months[monthKey(p.date)] || []).push(p));
    Object.values(months).forEach(ps => {
      if (ps.length < 2) return;
      const top = Math.max(...ps.map(p => p._refCount)), win = ps.filter(p => p._refCount === top);
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
  const same = (a, b) => a && b && a._leaf && a._leaf === b._leaf && a._leaf.references.mode === "lineage";
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
const REFERENCE_MODES = {
  lineage: p => ({ up: reach(p, "_up"), down: reach(p, "_down"), direct: false }),
  citations: p => ({ up: new Set(inScope(p, p._cites)), down: new Set(inScope(p, p._citedBy)), direct: true }),
};
function related(p) {
  const links = REFERENCE_MODES[p._leaf.references.mode](p);
  return { p, ...links, set: new Set([p, ...links.up, ...links.down]) };
}

// 直接引用视图临时展开关联论文的祖先节点，不改动用户保存的展开状态。
function visibleRows(focus) {
  const f = ROOT, rows = [];
  const open = new Set(S.open);
  if (focus && focus.direct) focus.set.forEach(p => {
    for (let n = p._leaf.parent; n && n !== ROOT; n = n.parent) open.add(n.id);
  });
  const walk = (n, lvl) => {
    if (focus && focus.direct && !n.papers.some(p => focus.set.has(p))) return;
    const expanded = n.kids.length > 0 && open.has(n.id);
    rows.push({ node: n, lvl, open: expanded });
    if (expanded) n.kids.forEach(k => walk(k, lvl + 1));
  };
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
  tip(null);
  document.documentElement.lang = L === "zh" ? "zh-CN" : "en";
  document.title = ROOT.name[L];
  document.getElementById("title").textContent = ROOT.name[L];
  const tags = document.getElementById("tags"), range = document.getElementById("range");
  tags.setAttribute("aria-label", t.tags);
  tags.innerHTML = CFG.tags.map(x => `<button data-tag="${x.id}" aria-pressed="${S.tags.has(x.id)}"${x.required ? ` disabled title="${t.required}"` : ""}>${esc(L === "zh" ? x.name_zh : x.name)}</button>`).join("");
  document.getElementById("count").textContent = t.yearCount(ROOT.papers.length);
  range.setAttribute("aria-label", t.time);
  range.innerHTML = Object.entries(t.ranges).map(([k, v]) => `<button data-r="${k}" aria-pressed="${S.range === k}">${v}</button>`).join("");
  document.getElementById("theme").textContent = t.themes[THEME];
  document.getElementById("theme").title = t.appearance;
  document.getElementById("lang").textContent = t.other;
  document.getElementById("lang").title = t.language;

  const p = S.sel && ROOT.papers.find(p => p.id === S.sel.id), links = p && related(p);
  const rows = visibleRows(links), focus = selected(rows, links);
  // 选中论文时，时间轴只留当前引用视图涉及的月份；取消选中后恢复完整时间轴。
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
    // 一级分类（含没有子分类的一级分类）都可以点名称展开或收起；展开后整类全部显示，不再有二次折叠
    const top = r.lvl === 0, opened = r.open || S.open.has(n.id);
    const caret = top ? `<button class="caret" data-o="${n.id}" aria-label="toggle">${opened ? "▾" : "▸"}</button>` : `<span class="caret"></span>`;
    html += `<div class="label d${n.depth}${band}" style="padding-left:${10 + r.lvl * 18}px;--gc:${n.color}">${caret}${top ? `<button class="name" data-n="${n.id}" aria-expanded="${opened}">` : `<span class="name">`}<span class="t">${n.name[L]}</span><span class="c">${n.papers.length}</span>${top ? "</button>" : "</span>"}</div>`;
    if (r.open) { cols.forEach(() => html += `<div class="cell${band}"></div>`); return; }
    const cells = cols.map(() => []);
    const papers = focus && focus.direct ? n.papers.filter(p => focus.set.includes(p)) : n.papers;
    papers.forEach(p => { const ci = colOf(p, cols); if (ci >= 0) cells[ci].push(p); });
    // 引用视图涉及的行完整展示，避免关联论文被每格上限隐藏。
    const cap = top && !opened && !(focus && focus.set.some(p => n.papers.includes(p))) ? CAP : Infinity;
    // 按年折叠的列：收起的行只给篇数；展开的行按本行最高的月份格能放几篇来放，代表论文优先，放不下的计入"+N"（点它展开该年）
    const ycap = yearCap(cells.filter((_, ci) => cols[ci].type === "m").map(ps => ps.length));
    cells.forEach((ps, ci) => {
      let inner = "";
      if (cols[ci].type === "y") {
        if (!ps.length) inner = "";
        else if (cap !== Infinity) inner = `<button class="ycount" data-y="${cols[ci].key}">${t.yearCount(ps.length)}</button>`;
        else {
          const { show, rest } = cell(ps, ps.length > ycap ? ycap - 1 : ycap);
          inner = show.map(p => chip(p, n, i)).join("") + (rest ? `<button class="more" data-y="${cols[ci].key}" title="${t.yearTip}">${t.more(rest)}</button>` : "");
        }
      } else {
        const { show, rest } = cell(ps, cap);
        inner = show.map(p => chip(p, n, i)).join("") + (rest ? `<button class="more" data-o="${n.id}" title="${t.groupTip}">${t.more(rest)}</button>` : "");
      }
      html += `<div class="cell${band}" data-r="${i}" data-c="${ci}">${inner}</div>`;
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
    const p = ROWS[+a.dataset.r].node.papers.find(p => p.id === a.dataset.id);
    a.onmouseenter = e => tip(e, p);
    a.onmouseleave = () => { tipTimer = setTimeout(() => tip(null), 120); };
    a.onfocus = () => tip({ currentTarget: a }, p);
    a.onblur = e => { if (!document.getElementById("tip").contains(e.relatedTarget)) tip(null); };
    // 第一次点：选中，按分类配置高亮引用关系；再点已选中的：打开论文。
    a.onclick = e => {
      const row = ROWS[+a.dataset.r].node.id, id = a.dataset.id;
      if (S.sel && S.sel.id === id) return;
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
  view.onscroll = () => { tip(null); pager(); };
  pager();
  pick(focus);
}

// 沿袭仍限定在原选中行；直接引用视图跨行展示配置范围内的双向直接引用。
function selected(rows, links) {
  if (!S.sel) return null;
  if (!links) { S.sel = null; return null; }
  const direct = links.direct;
  const ri = rows.findIndex(r => r.node.id === (direct ? links.p._leaf.id : S.sel.row) && !r.open);
  if (ri < 0) { S.sel = null; return null; }
  const visible = p => direct || rows[ri].node.papers.includes(p);
  return { p: links.p, direct, up: [...links.up].filter(visible), down: [...links.down].filter(visible), set: [...links.set].filter(visible) };
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

function pick(focus) {
  const grid = document.querySelector("#view .grid");
  if (!grid) return;
  grid.classList.remove("focus");
  grid.querySelectorAll(".sel, .up, .down").forEach(c => c.classList.remove("sel", "up", "down"));
  if (!focus) return;
  grid.classList.add("focus");
  const mark = (x, cls) => {
    const ri = ROWS.findIndex(r => !r.open && r.node.papers.includes(x));
    if (ri < 0) return;
    grid.querySelector(`.chip[data-r="${ri}"][data-id="${CSS.escape(x.id)}"]`)?.classList.add(cls);
  };
  mark(focus.p, "sel");
  focus.up.forEach(x => mark(x, "up"));
  focus.down.forEach(x => mark(x, "down"));
}

function chip(p, row, ri) {
  const leaf = p._leaf;
  return `<a class="chip${p._key ? " key" : ""}" data-id="${esc(p.id)}" data-r="${ri}" style="--gc:${(leaf || row).color}" href="${p.url}" target="_blank" rel="noopener"><span>${esc(p.short || p.title)}</span></a>`;
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
function tip(e, p) {
  clearTimeout(tipTimer);
  const el = document.getElementById("tip");
  document.querySelector('.chip[aria-describedby="tip"]')?.removeAttribute("aria-describedby");
  if (!e) { el.hidden = true; return; }
  const L = S.lang, t = UI[L], path = [];
  for (let n = p._leaf; n && n !== ROOT; n = n.parent) path.unshift(n.name[L]);
  const tags = CFG.tags.filter(x => p.tags.includes(x.id));
  el.style.setProperty("--gc", p._leaf.color);
  el.innerHTML = `<div class="tip-category"><span>${path.map(esc).join(' <span aria-hidden="true">›</span> ')}</span><span class="tip-code">${esc(p.tag)}</span></div>
    <h2 id="tip-title"><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a></h2><p class="tip-authors">${esc(p.authors)}</p>
    <div class="tip-section"><span class="tip-label">${t.tags}</span><div class="tip-tags">${tags.map(x => `<span>${esc(L === "zh" ? x.name_zh : x.name)}</span>`).join("")}</div></div>
    <div class="tip-section"><span class="tip-label">${t.summary}</span><p class="tip-summary">${esc(L === "zh" ? p.tldr_zh : p.tldr_en)}</p></div>
    <div class="tip-footer"><a class="tip-paper" href="${esc(p.url)}" target="_blank" rel="noopener">${t.paper} ↗</a><span>${esc(p.venue)} · ${esc(p.date)}</span><span>${t.scopedCitations[p._leaf.references.scope]} <b>${p._refCount}</b></span>${Number.isInteger(p.cited) ? `<span>${t.citations} <b>${p.cited}</b> <span class="tip-source">Semantic Scholar</span></span>` : ""}</div>
    ${p._key ? `<div class="tip-key">${esc(t.keyTip[p._leaf.references.scope](p._key))}</div>` : ""}`;
  el.hidden = false;
  e.currentTarget.setAttribute("aria-describedby", "tip");
  const anchor = e.currentTarget.getBoundingClientRect(), box = el.getBoundingClientRect(), gap = 10;
  const left = anchor.right + gap + box.width <= innerWidth - gap ? anchor.right + gap : anchor.left - gap - box.width;
  const top = anchor.top + box.height <= innerHeight - gap ? anchor.top : innerHeight - gap - box.height;
  el.style.left = Math.max(gap, Math.min(left, innerWidth - gap - box.width)) + "px";
  el.style.top = Math.max(gap, top) + "px";
}
if (typeof document !== "undefined") boot();
else module.exports = { build, marks, lineage, reach, related, visibleRows, match, toggleTag, view, cell, yearCap, get BY() { return BY; }, get ROOT() { return ROOT; } };
