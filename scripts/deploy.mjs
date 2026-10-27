// Publica dist/ no branch gh-pages do mesmo repositório (GitHub Pages, sem Actions).
import { execSync } from 'node:child_process'
import { copyFileSync, writeFileSync } from 'node:fs'

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, BASE_PATH: '/verdura/' } })
const remote = execSync('git remote get-url origin').toString().trim()

run('npm run build')
// SPA no Pages: rotas diretas e refresh caem no 404.html, que carrega o mesmo app.
copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')

run('git init -q -b gh-pages', 'dist')
run('git add -A', 'dist')
run('git commit -q -m "Publicação do site"', 'dist')
run(`git push -f -q ${remote} gh-pages`, 'dist')
console.log('Publicado no branch gh-pages.')
