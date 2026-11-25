# Kit de disciplina Kiro — guía paso a paso

Esta es la guía en español para dejar el kit funcionando en la máquina del trabajo. El [README.md](README.md) en inglés es la referencia técnica: mapeo completo, decisiones de diseño y validación. Aquí está lo que necesitas para ejecutar, en orden.

La instalación de referencia es Windows 11 corporativo. Al final hay una sección para macOS y Linux; el núcleo es el mismo.

Antes de empezar, la frase que importa: **esto no instala nada**. No hay paquete, no hay dependencia, no hay servicio, no hace falta admin. Son archivos de texto que se copian al repositorio —o a tu perfil— y, en el repo, se commitean. Kiro ya está en la máquina; el kit solo le da reglas, agentes y skills.

---

## Lo que vas a copiar

| Ruta | Qué es | ¿Obligatorio? |
| --- | --- | --- |
| `.kiro/steering/` | 6 archivos de reglas: ODD, commits, testing, memoria, puente con Specs, gates SDD | Sí |
| `.kiro/agents/` | 4 agentes: `orchestrator`, `explorer`, `writer`, `verifier` | Sí |
| `.kiro/skills/` | 12 skills, incluidos `/odd-feature` y `/judgment-day` | Sí |
| `.kiro/.gitattributes` | Fuerza LF en `.js`, Markdown, JSON y YAML; evita finales de línea inconsistentes | Sí |
| `AGENTS.md` | Punto de entrada que Kiro incluye siempre | Sí |
| `MEMORY.md` | Memoria del repositorio, reemplazo de Engram | Sí |
| `docs/decisions/` | Convención de ADRs y plantilla | Sí |
| `licenses/` + `THIRD-PARTY-NOTICES.md` | Licencias de las 9 skills copiadas de gentle-ai | Sí, por cumplimiento |
| `.kiro/hooks/` + `.kiro/bin/` | 3 hooks Node opcionales; la única parte que lanza procesos | Opcional |
| `README.md`, `README.es.md`, `ZERO-INSTALL.md` | Documentación para humanos | No se copian al repo |

Total del kit: 43 archivos contando esta guía.

## Dos ámbitos de instalación

Puedes instalarlo en el repositorio, en tu perfil de usuario, o en ambos. Kiro fusiona steering y skills entre ámbitos; si hay dos agentes con el mismo nombre, gana el del proyecto y avisa.

