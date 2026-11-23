import { License } from "../types/license.js";

export class LicenseController {
  constructor(data) {
    this.licenses = data.map((d) => new License(d));
  }

  #draw(list, parent) {
    parent.innerHTML = "";
    if (!list.length) parent.innerHTML = `<p class="empty">No hay resultados.</p>`;
    list.forEach((l) => l.Render(parent));
  }

  RenderFeatured(count, parent) {
    this.#draw(this.licenses.filter((l) => l.featured).slice(0, count), parent);
  }

  RenderOffers(count, parent) {
    const list = this.licenses
      .filter((l) => l.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, count);
    this.#draw(list, parent);
  }

  // Última versión de cada software
  RenderLatest(count, parent) {
    const latest = new Map();
    for (const l of this.licenses) {
      const cur = latest.get(l.software);
      if (!cur || l.version.localeCompare(cur.version, undefined, { numeric: true }) > 0)
        latest.set(l.software, l);
    }
    this.#draw([...latest.values()].slice(0, count), parent);
  }

  // Orden aleatorio + filtros opcionales {text, software, maxPrice, onlyOffers}
  RenderAll(count, parent, filters = {}) {
    if (!this.shuffled) this.shuffled = [...this.licenses].sort(() => Math.random() - 0.5);
    const { text = "", software = "", maxPrice = Infinity, onlyOffers = false } = filters;
    const t = text.toLowerCase();
    const list = this.shuffled
      .filter((l) => `${l.software} ${l.version}`.toLowerCase().includes(t))
      .filter((l) => !software || l.software === software)
      .filter((l) => l.finalPrice <= maxPrice)
      .filter((l) => !onlyOffers || l.discount > 0)
      .slice(0, count);
    this.#draw(list, parent);
  }

  get softwareNames() {
    return [...new Set(this.licenses.map((l) => l.software))].sort();
  }
  get maxPrice() {
    return Math.ceil(Math.max(...this.licenses.map((l) => l.price)));
  }
}
