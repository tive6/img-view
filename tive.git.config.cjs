const { argv } = process
const desc = (argv.length > 4 && argv.slice(-1)[0]) || `feat：crm 审批`

module.exports = {
  shell: [
    'git status',
    'git add .',
    `git commit -m "${desc}"`,
    'git pull origin master',
    'git push origin master',
    // 'git merge --no-ff -m "clue-now merge into master" test',
    // 'npm run push',qq
  ],
}
