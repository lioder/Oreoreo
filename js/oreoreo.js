const imageMap = new Map();
imageMap.set('奥', 'image/O.png');
imageMap.set('利', 'image/R.png');
imageMap.set('奥底', 'image/Ob.png');

const app = new Vue({
    el: '#app',
    data: {
        layerArr: [],
        resultPage: false,
        loading: true
    },
    computed: {
        inputStr: function () {
            return this.layerArr.join('');
        }
    },
    created: function () {
        this.loading = true;
        this.loadImages(imageMap, () => {
            this.loading = false;
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
        popLayer(){
          this.layerArr.pop();
        },
        generate () {
            console.log('制作中...')
            this.loaing = true;
            let canvas = this.$refs.oreoCanvas;
            let ctx = canvas.getContext("2d");
            // modify canvas height
            canvas.height = this.layerArr.length * 28 + 210;

            // Draw from the bottom layer
            for (let i = this.layerArr.length - 1; i >= 0; i--) {
                let layer = this.layerArr[i];
                let image = imageMap.get(layer);
                if (layer === '奥') {
                    ctx.drawImage(image, 0, 28*i, 300, 210);
                } else if (layer === '利'){
                    ctx.drawImage(image, 10, 28*i, 280, 200);
                }
            }
            this.resultPage = true;
            this.loaing = false;
        },
        back() {
            this.loading = true;
            this.resultPage = false;
            this.loading = false;
        },
        saveImage(){
            let canvas = this.$refs.oreoCanvas;
            let imageUrl = canvas.toDataURL('image/png');
            let a = document.createElement('a');
            a.href = imageUrl;
            a.download = '我的奥利奥.png';
            a.click();
        }
    }
})
console.log(app)
