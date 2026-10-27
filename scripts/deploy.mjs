// Publica dist/ no branch gh-pages do mesmo repositório (GitHub Pages, sem Actions).
import { execSync } from 'node:child_process'
import { copyFileSync, writeFileSync } from 'node:fs'

const git = (key) => execSync(`git config ${key}`).toString().trim()
const remote = execSync('git remote get-url origin').toString().trim()
// O repositório temporário em dist/ usa a mesma identidade do repositório principal.
const identity = {
  GIT_AUTHOR_NAME: git('user.name'),
  GIT_AUTHOR_EMAIL: git('user.email'),
  GIT_COMMITTER_NAME: git('user.name'),
  GIT_COMMITTER_EMAIL: git('user.email'),
}
const run = (cmd, cwd) =>
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, ...identity, BASE_PATH: '/verdura/' } })

run('npm run build')
// SPA no Pages: rotas diretas e refresh caem no 404.html, que carrega o mesmo app.
copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')

run('git init -q -b gh-pages', 'dist')
run('git add -A', 'dist')
run('git commit -q -m "Publicação do site"', 'dist')
run(`git push -f -q ${remote} gh-pages`, 'dist')
console.log('Publicado no branch gh-pages.')
