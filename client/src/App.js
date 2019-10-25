import React, { Component } from 'react';
import Dec from 'decimal.js';
import getWeb3 from './utils/getWeb3';

import './css/bootstrap.min.css';
import './css/style.css';

import './App.scss';

import { getDaoStatus } from './services/daoService.js';

import { CharityDao, CharitySwap } from './utils/config.json';

class App extends Component {

  constructor(man) {
    super(man);

    this.state = {
      account: null,
      web3: null,
      charitySwap: null,
      charityDao: null,
      from: 'ETH',
      to: 'DAI',
      amount: '',
      price: '0',
    };

    this.estimatePrice = this.estimatePrice.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();

      const charitySwap = new web3.eth.Contract(CharitySwap.abi, CharitySwap.networks[networkId].address);
      const charityDao = new web3.eth.Contract(CharityDao.abi, CharityDao.networks[networkId].address);

      const res = await getDaoStatus(charityDao);

      console.log(res);

      this.setState({
        web3,
        account: accounts[0],
        networkId,
        charityDao,
        charitySwap
      }, this.fetchEvents);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  fetchEvents = async () => {

  };

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
      <div className="content-body exchange-page">
        <div className="container">

          <div className="row heading">
            <h1>Charity Swap</h1>
            <h3>Help fight climate change with every crypto swap. </h3>
          </div>

          <div className="row">

            <div className="col-lg-9">
              <div className="card">
                <div className="card-body">

                  <div className="row">
                    <div className='col-lg-5'>
                      <select className="form-control form-control-lg" onChange={this.handleChange} name="from" value={from}>
                        <option>ETH</option>
                        <option>DAI</option>
                        <option>MKR</option>
                      </select>
                    </div>

                    <div className='col-lg-2 text-center'>
                      <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
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
                      <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
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
              </div>
            </div>

            <div className="col-lg-3">

              <div className="row">
                <div className="card gradient-1">
                  <div className="card-body">
                    <h3 className="card-title text-white">Total donations</h3>
                    <div className="d-inline-block">
                      <h2 className="text-white">3,245.34$</h2>
                    </div>
                    <span className="float-right display-5 opacity-5"><i
                      className="fa fa-money"></i></span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="card gradient-4">
                  <div className="card-body">
                    <h3 className="card-title text-white">This month:</h3>
                    <div className="d-inline-block">
                      <h2 className="text-white">28.345$</h2>
                    </div>
                    <span className="float-right display-5 opacity-5"><i
                      className="fa fa-heart"></i></span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="card gradient-4">
                  <div className="card-body">
                    <h3 className="card-title text-white">Your donations:</h3>
                    <div className="d-inline-block">
                      <h2 className="text-white">0.03$</h2>
                    </div>
                    <span className="float-right display-5 opacity-5"><i
                      className="fa fa-users"></i></span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }
}

export default App;
