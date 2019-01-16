const imageMap = new Map();
imageMap.set('奥', 'image/O.png');
imageMap.set('利', 'image/R.png');
imageMap.set('奥底', 'image/Ob.png');

const app = new Vue({
    el: '#app',
    data: {
        layerArr: [],
        resultPage: false,
        loading: true,
        showTip: false,
        tipMessage: ''
    },
    computed: {
        inputStr: function () {
            return this.layerArr.join('');
        }
    },
    created: function () {
        this.loading = true;
        this.loadImages(imageMap, () => {
            setTimeout(() => {
                this.loading = false;
            }, 1000)
        })
    },
    methods: {
        loadImages (imageMap, callback) {
            let count = 0;
            for (let [imageKey, source] of imageMap.entries()) {
                let image = new Image();
                image.onload = function () {
                    count++;
                    imageMap.set(imageKey, image);
                    if (count === imageMap.size) {
                        callback();
                    }
                }
                image.src = source;
            }
        },
        addLayer (layer) {
            this.layerArr.push(layer);
        },
        popLayer () {
            this.layerArr.pop();
        },
        clearLayer () {
            this.layerArr = [];
        },
        generate () {
            if (this.layerArr.length <= 0) {
                this._showTip("配方是空哒，试试点下加奥，可以增加一层巧克力，点下加利，可以增加一层奶油哦!");
                return;
            }
            console.log('制作中...')
            this.loading = true;
            let canvas = this.$refs.oreoCanvas;
            let ctx = canvas.getContext("2d");
            // modify canvas height
            canvas.height = this.layerArr.length * 28 + 210;

            // Draw from the bottom layer
            for (let i = this.layerArr.length - 1; i >= 0; i--) {
                let layer = this.layerArr[i];
                let image = imageMap.get(layer);
                if (layer === '奥') {
                    ctx.drawImage(image, 0, 28 * i, 300, 210);
                } else if (layer === '利') {
                    ctx.drawImage(image, 10, 28 * i, 280, 200);
                }
            }

            let imageUrl = canvas.toDataURL('image/png');
            let oreoImage = this.$refs.oreoImage;
            oreoImage.src = imageUrl;
            oreoImage.onload = () => {
                setTimeout(() => {
                    this.resultPage = true;
                    this.loading = false;
                }, 1000)

            }
        },
        closeTip () {
            this.showTip = false;
        },
        back () {
            this.loading = true;
            this.resultPage = false;
            this.loading = false;
        },
        saveImage () {
            if (this._isIOS()) {
                this._showTip("请长按图片保存")
                return;
            }
            let oreoImage = this.$refs.oreoImage;
            let imageUrl = oreoImage.src;
            let a = document.createElement('a');
            a.href = imageUrl;
            a.download = '我的奥利奥.png';
            a.click();
        },
        playAudio () {
            let playlist = [];
            for (let layer of this.layerArr) {
                if (layer === '奥') playlist.push(new Audio('./O.mov'));
                else if (layer === '利') playlist.push(new Audio('./Re.mov'));
            }
            new CCAudioBuffer(playlist);
        },
        _showTip (msg, callback) {
            this.tipMessage = msg;
            this.showTip = true;
        },
        _isIOS: function () {
            let userAgent = navigator.userAgent;
            return !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        }
    }
})
console.log(app)
