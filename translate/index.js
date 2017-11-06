var Router = require('koa-router');
const translate = require('google-translate-api');
const languages = require('./languages');
const axios = require('axios');
module.exports = function () {
    return new Router()
        .post('/translate',async function (ctx) {
        ctx.set("Access-Control-Allow-Origin", "*");
        var resourceLanguage = ctx.request.body.resourceLanguage;
        if(resourceLanguage===undefined){
            ctx.body = {
                error:1,
                msg:'resourceLanguage字段不能为空'
            }
            return;
        }
        var targetLanguage = ctx.request.body.targetLanguage;
        if(targetLanguage===undefined){
            ctx.body = {
                error:1,
                msg:'targetLanguage字段不能为空'
            }
            return;
        }
        var translateResource = ctx.request.body.translateResource;
        if(translateResource===undefined){
            ctx.body = {
                error:1,
                msg:'translateResource字段不能为空'
            }
            return;
        }

        var aa = async function bb() {
            var value = await new Promise(function (resolve,reject) {
                translate(translateResource, {from: resourceLanguage, to: targetLanguage}).then(function (res) {
                    resolve(res.text);
                }).catch(function (error) {
                    reject(error);
                });
            });
            ctx.body = new Array({
                value:value
            });
        }

        return aa();
    }).get('/skout-image/:id/:size',async function (ctx) {
        let config = {
            url: 'http://images-public.skout.com/'+ctx.params.id+'_'+ctx.params.size,
        };
        var bbb = async function bb() {
            ctx.set("Access-Control-Allow-Origin", "*");
            ctx.set('content-type', 'image/jpg');
                await axios(config).then(function (response) {
                    ctx.body = response.data
            }).catch(function (error) {
                    reject(error)
                })
        }

        return bbb();
    }).get('/recaptcha/api/reload',async function (ctx) {
        let captchaInfo = {
            c: ctx.query.c,
            k: ctx.query.k,
            reason: ctx.query.reason,
            type: ctx.query.type,
            lang: ctx.query.lang,
            th: ctx.query.th,
        };
        let config = {
            url: 'https://www.google.com/recaptcha/api/reload',
            params: captchaInfo,
        };
        var bbb = async function bb() {
            ctx.set("Access-Control-Allow-Origin", "*");
                await axios(config).then(function (response) {
                    ctx.body = response.data
            }).catch(function (error) {
                    reject(error)
                })
        }

        return bbb();
    }).get('/recaptcha/api/challenge',async function (ctx) {
        let config = {
            url: 'https://www.google.com/recaptcha/api/challenge',
            params: ctx.query,
        };
            ctx.set("Access-Control-Allow-Origin", "*");
            await axios(config).then(function (response) {
                ctx.body = response.data
            }).catch(function (error) {
                ctx.body = error
            })
    }).get('/recaptcha/api/image',async function (ctx) {
        let config = {
            url: 'https://www.google.com/recaptcha/api/image',
            params: ctx.query,
            responseType:'stream'
        };
            ctx.set("Access-Control-Allow-Origin", "*");
            ctx.set('content-type', 'image/jpg');
            await axios(config).then(function (response) {
                ctx.body = response.data;
            }).catch(function (error) {
                ctx.body = error
            })
    }).post('/api/1/chats/:formid/mark-as-read',async function (ctx) {
        let formid = ctx.params.formid;

        let config = {
            method: 'POST',
            url: 'https://www.skout.com/api/1/chats/'+formid+'/mark-as-read',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                'session_id': ctx.header.session_id,
                // 'Origin': 'http://www.skout.com',
                // 'Referer': 'http://www.skout.com/chat/'+fromId
            }
        };
        ctx.set("content-type", "application/json; charset=utf-8");
        await axios(config).then(function () {
            ctx.status = 200;
                    ctx.body = ''
                }).catch(function (err) {
                    ctx.status = 401;
                    ctx.body = err.response.data
        });
    })
}
