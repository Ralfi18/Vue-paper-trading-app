const { createApp } = Vue;
const timers = [];

const defaultSore = {
    title: 'Paper trading app',
    ticker: '',
    stock: '',
    price: '',
    exitPrice: 0,
    currentPrice: 0,
    closed: false,
    color: null,
    qty: '',
    url: '',
    portfolio: [],
    closedDeals: []
};

validate.validators.custom = function(value, options, key, attributes) {
    const portfolio = localStorage.getItem("portfolio");
    let invalid = null
    if (portfolio && portfolio.length && value) {
        invalid = JSON.parse(portfolio).some((element) => element.ticker == value.trim()) ? value.trim() + " is already in the list!":null;
    }
    return invalid;
};

const constraints = {
    ticker: {
        presence: true,
        length: {
            minimum: 1,
            maximum: 10
        },
        custom: true
    },
    qty: {
        presence: true,
        numericality: true
    },
    price: {
        presence: true,
        numericality: true
    }
};

