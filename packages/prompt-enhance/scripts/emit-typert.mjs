/**
 * Emit this package's typert face artifacts (lib/typert.host.* and
 * lib/typert.remote-client.*) without a workspace-wide tsdown pass: run the
 * workspace generator over this package only, then write the artifacts the
 * plugin's `./typert` and `./remote` exports promise.
 *
 * The package must be referenced from the root tsconfig.host.json (the
 * analyzer discovers packages from that aggregate).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = resolve(here, '..', '..', '..', '..')
// The generator is a workspace package not linked into arbitrary package
// node_modules; resolve it by its repository-relative lib artifact instead.
const generatorLib = pathToFileURL(join(workspaceRoot, 'packages', 'typert', 'generator', 'lib', 'index.js')).href
const { WorkspaceTypertGenerator } = await import(generatorLib)

const PACKAGE = '@istarry/dsh-prompt-enhance'

const generator = new WorkspaceTypertGenerator(workspaceRoot, { checkDiagnostics: false })
const artifacts = generator.generate([PACKAGE], ['host'])
const matching = artifacts.filter(artifact => artifact.package === PACKAGE)
if (matching.length === 0) {
  throw new Error(`emit-typert: no host face artifacts generated for ${PACKAGE}`)
}

for (const artifact of matching) {
  const outDir = join(workspaceRoot, artifact.packageRoot, 'lib')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, `typert.${artifact.face}.js`), artifact.js)
  writeFileSync(join(outDir, `typert.${artifact.face}.d.ts`), artifact.dts)
  if (artifact.remote !== undefined) {
    writeFileSync(join(outDir, 'typert.remote-client.js'), artifact.remote.js)
    writeFileSync(join(outDir, 'typert.remote-client.d.ts'), artifact.remote.dts)
    writeFileSync(join(outDir, 'typert.remote-client.d.ts.map'), artifact.remote.dtsMap)
  }
  console.log(`emit-typert: wrote typert.${artifact.face} for ${artifact.package}`)
}
