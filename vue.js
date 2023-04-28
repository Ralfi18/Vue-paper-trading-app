// createApp is defined in config.js
createApp({
    data() {
        // located in config.js
        return defaultSore;
    },
    methods: {
        // located in functions.js
        resultBadgeColor,
        closeTicker,
        removeTicker,
        findTickerData,
        addTicker
    },
    mounted() {
        const portfolio = localStorage.getItem("portfolio");
        if (portfolio && portfolio.length) {
            this.portfolio = JSON.parse(portfolio);
            let _this = this;
            this.portfolio.forEach((item, key) => {
                if (item && !item.closed && _this.portfolio[key]) {
                    let newTimer = setInterval(() => {
                        changeTickerPrice(item, (price) => {
                            _this.portfolio[key].currentPrice = price;
                        })
                    }, 5000);
                    // timers[item.ticker] = newTimer; // for clearing if necessary
                    let timerObj = {};
                    timerObj[item.ticker] = newTimer;
                    timers.push(timerObj);
                }
            })
        }
    }
}).mount('#app')