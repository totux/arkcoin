import React, { Component } from 'react';
import { Link } from 'react-router-dom'

const satoshi = 1/100000000;

export class AppVoters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delegate: []
    }
  }

  componentDidMount() {
    var that = this;
    var url = 'https://scan.arkcoin.net/api/getAccount?address=Aasu14aTs9ipZdy1FMv7ay1Vqn3jPskA8t';
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({
          delegate: data
        });
      });
  }

  render() {
    if (typeof(this.state.delegate.address) === "undefined") {
      return (
        <div>
          <p> Voters
          </p>
          <p> loading
          </p>
          <p>
          <Link to='/votespy'>Vote Spy</Link>
          </p>          
        </div>
      );
    }

    const voterRow = [].concat(this.state.delegate.voters)
        .filter((voter) => voter.balance > 0)
        .sort((a, b) => b.balance - a.balance)
        .map((voter) =>
            <tr key={voter.address}>
                <td> <Link to={'/paymentvoter/' + voter.address}> {voter.address} </Link>
                </td>
                <td> { Number (voter.balance * satoshi ).toLocaleString('en') }
                </td>
            </tr>
        );

    return (
      <div>
        <p>
          Vote History
        </p>
        <p>
          <Link to='/votespy'>Vote Spy</Link>
        </p>
        <table>
          <thead>
            <tr>
              <th> Voter
              </th>
              <th> Balance
              </th>
            </tr>
          </thead>
          <tbody>{ voterRow }</tbody>
        </table>
      </div>
    );
  }
}
