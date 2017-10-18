import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export class AppRewards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rewards: []
    }
  }

  componentDidMount() {
    var that = this;
    var url = 'https://server.arkcoin.net/voters/rewards';
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({
          rewards: data
        });
      });
  }

  render() {
    if (typeof(this.state.rewards.count) === "undefined") {
      return (
        <div>
          <p> Calculating Rewards now!
          </p>
          <p> This will take a while.
          </p>
          <p> Thank you for your patience.
          </p>
        </div>
      );
    }

    const rewardsFiltered = this.state.rewards.data.filter(reward => Number((reward.VoteWeight).toFixed(1)) !== 0);

    const rewardRow = rewardsFiltered.map((reward) =>
      <tr key={ reward.Address }>
        <td> <Link to={'/paymentvoter/'+reward.Address}> { reward.Address } </Link>
        </td>
        <td> { Number((reward.VoteWeight).toFixed(1)) }
        </td>
        <td> { Number (reward.EarnedAmountXX).toLocaleString('en') }
        </td>
      </tr>
    );

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th> Address
              </th>
              <th> Votes
              </th>
              <th> Unpaid
              </th>
            </tr>
          </thead>
          <tbody>{ rewardRow }</tbody>
        </table>
      </div>
    );
  }
}
