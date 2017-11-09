const Koa = require('koa');
const router = require('koa-router')();
const body = require('koa-body');
const axios = require('axios');
const https = require('https');
const qs = require('qs');
const app = new Koa();
var cors = require('koa2-cors');
const port = process.env.PORT || 3335;
app.use(cors({
    origin:'*',
}));
app.use(body());
app.on('error', function(err){
    log.error('server error', err);
});

app.use(async function (ctx, next) {
    // console.log(ctx.path)
    var headers = ctx.headers;

    // headers.host = 'www.skout.com';
    let protocol = headers._protocol || 'http';
    if(protocol==='http'){
        protocol +='://ios'
    }else{
        protocol +='://i'
    }

    delete headers.host;
    delete headers._protocol;
    delete headers.origin;
    delete headers.referer;
    delete headers.connection;
    delete headers['content-length'];
    // delete headers['content-type'];
    delete headers['cache-control'];
    delete headers['cache-control'];
    delete headers['postman-token'];
    delete headers['accept'];
    delete headers['accept-encoding'];
    delete headers['accept-language'];
    delete headers['user-agent'];

    let data = null;
    if(ctx.request.body){
        if(headers['content-type']){
            data = headers['content-type'].indexOf('x-www-form-urlencoded')!==-1?qs.stringify(ctx.request.body):ctx.request.body
        }
    }

    var config = {
        timeout: 10000,
        method:ctx.method,
        url:(protocol+'.skoutapis.com'+ctx.path),
        params:ctx.query,
        data:data,
        headers:headers,
      };
    async function aa(){
        let value = await new Promise(function(resolve,reject){
            axios(config).then(function(res){
                resolve(res);
            }).catch(function(error){
                // console.log('错误');
                if(error.response){
                  resolve(error.response);
                }else{
                  // console.log(error)
                  resolve(error.data);
                }
            })
        });
        for(var name in value.headers){
            ctx.set(name,value.headers[name])
        }
        // console.log(value.data)
        ctx.set('access-control-allow-origin',"*");
        // if(value.response){
          // value = value.response;
        // }
        if(value){
            ctx.status = value.status;
            ctx.body = value.data;
        }else{
            ctx.body = ''
        }
    }
    return aa();
});

app.use(router.routes());
app.listen(port,function () {
    console.log('index-isskout is running http://0.0.0.0:'+port)
});
