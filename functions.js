function changeTickerPrice(_this = null, callback = false) {
    const response =  fetch("http://localhost:3001/api?ticker="+_this.ticker)
        .then(response => response.json())
        .then(response => {
            if (response && response.regularMarketPrice) {
                if (!callback) {
                    _this.price = response.regularMarketPrice;
                    _this.stock = response.shortName;
                } else {
                    return callback(response.regularMarketPrice, response.shortName);
                }
            }
        });
}

const resultBadgeColor = function(item) {
    let color = null;
    if (item.price > item.exitPrice) color = 'bg-danger'
    else if (item.price < item.exitPrice) color = 'bg-success'
    else color = 'bg-warning'
    return color;
}

const closeTicker = function(prop) {
    // revalidate stock price 
    let _this = this;
    changeTickerPrice(prop, function(price) {
        if (prop && prop.ticker && _this.portfolio.length) {
            let obj = _this.portfolio.find(o => o.ticker === prop.ticker);
            if (obj) {
                const tmpPortfolio = [..._this.portfolio];
                let index = tmpPortfolio.indexOf(obj);
                // obj.price = price;
                obj.exitPrice = price;
                obj.closed = true;
                obj.color  = _this.resultBadgeColor(tmpPortfolio[index]);
                tmpPortfolio[index] = obj;
                _this.portfolio = tmpPortfolio;
                localStorage.setItem("portfolio", JSON.stringify(_this.portfolio));
                let closedDeals = localStorage.getItem('closedDeals');
                
                if (closedDeals && closedDeals.length) {
                    let tmpClosedDeals = JSON.parse(closedDeals);
                    tmpClosedDeals.push(tmpPortfolio[index])
                    // _this.closedDeals = tmpClosedDeals;
                    localStorage.setItem('closedDeals', JSON.stringify(tmpClosedDeals));
                } else {
                    localStorage.setItem('closedDeals', JSON.stringify([tmpPortfolio[index]]));
                    // _this.closedDeals = [tmpPortfolio[index]];
                }
            }
        }
    })
}

const removeTicker = function (prop) {
    if (confirm("Are you sure!") && prop && prop.ticker && this.portfolio.length) {
        let obj = this.portfolio.find(o => o.ticker === prop.ticker);
        if (obj) {
            let index = this.portfolio.indexOf(obj);
            const tmpPortfolio = [...this.portfolio];
            tmpPortfolio.splice(index, 1);
            this.portfolio = tmpPortfolio;
            localStorage.setItem("portfolio", JSON.stringify(tmpPortfolio));
            if (timers && timers.length && timers[prop.ticker]) {
                console.log("CLEAR TIMER")
                clearInterval(timers[prop.ticker]);
            }
        }
    }
}

const findTickerData = function() {
    changeTickerPrice(this)
}


const addTicker = function (e) {
    e.preventDefault();
    let _this = this;
    // ======================
    const row = {
        ticker: _this.ticker,
        stock: _this.stock,
        price: _this.price,
        exitPrice: _this.exitPrice,
        currentPrice: _this.currentPrice,
        closed: _this.closed,
        qty: _this.qty,
        url: _this.url,
        color: _this.color,
        timeAdded: Date.now()
    };
    const form = document.getElementById("form");
    const errors = validate(form, constraints);
    const elements = document.querySelectorAll('#ticker, #price, #qty');
    /** Clear all validate fields */
    elements.forEach((element) => {
        element.classList.remove('is-invalid');
        let invalidFeedback = element.nextSibling;
        invalidFeedback.innerHTML = "";
    });
    /** execute validation */
    if (!errors) {
        // revalidate stock price 
        changeTickerPrice(_this, function(price){
            row.price = price;
            row.currentPrice = price;
            _this.portfolio.push(row); 
            let index = _this.portfolio.indexOf(row);
            let newTimer = setInterval(() => {
                changeTickerPrice(row, price => {
                    _this.portfolio[index].currentPrice = price;
                });
            }, 5000);
            timers[_this.ticker] = newTimer; // for clearing if necessary
            let timerObj = {};
            timerObj[_this.ticker] = newTimer;
            timers.push(timerObj);
            _this.ticker = _this.stock = _this.price = _this.qty = _this.url = "";
            localStorage.setItem("portfolio", JSON.stringify(_this.portfolio));
        }); 
    } else {
        Object.keys(errors).forEach(function(key){
            const filed = document.getElementById(key);
            if (filed && errors[key].length) {
                filed.classList.add("is-invalid");
                let invalidFeedback = filed.nextSibling;
                if (invalidFeedback) {
                    invalidFeedback.innerHTML = errors[key][0];
                }
            }
        })
    }
}