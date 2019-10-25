import React, { Component } from 'react';
import Dec from 'decimal.js';
import './Exchange.scss';

class Exchange extends Component {
  constructor(man) {
    super(man);

    this.state = {
      from: 'ETH',
      to: 'DAI',
      amount: '',
      price: '0',
      charityTheme: {},
    };

    this.estimatePrice = this.estimatePrice.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      price: '0',
    }, this.estimatePrice) // debounce this
  }

  async estimatePrice() {
    await new Promise(r => setTimeout(r, 1000));
    this.setState({
      price: Math.random() * 100
    })
  }

  render() {
    const { from, to, price, amount } = this.state;

    return (
      <div className="exchange-page">
        <div className="row">
          <div className='col-lg-5'>
            <select className="form-control form-control-lg" onChange={this.handleChange} name="from" value={from}>
              <option>ETH</option>
              <option>DAI</option>
              <option>MKR</option>
            </select>
          </div>

          <div className='col-lg-2 text-center'>
            <span className="glyphicon glyphicon-arrow-right" aria-hidden="true" />
          </div>

          <div className='col-lg-5'>
            <select className="form-control form-control-lg" onChange={this.handleChange} name="to" value={to}>
              <option>DAI</option>
              <option>MKR</option>
              <option>ETH</option>
            </select>
          </div>
        </div>

        <br />

        <div className="row">
          <div className='col-lg-5'>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="amount"
                onChange={this.handleChange}
                placeholder={`${from} amount`}
                value={amount}
              />
            </div>
          </div>


          <div className='col-lg-2 text-center'>
            <span className="glyphicon glyphicon-arrow-right" aria-hidden="true" />
          </div>

          <div className='col-lg-5'>
            <div className="price-estimate">
              {Dec(parseFloat(amount) || 0).times(price || 0).toDecimalPlaces(2).toString()} {to}
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-lg-6 col-lg-offset-3">
            <button type="button" className="btn btn-primary btn-lg btn-block">Swap</button>
          </div>
        </div>
      </div>
    );
  }
}

Exchange.propTypes = {};

export default Exchange;