| | Repositorio | Global |
| --- | --- | --- |
| Dónde | `<repo>\.kiro\` | `~/.kiro` (Windows: `%USERPROFILE%\.kiro`) |
| Aplica a | un repositorio | todos los repositorios de la máquina |
| Se revisa en un PR | sí | no |
| Se comparte con el equipo | sí | no, es personal |
| Memoria y ADRs | incluidos | siguen siendo del repo |

Usa el ámbito del repositorio cuando el equipo deba heredar las reglas o seguridad tenga que revisarlas. Usa el global para productividad personal en una máquina donde trabajas con muchos repositorios. Tener una base global y una copia en el repo que te importa es una configuración válida.

**Aviso corporativo:** la instalación global escribe en tu perfil, fuera del repositorio. Si la empresa administra `%USERPROFILE%\.kiro` con MDM o Group Policy, o restringe escrituras fuera del repo, quédate en el ámbito del repositorio. No sobrescribas un directorio de steering administrado.

---

## Paso 0 — Lleva la carpeta `kit` a la máquina

Transfiérela por el canal que IT apruebe (correo corporativo, share aprobado, USB si está permitido). No la subas a un servicio personal *desde* la máquina corporativa: eso es exactamente el tipo de movimiento que un endpoint monitoreado registra.

El kit no contiene datos de la empresa, credenciales ni telemetría, así que el riesgo es bajo, pero la política de transferencia sigue siendo tuya y de IT.

Comprueba que llegó completa, en la carpeta donde la dejaste:

```powershell
Get-ChildItem -Recurse -File -Force .\kit | Measure-Object
```

Debe reportar **43**.

---

## Paso 1 — Comprueba lo que ya tienes (sin instalar nada)

Abre una terminal en el repositorio de trabajo (PowerShell en Windows) y ejecuta:

```powershell
git --version
npm --version
node --version
kiro-cli --version
```

Interpretación:

- **git y npm**: la imagen corporativa los trae. Si alguno falta, el agente lo dirá y seguirá con las comprobaciones que existan; no instales nada para satisfacer un check.
- **node**: solo lo necesitan los hooks. npm lo trae; si no está, borra los hooks y el resto del kit sigue funcionando.
- **kiro-cli V3 o superior**: el kit usa `permissions`, `inclusion: auto` y el formato JSON de hooks de la era V3. Si `kiro-cli` es V2, ejecuta `/upgrade-agent` dentro de Kiro CLI para migrar los perfiles, o trabaja solo con Kiro IDE 1.0+.

Si `kiro-cli` no está en PATH pero el IDE funciona, no es un problema: el CLI solo es necesario si lo usas.

---

## Paso 2 — Elige el ámbito

- Si el kit va a formar parte del proyecto y del PR: **ámbito del repositorio** (Paso 3).
- Si lo quieres disponible en todas tus sesiones sin copiarlo cada vez: **ámbito global** (Paso 4).
- Si quieres las dos cosas: haz el global primero y el del repo después. El agente del proyecto gana sobre el global; las skills y el steering se fusionan.

---

## Paso 3 — Instalación en el repositorio

Desde la **raíz del repositorio de trabajo** (donde está `.git`). Confirma que estás en el lugar correcto:

```powershell
Get-ChildItem -Force | Select-Object Name
```

Debes ver `.git` y la carpeta `kit`.

Copia en este orden. Los comandos crean las carpetas si faltan y **fusionan** si ya existen, sin borrar un `.kiro/specs` que ya tengas:

```powershell
# 1. Reglas, agentes, skills y (opcionalmente) hooks
New-Item -ItemType Directory -Force .\.kiro | Out-Null
Copy-Item -Recurse -Force .\kit\.kiro\* .\.kiro\
Copy-Item -Force .\kit\.kiro\.gitattributes .\.kiro\

# 2. Punto de entrada, memoria y aviso legal
Copy-Item -Force .\kit\AGENTS.md, .\kit\MEMORY.md, .\kit\THIRD-PARTY-NOTICES.md .

# 3. Licencias
New-Item -ItemType Directory -Force .\licenses | Out-Null
Copy-Item -Force .\kit\licenses\* .\licenses\

# 4. Decisiones de arquitectura
New-Item -ItemType Directory -Force .\docs\decisions | Out-Null
Copy-Item -Force .\kit\docs\decisions\README.md, .\kit\docs\decisions\0000-template.md .\docs\decisions\
```

Comprueba el resultado:

```powershell
Get-ChildItem .\.kiro -Recurse -File | Measure-Object
Get-ChildItem .\.kiro\agents, .\.kiro\steering, .\.kiro\skills, .\.kiro\hooks | Select-Object Name
```

### Si el repositorio ya tiene estos archivos

No sobrescribas a ciegas:

- **`AGENTS.md` existente**: abre el del kit, copia su sección `## Working rules` y pégala en tu `AGENTS.md` debajo de lo que ya tengas. Las reglas del kit son aditivas; el archivo no debe quedar con dos encabezados duplicados.
- **`MEMORY.md` existente**: fusiona las secciones (`Active decisions`, `Invariants`, `Gotchas`, `Dead ends`, `Open questions`) y conserva el contenido previo.
- **`.kiro/specs/` existente**: no se toca. Por eso se copian subcarpetas y no `.kiro` completo.
- **`.kiro/agents/` con agentes propios**: los cuatro del kit tienen nombres únicos (`orchestrator`, `explorer`, `writer`, `verifier`). Si ya existía uno con ese nombre, revisa el diff antes de aceptar el del kit.

No copies `README.md`, `README.es.md`, `ZERO-INSTALL.md` ni la carpeta `kit/` dentro del repositorio de trabajo. Son documentación del kit, no parte de la configuración.

---

## Paso 4 — Instalación global (tu perfil de Windows)

