import React, { Component } from 'react';
import { Link } from 'react-router-dom'

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
                <td> { Number (voter.balance / 100000000 ).toLocaleString('en') }
                </td>
            </tr>
        );

    return (
      <div>
        <p>
          Ark: {Number (Math.round(this.state.delegate.delegate.vote / 100000000) ).toLocaleString('en') } <br/>
          Voters: {this.state.delegate.voters.length} <br/>
          Average: {Number (Math.round(this.state.delegate.delegate.vote / 100000000 / this.state.delegate.voters.length) ).toLocaleString('en') }
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
