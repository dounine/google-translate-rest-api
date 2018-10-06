var Router = require('koa-router');
const translate = require('google-translate-api');
const translatTokenModule = require('google-translate-token');
const languages = require('./languages');
const axios = require('axios');
module.exports = function () {
    return new Router()
        .post('/translate',async function (ctx) {
        ctx.set("Access-Control-Allow-Origin", "*");
	var translateToken = ctx.request.body.token;
        if(translateToken===undefined){
		if(translateToken!=='xxx-xxx'){
            ctx.body = {
                error:1,
                msg:'token error.'
            }
            return;}
        }
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
	    var tokenValue = await new Promise(function (resolve,reject) {
                translatTokenModule.get(value).then(function (res) {
                    resolve(res.value);
               }).catch(function (error) {
                    reject(error);
               });
            });
            ctx.body = new Array({
                value:value,
	        tk:tokenValue,
		googleTsUrl:'https://translate.google.com/translate_tts?ie=UTF-8&q='+encodeURI(value)+'&tl=en&total=1&idx=0&textlen=11&tk='+tokenValue+'&client=t&prev=in1'
            });
        }

        return aa();
    }).post('/tk',async function (ctx) {
        ctx.set("Access-Control-Allow-Origin", "*");
	var translateToken = ctx.request.body.token;
        if(translateToken===undefined){
		if(translateToken!=='xxx-xxx'){
            ctx.body = {
                error:1,
                msg:'token error.'
            }
            return;}
        }
        var resourceLanguage = ctx.request.body.text;
        if(resourceLanguage===undefined){
            ctx.body = {
                error:1,
                msg:'text not empty.'
            }
            return;
        }
        var aa = async function bb() {
	    var tokenValue = await new Promise(function (resolve,reject) {
                translatTokenModule.get(resourceLanguage).then(function (res) {
                    resolve(res.value);
               }).catch(function (error) {
                    reject(error);
               });
            });
            ctx.body = new Array({
	        tk:tokenValue,
		googleTsUrl:'https://translate.google.com/translate_tts?ie=UTF-8&q='+encodeURI(resourceLanguage)+'&tl=en&total=1&idx=0&textlen=11&tk='+tokenValue+'&client=t&prev=in1'
            });
        }

        return aa();
    }).get('/skout-image',async function (ctx) {
        let config = {
            url: 'http://images-public.skout.com'+ctx.query.id+ctx.query.size,
            responseType:'stream'
        };
        var bbb = async function bb() {
            ctx.set("Access-Control-Allow-Origin", "*");
            ctx.set('content-type', 'image/jpeg');
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
    })
}