La instalación global copia las reglas, el punto de entrada, las 12 skills y los 4 agentes a `%USERPROFILE%\.kiro`. Aplica a todos los repositorios; no se commitea ni se revisa en un PR. Escribe fuera del repo, así que si la política lo prohíbe o `.kiro` está gestionado por MDM, usa el ámbito del repositorio.

Si `KIRO_HOME` está definido, Kiro usa ese directorio en vez de `%USERPROFILE%\.kiro`. Compruébalo antes de ejecutar el bloque:

```powershell
$env:KIRO_HOME
```

Si imprime una ruta, reemplaza `$k = "$env:USERPROFILE\.kiro"` por `$k = $env:KIRO_HOME`. Prefiere una ruta sin espacios: un espacio literal en una URI `file://` no es portable.

Antes de copiar, comprueba que no haya una instalación oficial de gentle-ai:

```powershell
Test-Path "$env:USERPROFILE\.kiro\steering\gentle-ai.md"
```

Si devuelve `True`, el backup del paso 0 lo conserva; no dejes dos steerings ODD siempre activos. Elige una fuente.

Desde la raíz del repo donde tienes `kit`:

```powershell
$k = "$env:USERPROFILE\.kiro"

# 0. Backup de lo que el kit va a tocar
$stamp = Get-Date -Format yyyyMMdd-HHmm
$backup = "$env:USERPROFILE\.kiro.backup-$stamp"
New-Item -ItemType Directory -Force $backup | Out-Null
foreach ($d in "steering","agents","skills") {
  if (Test-Path "$k\$d") { Copy-Item -Recurse -Force "$k\$d" $backup }
}

# 1. Steering y punto de entrada global
New-Item -ItemType Directory -Force "$k\steering","$k\agents","$k\skills" | Out-Null
Copy-Item -Force .\kit\.kiro\steering\*.md "$k\steering\"
Copy-Item -Force .\kit\AGENTS.md "$k\steering\AGENTS.md"

# 2. Skills: no fusionar sobre skills con el mismo nombre
$collisions = Get-ChildItem .\kit\.kiro\skills -Directory |
  Where-Object { Test-Path (Join-Path "$k\skills" $_.Name) }
if ($collisions) {
  $collisions.Name
  throw "Esos nombres de skill ya existen en $k\skills. Haz backup, bórralos y vuelve a ejecutar."
}
Copy-Item -Recurse -Force .\kit\.kiro\skills\* "$k\skills\"

# 3. Agentes
Copy-Item -Force .\kit\.kiro\agents\*.md "$k\agents\"

# 4. Apunta los agentes globales a los recursos globales
$abs = ($k -replace '\\','/')
foreach ($name in "orchestrator","explorer","writer","verifier") {
  $p = "$k\agents\$name.md"
  if (-not (Test-Path $p)) { continue }
  $t = [System.IO.File]::ReadAllText($p)
  $t = $t.Replace('file://.kiro/steering/**/*.md', "file:///$abs/steering/**/*.md")
  $t = $t.Replace('skill://.kiro/skills/*/SKILL.md', 'skill://~/.kiro/skills/*/SKILL.md')
  [System.IO.File]::WriteAllText($p, $t, [System.Text.UTF8Encoding]::new($false))
}

# 5. Licencias de las 9 skills de upstream
Copy-Item -Force .\kit\THIRD-PARTY-NOTICES.md "$k\THIRD-PARTY-NOTICES.md"
New-Item -ItemType Directory -Force "$k\licenses" | Out-Null
Copy-Item -Force .\kit\licenses\* "$k\licenses\"
```

Por qué el paso 4: un agente del repo resuelve `file://.kiro/steering/...` contra el repositorio. Uno global tiene que nombrar el directorio global, y `file://` no documenta la expansión de `~`, así que se escribe la ruta absoluta. `skill://` sí documenta la expansión de home. La escritura es UTF-8 sin BOM a propósito: un BOM puede romper el frontmatter YAML.

### Qué queda en el repositorio

Aunque instales en global, estas piezas siguen siendo del repo:

