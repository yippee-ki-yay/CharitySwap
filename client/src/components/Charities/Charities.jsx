import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Charities.scss';
import { getCharities, getVotingPowerForUser, callVote } from '../../actions/daoActions';

class Charities extends Component {
  constructor(man) {
    super(man);

    this.state = {};

    this.vote = this.vote.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.getCharities();
      this.props.getVotingPowerForUser();
    }, 1000);
  }

  async vote(pos) {
    console.log('Vote!');

    this.props.callVote(pos);
  }

  render() {

    console.log(this.props.userVotingPower);
    return (
      <div className="charities-page">
        <p>
          Each 30 days the Charity Swap DAO decides which organisation gets the month's donation pool.
          You can use the power you earn by swapping tokens to influence which charity gets the pool.
        </p>

        <p>
          Your voting power: <b>{this.props.userVotingPower}</b>
        </p>

        <div className="charity-list">
          {
            this.props.charities.map((charity) => (
              <div className="charity-item" key={charity.arrPos}>
                <h2>{charity.name}</h2>
                <div className="row">
                  <div className="col-lg-10">
                    <h3>{charity.desc}</h3>
                    {/* <h4>Current month score: {charity.score}</h4> */}
                  </div>
                  <div className="col-lg-2">
                    <button type="button" className="btn btn-primary" onClick={() => this.vote(charity.arrPos)}>Vote</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

Charities.propTypes = {};

const mapStateToProps = (state) => ({
  charities: state.dao.charities,
  userVotingPower: state.dao.userVotingPower,
});

const mapDispatchToProps = {
  getCharities,
  getVotingPowerForUser,
  callVote,
};

export default connect(mapStateToProps, mapDispatchToProps)(Charities);
