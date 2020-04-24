declare const my;
declare const $global; // 在淘宝小程序下使用$global替代global

// 淘宝API: https://miniapp.open.taobao.com/docV3.htm?docId=989&docType=20

class TBPlatform implements Platform {
    async getUserInfo() {
        console.log('[tb] get user info success!')
        return new Promise((resolve, reject) => {
            my.getAuthUserInfo({
                success: (userInfo) => {
                    resolve(userInfo);
                },
                fail: () => {
                    reject();
                }
            });
        });
    }

    async login() {
        console.log('[tb] login success!')
        return new Promise((resolve, reject)=> {
            my.authorize({
                scopes: 'scope.userInfo',
                success: (res) => {
                    resolve(res);
                },
                fail: () => {
                    reject();
                }
            });
        });
    }
}

if (!$global.window.platform) {
    $global.window.platform = new TBPlatform();
}