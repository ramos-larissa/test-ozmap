//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs')

const koa = new Koa();
const router = new Router();

render(koa, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false
})


//rota simples pra testar se o servidor está online
router.get('/', async (ctx) => {
  await ctx.render('home')
});

//Uma rota de exemplo simples aqui.
//As rotas devem ficar em arquivos separados, /src/controllers/userController.js por exemplo
router.get('/users', async (ctx) => {
    ctx.status = 200;
    ctx.body = {total:0, count: 0, rows:[]}
});

koa
  .use(router.routes())
  .use(router.allowedMethods())
  .use(json());

const server = koa.listen(PORT);

module.exports = server;