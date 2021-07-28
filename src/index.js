//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router


// todas as configuraçoes devem ser passadas via environment variables


const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs')
const models = require('./models');
const koaBody = require('koa-body');


const koa = new Koa();
const router = new Router();

const PORT = process.env.PORT || 3000;


koa
  .use(router.routes())
  .use(router.allowedMethods())
  .use(json())
  .use(bodyParser());

render(koa, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false
})

//rota para renderizar view
router.get('/', async (ctx) => {
  await ctx.render('layout')
});


//Rota para listar os usuários
router.get('/users', async (ctx) => {
  try{
    const result = await models.Users.findAll();
    ctx.body = result;
    ctx.response.status = 200;
  }catch (error){
    console.error(error);
    ctx.body.message = "Não foi possível acessar a lista de usuários!";
    ctx.response.status = 500;
  }
});

//Rota para criar novos usuários
router.post('/create-user', koaBody({ multipart: true }), async (ctx) => {
    try {
      console.log("return:", ctx.request.body);
      const newUser = {
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        age: ctx.request.body.age
      };
      const result = await models.Users.create(newUser);
      ctx.body = result;
      ctx.response.status = 200;



    } catch (error) {
      console.error(error);
      ctx.body.message = "Não foi possível criar o usuário!";
      ctx.response.status = 500;
    }
  }
);

//Rota para atualizar os usuários
router.put('/update-user', koaBody({ multipart: true }), async (ctx) => {
    try {
      const updateUser = {
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        age: ctx.request.body.age
      };
      const result = await models.Users.update(updateUser,
        {
          where: {
            id: ctx.request.body.id
          }
        }
        );

      ctx.body = result;
      ctx.response.status = 200;

      console.log(ctx.request.body);

    } catch (error) {
      console.error(error);
      ctx.body.message = "Não foi possível atualizar o usuário!";
      ctx.response.status = 500;
    }
  }
);

router.post('/delete-user', koaBody(), async (ctx) => {
    try {
      console.log("return:", ctx.request.body);
      const result = await models.Users.destroy(
        {
          where: {
            id: ctx.request.body.id
          }
        }
      );

      ctx.body = result;
      ctx.response.status = 200;

      console.log(ctx.request.body);

    } catch (error) {
      console.error(error);
      ctx.body.message = "Não foi possível deletar o usuário!";
      ctx.response.status = 500;
    }
  }
);

const server = koa.listen(PORT);

module.exports = server;