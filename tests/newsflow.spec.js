const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

async function criarRascunho(page) {
  await page.getByLabel('Título da edição').fill('Novidades da semana')
  await page.getByLabel('Conteúdo inicial').fill('Nossa primeira notícia.')
  await page.getByRole('button', { name: 'Criar rascunho' }).click()
}

test('C1 - cria uma edição e obtém aprovação de outra revisora', async ({ page }) => {
  await criarRascunho(page)
  await expect(page.getByRole('heading', { name: 'Novidades da semana' })).toBeVisible()
  await expect(page.getByText('Estado: rascunho', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Solicitar revisão' }).click()
  await page.getByLabel('Perfil ativo').selectOption('Beatriz')
  await page.getByRole('button', { name: 'Aprovar edição' }).click()
  await expect(page.getByText('Estado: aprovada', { exact: true })).toBeVisible()
  await expect(page.getByText('Aprovada por Beatriz', { exact: true })).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('Edição aprovada e liberada para envio.')
})

test('C2 - bloqueia a autoaprovação e mantém a edição em revisão', async ({ page }) => {
  await criarRascunho(page)
  await page.getByRole('button', { name: 'Solicitar revisão' }).click()
  await page.getByRole('button', { name: 'Aprovar edição' }).click()
  await expect(page.getByRole('alert')).toHaveText('A autora não pode aprovar a própria edição.')
  await expect(page.getByText('Estado: em revisão', { exact: true })).toBeVisible()
  await expect(page.getByText('Aprovada por Ana', { exact: true })).toHaveCount(0)
})

test('C3 - mantém o rascunho editado depois de recarregar', async ({ page }) => {
  await criarRascunho(page)
  await page.getByLabel('Conteúdo de Novidades da semana', { exact: true }).fill('Notícia revisada para a próxima edição.')
  await page.getByRole('button', { name: 'Salvar alterações' }).click()
  await expect(page.getByRole('status')).toHaveText('Alterações salvas. A edição está em rascunho e precisa de nova revisão.')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Novidades da semana' })).toBeVisible()
  await expect(page.getByLabel('Conteúdo de Novidades da semana', { exact: true })).toHaveValue('Notícia revisada para a próxima edição.')
  await expect(page.getByText('Estado: rascunho', { exact: true })).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(1)
})

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('Estado final da interface', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png'
  })
})
