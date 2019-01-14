const app = new Vue({
    el: '#app',
    data: {
        inputStr: '',
        layerArr: []
    },
    methods: {
        addO: function () {
            this.layerArr.push('O');
        },
        addRe: function () {
            this.layerArr.push('Re');
        }
    }
})
