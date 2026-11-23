import { LicenseController } from "./controllers/licenseController.js";

class App {
  async init() {
    this.root = document.getElementById("app");
    
    try {
      const res = await fetch("data/licenses.json");
      this.ctrl = new LicenseController(await res.json());
    }
    
    catch (e) {
      this.root.innerHTML = `<p class="empty">Error cargando datos. Abre la web con un servidor local (p. ej. Live Server).</p>`;
      return;
    }

    // Orden y contenido de las secciones
    const sections = [
      { id: "featured", title: "⭐ Destacados", run: (p) => this.ctrl.RenderFeatured(3, p) },
      { id: "offers", title: "🔥 Ofertas", run: (p) => this.ctrl.RenderOffers(3, p) },
      { id: "latest", title: "🆕 Últimas versiones", run: (p) => this.ctrl.RenderLatest(3, p) },
    ];

    sections.forEach((s) => s.run(this.#section(s.id, s.title)));
    this.#renderAll();
  }

  #section(id, title, extra = "") {
    const sec = document.createElement("section");
    sec.innerHTML = `<h2>${title}</h2>${extra}<div class="grid" id="${id}"></div>`;
    this.root.appendChild(sec);
    return sec.querySelector(".grid");
  }

  #renderAll() {
    const c = this.ctrl;
    const filters = `
      <div class="filters">
        <input id="f-text" type="search" placeholder="Buscar software...">
        <select id="f-soft"><option value="">Todos</option>
          ${c.softwareNames.map((n) => `<option>${n}</option>`).join("")}</select>
        <label>Máx: <span id="f-val">${c.maxPrice}</span> €
          <input id="f-price" type="range" min="0" max="${c.maxPrice}" value="${c.maxPrice}"></label>
        <label><input id="f-off" type="checkbox"> Solo ofertas</label>
      </div>`;

    const grid = this.#section("all", "🛒 Todas las licencias", filters);

    const $ = (id) => document.getElementById(id);
    
    const update = () => {
      $("f-val").textContent = $("f-price").value;
        c.RenderAll(c.licenses.length, grid, {
          text: $("f-text").value,
          software: $("f-soft").value,
          maxPrice: +$("f-price").value,
          onlyOffers: $("f-off").checked,
        });
    };

    ["f-text", "f-soft", "f-price", "f-off"].forEach((id) => $(id).addEventListener("input", update));

    update();
  }
}

new App().init();