- `MEMORY.md`: es estado del proyecto. Puedes copiar la plantilla a cada repo cuando la necesites.
- `docs/decisions/`: los ADRs viven con el código que explican.
- `.kiro/specs/`: un spec pertenece a una feature de un repo.
- `.kiro/hooks/` y `.kiro/bin/`: se quedan fuera del global. Un hook global se dispara en todos los repos y su comando corre con el proyecto como cwd, así que necesitaría una ruta absoluta a los scripts.

### Qué esperar

- **Precedencia:** un agente del proyecto con el mismo nombre gana sobre el global, con aviso; las skills se fusionan y gana el workspace por nombre; el steering se fusiona y gana el workspace en conflictos.
- **Superficie global:** el `writer` global puede editar `src/**` en cualquier repo. Es el objetivo, pero es más amplio que un archivo revisado por repo. Si te incomoda, instala en global solo steering, `AGENTS.md` y skills, y deja los agentes en el ámbito del repositorio.
- **Agentes existentes:** si ya tenías agentes globales llamados `orchestrator`, `explorer`, `writer` o `verifier`, el paso 3 los sobrescribe; el backup del paso 0 conserva los originales.
- **Instalación oficial:** si ya existe `~/.kiro/steering/gentle-ai.md` o skills con los mismos nombres, no corras dos steerings ODD. El backup del paso 0 los conserva; elige una fuente.

### Verifica la instalación global

```powershell
$k = "$env:USERPROFILE\.kiro"
Get-ChildItem "$k\steering" | Select-Object Name
(Get-ChildItem "$k\skills" -Directory).Count
Select-String "file://|skill://" "$k\agents\*.md"
```

El conteo debe incluir las 12 carpetas de skills del kit; puede ser mayor si ya tenías otras. Las rutas de los agentes deben nombrar `file:///C:/Users/<tu-usuario>/.kiro/steering/**/*.md` y `skill://~/.kiro/skills/*/SKILL.md`. Después, en Kiro: `/config` para confirmar steering y skills, selecciona `orchestrator` en un repo sin `.kiro` propio y pregúntale qué reglas tiene.

### Desinstala el global

Borra solo los nombres que instaló el kit:

```powershell
$k = "$env:USERPROFILE\.kiro"
'00-odd-core','10-artifacts-and-commits','20-testing','30-memory','40-specs-bridge','50-sdd-gates','AGENTS' |
  ForEach-Object { Remove-Item "$k\steering\$_.md" -Force -ErrorAction SilentlyContinue }
'orchestrator','explorer','writer','verifier' |
  ForEach-Object { Remove-Item "$k\agents\$_.md" -Force -ErrorAction SilentlyContinue }
'branch-pr','chained-pr','cognitive-doc-design','comment-writer','go-testing','judgment-day',
'odd-feature','skill-creator','skill-improver','systemic-issue-triage','verification','work-unit-commits' |
  ForEach-Object { Remove-Item -Recurse -Force "$k\skills\$_" -ErrorAction SilentlyContinue }
Remove-Item "$k\THIRD-PARTY-NOTICES.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$k\licenses" -ErrorAction SilentlyContinue
```

Si alguna de esas skills ya existía antes, restaura el backup en vez de borrarla.

---

## Paso 5 — Decide si conservas los hooks (la única parte que ejecuta procesos)

Los tres hooks llaman a `node`, el mismo comando en Windows, macOS y Linux. No hay que cambiar comandos por sistema ni tocar políticas de PowerShell.

En una máquina corporativa monitoreada, la recomendación por defecto sigue siendo **quitarlos** salvo que IT lo apruebe:

```powershell
Remove-Item -Recurse -Force .\.kiro\hooks, .\.kiro\bin
```

Qué pierdes: solo la impresión automática de contexto al iniciar sesión (rama, estado, últimos commits, cola de `MEMORY.md`). No pierdes el comportamiento, porque `AGENTS.md` le dice al agente que lea `MEMORY.md` al empezar, y `30-memory.md` repite la regla. Los hooks eran una comodidad sobre una regla que ya existe.

