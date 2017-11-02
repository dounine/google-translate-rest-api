const Koa = require('koa');
const router = require('koa-router')();
const body = require('koa-body');
const app = new Koa();
var cors = require('koa-cors');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(body());

app.use(require(__dirname+'/translate/index.js')().routes());//端口路由

app.on('error', function(err){
    log.error('server error', err);
});

app.use(router.routes());
app.listen(port,function () {
    console.log('google-translate-reset-api is running http://0.0.0.0:'+port)
});
