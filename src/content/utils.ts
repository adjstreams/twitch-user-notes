/* ───── heuristics to get the login from various elements ───── */
export function extractLogin(el: HTMLElement): string {
  const direct = el.textContent?.trim() ?? "";
  if (direct && !direct.includes(" ")) return direct.toLowerCase();

  const aria = el.getAttribute("aria-label") || "";
  const matchAria = aria.match(/^(.*?)\s/);
  if (matchAria) return matchAria[1].toLowerCase();

  const href =
    el.getAttribute("href") || el.closest("a")?.getAttribute("href") || "";
  const matchHref = href.match(/\/([^\/?#]+)/);
  return matchHref ? matchHref[1].toLowerCase() : "";
}

/* ───── tooltip helpers ───── */
let tooltipEl: HTMLDivElement | null = null;

export function showTooltip(e: MouseEvent, note: string): void {
  hideTooltip();
  tooltipEl = document.createElement("div");
  tooltipEl.className = "note-tooltip";
  tooltipEl.textContent = note;
  document.body.appendChild(tooltipEl);
  positionTooltip(e);
}

export function hideTooltip(): void {
  tooltipEl?.remove();
  tooltipEl = null;
}

function positionTooltip(e: MouseEvent): void {
  if (!tooltipEl) return;

  const pad = 12;
  const rect = tooltipEl.getBoundingClientRect();
  let x = e.clientX + pad;
  let y = e.clientY + pad;

  if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - pad;
  if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - pad;

  tooltipEl.style.left = `${x}px`;
  tooltipEl.style.top = `${y}px`;
}
