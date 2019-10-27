import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, HashRouter, Route, Link } from 'react-router-dom'
import getWeb3 from './utils/getWeb3';
import Exchange from './components/Exchange/Exchange';
import Charities from './components/Charities/Charities';

import { setWeb3Data } from './actions/web3Actions';

import './css/bootstrap.min.css';
import './css/style.css';

import './App.scss';

import { getTotalDonationAmount, getUserDonationAmount, getCurrDonationAmount } from './services/daoService.js';

import { CharityDao, CharitySwap } from './utils/config.json';

class App extends Component {
  constructor(man) {
    super(man);

    this.state = {
      account: null,
      web3: null,
      charitySwap: null,
      charityDao: null,
      charityTheme: {},
      totalDonation: 0,
      userDonation: 0,
      monthlyDonation: 0,
    };
  }

  componentDidMount = async () => {
    const charities = [
      { description: 'Help fight climate change with every crypto swap. ', color: '#41bb78' },
      { description: 'Help education in Ukraine with every crypto swap. ', color: '#36A4E1' },
      { description: 'Help deliver vaccines to Congo with every crypto swap. ', color: '#DC6700' },
      { description: 'Help deliver clean water to Madagascar with every crypto swap. ', color: '#B43442' },
    ];
    this.setState({
      charityTheme: charities[Math.floor(Math.random() * charities.length)]
    });
    try {
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();

      const charitySwap = new web3.eth.Contract(CharitySwap.abi, CharitySwap.networks[networkId].address);
      const charityDao = new web3.eth.Contract(CharityDao.abi, CharityDao.networks[networkId].address);

      this.props.setWeb3Data(web3, accounts[0], networkId, charityDao, charitySwap);

      const totalDonation = await getTotalDonationAmount(charityDao);

      const userDonation = await getUserDonationAmount(charityDao, accounts[0]);

      const monthlyDonation = await getCurrDonationAmount(web3, networkId, CharityDao.networks[networkId].address, charitySwap);

      this.setState({
        web3,
        account: accounts[0],
        networkId,
        charityDao,
        charitySwap,
        totalDonation,
        userDonation,
        monthlyDonation
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

  render() {
    const { charityTheme, totalDonation, userDonation, monthlyDonation } = this.state;

    console.log(monthlyDonation);

    return (
      <HashRouter>
        <div className="content-body">
          <div className="container">

            <div className="row heading">
              <div className="col-lg-12">
                <Link to="/"><h1>Charity Swap</h1></Link>
                <h3>{charityTheme.description}</h3>
              </div>
            </div>

            <style>
              {`
                :root {
                  --primary: ${charityTheme.color};
                }
              `}
            </style>

              <div className="row">
                <div className="col-lg-9">
                  <div className="card">
                    <div className="card-body">

                      <Switch>
                        <Route exact path="/" component={Exchange} />
                        <Route exact path="/charities" component={Charities} />
                      </Switch>

                    </div>
                  </div>
                </div>

                <div className="col-lg-3 sidebar-wrapper">
                  <div className="row">
                    <div className="card gradient-1">
                      <div className="card-body">
                        <h3 className="card-title text-white">Total donated </h3>
                        <div className="d-inline-block">
                          <h2 className="text-white">{totalDonation}$</h2>
                          <Link to="/charities">Browse charities</Link>
                        </div>
                        <span className="float-right display-5 opacity-5"><i className="fa fa-money" /></span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="card gradient-4">
                      <div className="card-body">
                        <h3 className="card-title text-white">This month:</h3>
                        <div className="d-inline-block">
                          <h2 className="text-white">{monthlyDonation}$</h2>
                        </div>
                        <span className="float-right display-5 opacity-5"><i className="fa fa-users" /></span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="card gradient-2">
                      <div className="card-body">
                        <h3 className="card-title text-white">Your donations:</h3>
                        <div className="d-inline-block">
                          <h2 className="text-white">{userDonation.toFixed(6)}$</h2>
                        </div>
                        <span className="float-right display-5 opacity-5"><i className="fa fa-heart" /></span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>


          </div>
        </div>
      </HashRouter>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setWeb3Data,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
