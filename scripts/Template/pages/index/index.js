// TODO require game manifest js files
require('../../manifest')
Page({
  data: {},
  onLoad() {
    console.log('onLoad');
  },
  onReady() {
    console.log('onReady');
  },
  onComponentReady() {
    const {window} = $global;
    const {egret} = window;

    egret.runEgret({
      //以下为自动修改，请勿修改
      // The following is automatically modified, please do not modify
      //----auto option start----
      entryClassName: 'Main',
      orientation: 'auto',
      frameRate: 30,
      scaleMode: 'showAll',
      contentWidth: 480,
      contentHeight: 800,
      showFPS: false,
      fpsStyles: 'x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9',
      showLog: false,
      maxTouches: 2,
      //----auto option end----
      renderMode: 'canvas',
      audioType: 0,
      calculateCanvasScaleFactor: function(context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio || context.backingStorePixelRatio ||
            1;
        return window.devicePixelRatio / backingStore;
      }
    });
  }
});