Qué ganas: cero procesos lanzados por el kit, cero superficie que un EDR o un agente de monitoreo registre como automatización.

### Si IT aprueba conservarlos

Comprueba que Node está en PATH:

```powershell
node --version
```

Node viene con npm en la imagen corporativa. Si no está, borra los hooks; el resto del kit no lo necesita.

No edites los JSON: ya apuntan a `.kiro/bin/*.js`. Si conservas solo uno, conserva `session-start`. `stop-checks` ejecuta la suite completa al final de cada turno: es pesado y muy visible en un equipo monitoreado.

---

## Paso 6 — Ajusta las superficies de edición (el paso que todos saltan)

Esto es lo que hace que el kit sea útil o inútil.

`writer` y `orchestrator` solo pueden escribir en las rutas declaradas en su bloque `permissions.rules` de `fs_write`. Las reglas `deny` ganan siempre. Los globs que vienen por defecto son:

```yaml
        - "src/**"
        - "tests/**"
        - "test/**"
        - "docs/**"
        - "odd/**"
        - "MEMORY.md"
```

Si tu proyecto guarda código en `app/`, `components/`, `packages/`, `internal/` o `cmd/`, y tests en `__tests__/`, el writer va a rechazar la escritura y reportará la ruta exacta. Eso es el diseño funcionando —se detiene en vez de ampliar su propia superficie—, pero pierdes un turno. Edita el bloque en **`.kiro/agents/writer.md` y el bloque equivalente en `.kiro/agents/orchestrator.md`** para que coincidan con tu repositorio. Ejemplo:

```yaml
    - capability: fs_write
      effect: allow
      match:
        - "app/**"
        - "__tests__/**"
        - "docs/**"
        - "odd/**"
        - "MEMORY.md"
```

Reglas para no romperlo:

1. La lista `allow` de `writer` y la de `orchestrator` deben ser iguales. Si divergen, el orquestador podrá escribir donde su writer no, y viceversa.
2. No toques la lista `deny` (`.kiro/**` y `**/.kiro/**` para la configuración global, `.git/**`, `.github/**`, `.env*`, claves, secretos).
3. En `verifier.md` y `explorer.md`, revisa la lista de `shell`. Hoy permiten `npm test`, `npm run`, `npm ls` y lecturas de git. Si tu suite real es `npm run test:ci`, ya entra por `npm run *`; si es otro runner, agrégalo explícitamente y quita lo que no aplique.
4. No agregues `npm install`, `npm ci`, `npm i` ni `npx`. Cambiar dependencias es una decisión humana y un evento de supply chain; `npx` descarga y ejecuta código del registro. Si tu equipo estandarizó una herramienta concreta, autoriza ese nombre exacto, nunca `npx *`.

