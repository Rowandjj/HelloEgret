class MockPlatform implements Platform {
    async getUserInfo() {
        console.log('[mock] get user info success!')
        return { nickName: "username" }
    }
    async login() {
        console.log('[mock] login success!')
    }
}


if (!window.platform) {
    window.platform = new MockPlatform();
}