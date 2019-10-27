import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Charities.scss';
import { getCharities } from '../../actions/daoActions';

class Charities extends Component {
  constructor(man) {
    super(man);

    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.getCharities();
    }, 1000);
  }

  render() {
    return (
      <div className="charities-page">
        <p>
          Each 30 days the Charity Swap DAO decides which organisation gets the month's donation pool.
          You can use the power you earn by swapping tokens to influence which charity gets the pool.
        </p>

        <p>
          Your voting power: <b>245</b>
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
                    <button type="button" className="btn btn-primary">Vote</button>
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
});

const mapDispatchToProps = {
  getCharities,
};

export default connect(mapStateToProps, mapDispatchToProps)(Charities);