En modo global, los mismos bloques están en `%USERPROFILE%\.kiro\agents\`; edítalos allí también si quieres que la superficie global coincida con tu repositorio.

---

## Paso 7 — Verifica dentro de Kiro

1. Abre **la carpeta del repositorio** en Kiro (no una carpeta padre).
2. Pregunta al agente: «¿qué archivos de steering tienes cargados?». Debe nombrar los seis de `.kiro/steering/`, o al menos comportarse según ellos.
3. Confirma que `/odd-feature` y `/judgment-day` aparecen como skills disponibles.
4. Selecciona **`orchestrator`** como agente de la sesión. Es el que puede delegar en `explorer`, `writer` y `verifier`.
5. **Prueba de delegación**: pídele que mapee un módulo en modo solo lectura. La primera vez Kiro pedirá confirmación antes de lanzar el subagente, porque el kit no concede una regla `subagent` global; aprobar es el punto, así cada delegación queda visible. Si Kiro dice que el agente no puede delegar, agrega `subagent` a `tools` en `orchestrator.md`, junto a las tres entradas `subagent/<nombre>`. No agregues `@builtin` ni `*`: ambos incluyen la herramienta genérica que puede lanzar cualquier agente y anulan la restricción.
6. **Prueba de superficie**: pide a `writer` que cree un archivo en la raíz, fuera de las rutas permitidas. Debe rechazarlo el runtime, no el modelo. No queda archivo que borrar.
7. Si quitaste los hooks, no esperes el resumen automático al iniciar: el agente debe leer `MEMORY.md` por `AGENTS.md`. Pídele que lo haga y confirma que puede.

La verificación estructural:

```powershell
Get-ChildItem .\.kiro\hooks\*.json -ErrorAction SilentlyContinue | ForEach-Object {
  try { Get-Content $_ -Raw -ErrorAction Stop | ConvertFrom-Json | Out-Null; "ok  $($_.Name)" }
  catch { "BAD $($_.Name)" }
}
Get-ChildItem .\.kiro\bin\*.js | ForEach-Object {
  node --check $_.FullName
  if ($LASTEXITCODE -ne 0) { "BAD $($_.Name)" }
}
Get-Content .\.kiro\agents\*.md -TotalCount 1
Get-Content .\.kiro\skills\*\SKILL.md -TotalCount 1
```

Cada archivo de agente y de skill debe empezar con `---` (frontmatter YAML). Si ves la primera línea de contenido en vez de `---`, el archivo se copió o se editó mal.

---

## Paso 8 — Commitea en una rama

El kit entra al repositorio como cualquier otro cambio, y ese es el punto: se revisa en un PR.

```powershell
git switch -c chore/kiro-discipline-kit
git add .kiro AGENTS.md MEMORY.md THIRD-PARTY-NOTICES.md licenses docs/decisions
git status --short
git commit -m "chore: add Kiro discipline kit"
```

Antes de commitear, revisa el diff: todo debe ser texto, sin datos de la empresa ni rutas personales. El push y el PR los decides tú; el kit no los hace y sus agentes tienen prohibido hacerlos.

Si tu política exige aprobación, ese PR es el artefacto de revisión: un revisor puede leer cada regla, cada agente y cada hook antes de que existan.

---

## Paso 9 — Cómo se usa en el día a día

1. Abres la sesión. `AGENTS.md` dispara la lectura de `MEMORY.md` y el chequeo de steering.
2. Describes la tarea. Si es una pregunta, una investigación o una revisión, el agente se queda en solo lectura. Si pides un cambio, entra en ODD: explorar, resolver dudas, clasificar.
3. Trabajo grande y con forma de feature: crea un **Kiro Spec** en `.kiro/specs/<feature>/` (requirements, design, tasks) **o** usa `/odd-feature`, nunca los dos. El spec es el documento de la feature; `40-specs-bridge.md` explica el mapeo. Si el spec existe y quieres SDD estricto, `50-sdd-gates.md` bloquea la implementación hasta que `requirements.md` y `design.md` tengan `## Approval` con `Status: approved` y cada tarea cite un `S#`; la aprobación es tuya, porque en el kit por defecto los agentes no pueden escribir en `.kiro/**`.
4. Implementación: test primero (RED → GREEN → REFACTOR), en inline o con `writer` si hay una razón concreta.
5. Cambio de alto riesgo: `verifier` da veredicto por criterio; si quieres revisión adversarial, `/judgment-day` con dos jueces ciegos.
6. Al cerrar: una línea en `MEMORY.md` solo si redescubrirlo costaría tiempo real; un ADR en `docs/decisions/` si tomaste una decisión de arquitectura.
7. Commits convencionales, sin atribución de IA. Nunca push, merge ni force-push desde el agente.

---

## macOS y Linux

El núcleo es idéntico; cambian los comandos de copia y el manejo de los hooks.

### Instalación en el repositorio

```sh
cp -R kit/.kiro .
cp kit/AGENTS.md kit/MEMORY.md kit/THIRD-PARTY-NOTICES.md .
cp -R kit/licenses .
mkdir -p docs/decisions
cp kit/docs/decisions/README.md kit/docs/decisions/0000-template.md docs/decisions/
```

`cp -R kit/.kiro .` fusiona el contenido si `.kiro` ya existe y conserva `.kiro/specs` (probado en macOS; GNU `cp` se comporta igual en este caso). Mantén `.kiro/.gitattributes`: mantiene LF en los `.js` y el texto.

