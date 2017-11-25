import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export class AppPaymentHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentruns: []
    }
  }

  componentDidMount() {
    var that = this;
    var url = 'https://server.arkcoin.net/delegate/paymentruns';
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(info) {
        that.setState({
          paymentruns: info
        });
      });
  }

  render() {
    if (typeof(this.state.paymentruns.count) === "undefined") {
      return (
        <div>
          <p> Payment history of <b>jarunik</b>
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const paymentRow= this.state.paymentruns.data.map((run) =>
      <tr key={ run.Pk }>
        <td> <Link to={'/paymentrun/'+run.Pk}> { run.Pk} </Link>
        </td>
        <td> { run.CreatedAt.substring(0,10) }
        </td>
        <td> { run.NrOfTransactions }
        </td>
        <td> { Number (Math.round(run.VoteWeight / 100000000)).toLocaleString('en') }
        </td>
      </tr>
    );

    return (
      <div>
        <p>
          Payment history of <b>jarunik</b>
        </p>
        <p>
          <Link to='/rewards'>Accumulated Rewards</Link> &nbsp;   
        </p>
        <table>
          <thead>
            <tr>
              <th> Run
              </th>
              <th> Date
              </th>
              <th> Transactions
              </th>
              <th> Votes
              </th>
            </tr>
          </thead>
          <tbody>{ paymentRow }</tbody>
        </table>
      </div>
    );
  }
}
