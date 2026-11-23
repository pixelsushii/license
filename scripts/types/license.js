export class License {
  constructor({ id, software, version, price, key, featured, discount }) {
    this.id = id;
    this.software = software;
    this.version = version;
    this.price = price;
    this.key = key;
    this.featured = featured;
    this.discount = discount;
  }

  get finalPrice() {
    return +(this.price * (1 - this.discount / 100)).toFixed(2);
  }

  // Color estable por software para el "logo"
  get color() {
    let h = 0;
    for (const c of this.software) h = (h * 31 + c.charCodeAt(0)) % 360;
    return `hsl(${h} 65% 45%)`;
  }

  Render(parent) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      ${this.discount ? `<span class="badge off">-${this.discount}%</span>` : ""}
      ${this.featured ? `<span class="badge star">★ Destacado</span>` : ""}

      <div class="logo" style="background:${this.color}">${this.software[0]}</div>

      <h3>${this.software}</h3>

      <p class="version">Versión ${this.version}</p>
      <p class="price">
        ${this.discount ? `<s>${this.price.toFixed(2)} €</s>` : ""}
        <strong>${this.finalPrice.toFixed(2)} €</strong>
      </p>

      <button class="buy">Comprar</button>`;

    card.querySelector(".buy").addEventListener("click", () => this.Buy());
    parent.appendChild(card);
    return card;
  }

  Buy() {
    const dlg = document.createElement("dialog");
    dlg.innerHTML = `
      <h2>¡Compra realizada!</h2>

      <p>${this.software} ${this.version}</p>

      <code>${this.key}</code>

      <div class="actions">
        <button class="copy">Copiar</button>
        <button class="close">Cerrar</button>
      </div>
    `;

    dlg.querySelector(".close").onclick = () => dlg.close();
    dlg.querySelector(".copy").onclick = (e) => {
      navigator.clipboard?.writeText(this.key);
      e.target.textContent = "¡Copiada!";
    };

    dlg.addEventListener("close", () => dlg.remove());
    document.body.appendChild(dlg);
    dlg.showModal();
  }
}