### Hooks

No cambies nada: los JSON llaman a `node`, el mismo comando en los tres sistemas. Node viene con npm; comprueba `node --version`. Si no está, borra los hooks. Ya no hay variantes por sistema.

Como todos los hooks llaman a `node`, el mismo hook commiteado funciona en Windows, macOS y Linux. Node es el único requisito; una máquina sin Node debe borrar los hooks o trabajar sin ellos.

### Instalación global

Es el mismo procedimiento que Windows, con `$k="${KIRO_HOME:-$HOME/.kiro}"` y `sed` en lugar de `.Replace`:

```sh
k="${KIRO_HOME:-$HOME/.kiro}"
mkdir -p "$k/steering" "$k/agents" "$k/skills"
cp kit/.kiro/steering/*.md "$k/steering/"
cp kit/AGENTS.md "$k/steering/AGENTS.md"
cp -R kit/.kiro/skills/* "$k/skills/"   # si hay colisiones, usa el bloque completo de README.md
cp kit/.kiro/agents/*.md "$k/agents/"
for name in orchestrator explorer writer verifier; do
  f="$k/agents/$name.md"
  [ -f "$f" ] || continue
  sed -i.bak \
    -e "s|file://\.kiro/steering/\*\*/\*\.md|file://$k/steering/**/*.md|" \
    -e "s|skill://\.kiro/skills/\*/\SKILL\.md|skill://~/.kiro/skills/*/SKILL.md|" \
    "$f"
  rm -f "$f.bak"
done
cp kit/THIRD-PARTY-NOTICES.md "$k/THIRD-PARTY-NOTICES.md"
mkdir -p "$k/licenses"
cp kit/licenses/* "$k/licenses/"
```

El bloque completo de `README.md` añade backup, detección de colisiones y verificación; la desinstalación POSIX está en su sección `macOS and Linux`. Son los mismos pasos que Windows, cambiando `%USERPROFILE%` por `$HOME`.

### Verifica

```sh
k="${KIRO_HOME:-$HOME/.kiro}"
ls "$k/steering"
find "$k/skills" -mindepth 1 -maxdepth 1 -type d | wc -l
grep -nE "file://|skill://" "$k/agents/"*.md
```

Las rutas deben ser `file:///Users/<tu-usuario>/.kiro/steering/**/*.md` (o `file:///home/...`) y `skill://~/.kiro/skills/*/SKILL.md`. En Kiro, `/config` confirma steering y skills. Comprueba Node con `node --version`; si no está, borra los hooks.

Comprueba los finales de línea con `git check-attr eol -- .kiro/bin/session-context.js`: debe imprimir `eol: lf`.

Los agentes permiten por defecto `npm` y `git` en `shell`. Si el proyecto usa Go, Python o Rust, agrega el runner exacto (`go test *`, `python3 -m pytest *`, `cargo test *`) a `verifier.md` y `explorer.md`; el hook Node ya sondea esos toolchains.

---

## Qué no se porta (y por qué)

- **La autoridad de revisión de RDD.** Gentle AI congela un candidato inmutable, elige lentes y emite recibos criptográficos. Kiro no tiene equivalente. `judgment-day` reproduce la disciplina —congelar, dos jueces ciegos, corrección acotada, sobrevivientes honestos— y lo dice en su propio texto: es disciplina, no autoridad verificable.
- **Engram.** Se reemplaza, no se emula. `MEMORY.md`, los ADRs y los specs cubren la continuidad y además son revisables en un PR. Pierdes búsqueda semántica; ganas procedencia.
- **Output styles y slash commands de gentle-ai.** Kiro no los soporta como feature. Las skills con el mismo nombre cubren parte del hueco.
- **Los agentes `jd-*` y `review-*` de la integración oficial.** Dependen de Engram y del CLI de review nativo. Copiarlos tal cual es una trampa; el kit los reemplaza con `judgment-day`.

---

## SDD estricto (opcional)

`50-sdd-gates.md` se carga siempre, pero solo actúa cuando hay un spec en `.kiro/specs/`. Bloquea el diseño y la implementación hasta que:

