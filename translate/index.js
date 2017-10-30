var Router = require('koa-router');
const translate = require('google-translate-api');
const languages = require('./languages');
module.exports = function () {
    return new Router().post('/translate',async function (ctx) {
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
    })
}