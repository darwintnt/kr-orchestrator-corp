# Calculadora de Precio de Venta al Público (Colombia)

Aplicación web de una sola página que calcula el **precio de venta al público** de un producto a partir de su **partida arancelaria** (determina IVA e impuestos específicos aplicables) y el **margen de ganancia** deseado. El margen se aplica sobre el costo y los impuestos se calculan sobre el precio de venta neto resultante, igual que en una factura real. Desglose de resultados en formato de factura DIAN.

Stack: HTML + Tailwind CSS (CDN) + JavaScript vanilla. Sin frameworks ni build tools.

---

## Requisitos

- Un navegador moderno (Chrome, Firefox, Safari, Edge).
- Conexión a internet: Tailwind se carga desde el CDN oficial.
- Nada más. No hace falta Node.js, npm ni ningún paso de instalación.

---

## Cómo ejecutar en local

### Opción 1 — Abrir el archivo directamente (la más simple)

Haz doble clic sobre `index.html` o, desde la terminal:

```bash
open index.html
```

El proyecto funciona completo así: no hace requests a ningún backend.

### Opción 2 — Servidor local (recomendada)

Levanta un servidor estático en la carpeta del proyecto:

```bash
# Con Python 3 (ya viene instalado en macOS y la mayoría de distros Linux)
python3 -m http.server 8000
```

Luego abrí en el navegador: <http://localhost:8000>

Alternativas equivalentes si preferís otra herramienta:

```bash
npx serve .
# o el plugin "Live Server" de VS Code, etc.
```

> ¿Por qué preferir el servidor local? `file://` puede bloquear ciertas funcionalidades del navegador según la configuración, y el servidor local reproduce mejor cómo se comportará la app en producción. Para este proyecto, ambas opciones funcionan.

---

## Estructura del proyecto

```
calculadora_ecommerce/
└── index.html   # Única página: HTML + estilos + lógica completa
```

No hay carpetas de dependencias, ni config, ni build.

---

## Lógica de cálculo

El margen se aplica sobre el **costo** y los impuestos se calculan sobre el **precio de venta neto** (base gravable), en este orden:

```text
Precio_venta_neto        = Precio_compra × (1 + %ganancia / 100)
Ganancia_valor           = Precio_venta_neto − Precio_compra
IVA                      = Precio_venta_neto × %IVA
Impuesto_específico      = Precio_venta_neto × %impuesto_específico   (si aplica)
Precio_final_cliente     = Precio_venta_neto + IVA + Impuesto_específico
```

Todos los montos se redondean al peso entero para el desglose.

## Configurar partidas y tarifas

Toda la tabla de partidas vive en el objeto `TARIFF_TABLE`, al inicio del `<script>` de `index.html`. Es editable directamente.

Formato de cada entrada:

```js
{
  code: '2202.10',          // partida arancelaria
  description: 'Bebidas azucaradas (gaseosas, refrescos)',
  iva: 19,                  // % de IVA: 19, 5 o 0
  taxes: [                  // impuestos específicos (opcional, vacío si no aplican)
    { id: 'icui', name: 'ICUI', value: 15 }  // % sobre el precio de venta neto
  ]
}
```

- Cada impuesto específico es siempre un **porcentaje** (`value`), aplicado sobre el precio de venta neto (base gravable), igual que el IVA: `impuesto = precio_venta_neto × value / 100`.

> ⚠️ **Importante:** las partidas y tarifas incluidas son **datos de ejemplo con fines ilustrativos**. Las tarifas de impuestos específicos se ajustan periódicamente (IPC, reformas tributarias). Verificá los valores vigentes en la DIAN antes de usarlos para precios reales.

Si la partida del producto no está en la tabla, la app permite configurar IVA e impuestos específicos manualmente desde la opción **"Otra partida (configuración manual)"**.

---

## Uso rápido

1. Seleccioná la **partida arancelaria** del producto (los impuestos aplicables se autocompletan y se muestran como etiquetas).
2. Ingresá el **precio de compra / costo del producto** (COP).
3. Ingresá el **% de ganancia deseada** (markup sobre el costo).
4. Presioná **Calcular** → se muestra el desglose: precio de compra, ganancia, precio de venta neto (base gravable), IVA, impuestos específicos y precio final al cliente.
5. **Limpiar** reinicia el formulario.