- `requirements.md` tenga criterios numerados y `## Approval` con `Status: approved`, `Approved by` y `Date`;
- `design.md` cubra arquitectura, componentes, datos, errores y testing, y esté aprobado;
- cada tarea de `tasks.md` cite al menos un `S#`.

La aprobación es humana. En el kit por defecto los agentes no pueden escribir en `.kiro/**`; el bloque lo editas tú o el editor de specs de Kiro. Es steering, no una autoridad criptográfica: instruye al agente, no lo bloquea a nivel de runtime. Lo que sí bloquea son las `permissions` de los agentes.

## Problemas típicos

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `writer` rechaza escribir en una ruta válida | Los globs no coinciden con tu repo | Paso 6; edita `writer.md` y `orchestrator.md` |
| «El agente no puede delegar» | Falta la forma que tu versión de Kiro espera | Agrega `subagent` junto a `subagent/<nombre>` en `orchestrator.md` |
| Las skills no aparecen | `name` distinto del nombre de carpeta, o falta `SKILL.md` | Debe ser `.kiro/skills/<name>/SKILL.md` y `name: <name>` |
| Los hooks no hacen nada | Node no está en PATH, o los hooks están deshabilitados | Comprueba `node --version`; si no está, bórralos; no instales nada sin IT |
| Un hook falla con `node: command not found` | Node no está en PATH | Bórralos o usa una máquina con Node |
| Kiro ignora el steering | CLI V2, o `.kiro` no está en la raíz del workspace | `/upgrade-agent`, o abre la carpeta correcta |
| El agente intenta `npm install` | Está prohibido a propósito | La dependencia la decide un humano, fuera del agente |

---

## Checklist final

- [ ] Los 43 archivos llegaron a la máquina
- [ ] Ámbito elegido: repositorio, global o ambos

### Si elegiste repositorio

- [ ] `.kiro/steering/` tiene 6 archivos en la raíz del repo
- [ ] `.kiro/agents/` tiene 4 agentes
- [ ] `.kiro/skills/` tiene 12 carpetas con `SKILL.md`
- [ ] `.kiro/.gitattributes` presente y con `*.js text eol=lf`
- [ ] `AGENTS.md` fusionado, no duplicado
- [ ] `MEMORY.md` fusionado
- [ ] `docs/decisions/` con README y plantilla
- [ ] `licenses/` y `THIRD-PARTY-NOTICES.md` copiados
- [ ] Decisión sobre hooks tomada y documentada
- [ ] Hooks verificados con `node --check`, si los conservas
- [ ] Superficies de edición adaptadas al repo real
- [ ] Kiro muestra steering y skills
- [ ] Delegación probada con confirmación
- [ ] Rechazo de escritura fuera de superficie probado
- [ ] Commit en rama, diff revisado

### Si elegiste global

- [ ] Backup de `%USERPROFILE%\.kiro` creado
- [ ] 6 steering y `AGENTS.md` en `%USERPROFILE%\.kiro\steering\`
- [ ] 12 skills en `%USERPROFILE%\.kiro\skills\`
- [ ] 4 agentes en `%USERPROFILE%\.kiro\agents\`
- [ ] `resources` de los 4 agentes apunta a la ruta absoluta global
- [ ] Superficies globales adaptadas, si aplica
- [ ] `licenses/` y `THIRD-PARTY-NOTICES.md` en `%USERPROFILE%\.kiro\`
- [ ] `/config` muestra steering y skills
- [ ] `orchestrator` global responde con las reglas ODD en un repo sin `.kiro`
- [ ] Hooks no instalados en global, por diseño

---

## Nota corporativa

El kit no contiene datos de la empresa, credenciales ni telemetría, y no habla con ningún servicio externo. En el repositorio se commitea y se revisa en el PR que lo introduce; en modo global es configuración personal de tu perfil. Las 9 skills copiadas de gentle-ai están bajo Apache-2.0 y viajan con su aviso y sus licencias; el resto es original de este kit. Si un revisor pregunta qué ejecuta: solo los hooks opcionales, y se pueden eliminar sin perder la disciplina.
