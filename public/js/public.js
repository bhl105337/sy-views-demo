var config={
    // ip:"http://127.0.0.1:8878",
    ip:"http://182.61.26.179:8878",
    img:"http://oneyouxiimg.oneyouxi.com.cn",
    base64:"http://base64.oneyouxi.com.cn"
};
function uploadQiniu(options) {
    /*
    option:{
         file:octet-stream
         key:string
         token:string
         next:fn
         error:fn
         success:fn
    }
     */
    var file=options.file || null,
        key=options.key || null,
        token=options.token || null,
        next=options.next || null,
        error=options.error || null,
        success=options.success || null,
        putExtra = {
            fname: "",
            params: {},
            mimeType:null
        },
        config = {
            useCdnDomain: true,
            region:'z2',
            disableStatisticsReport: false
        },
        subObject = {
            next: next,
            error: error,
            complete: success
        },
        observable = qiniu.upload(file, key, token, putExtra, config);
    subscription = observable.subscribe(subObject) // 上传开始
}