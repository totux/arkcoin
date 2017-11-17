import React, { Component } from 'react';

export class AppPaymentVoter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payments: []
    }
  }

  componentDidMount() {
    var that = this;
    var paymentVoter = that.props.match.params.id;
    var url = 'https://server.arkcoin.net/delegate/paymentruns/details?address='+paymentVoter;
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(info) {
        that.setState({
          payments: info
        });
      });
  }

  render() {
    if (typeof(this.state.payments.count) === "undefined") {
      return (
        <div>
          <p> Sharing
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const paymentRow = this.state.payments.data.map((payment) =>
      <tr key={ payment.Pk }>
        <td> { payment.CreatedAt.substring(0,10) }
        </td>
        <td> { Number (payment.VoteWeight).toLocaleString('en') }
        </td>
        <td> { Number (payment.EarnedAmountXX).toLocaleString('en') }
        </td>
        <td> <a href={"https://scan.arkcoin.net/tx/"+payment.Transaction.id}> {payment.Transaction.id.substring(0,6)+"..."} </a>
        </td>
      </tr>
    );

    return (
      <div>
        <p>
          Sharing history of voter:
        </p>
        <p>
        <a href={"https://scan.arkcoin.net/address/"+this.props.match.params.id}> {this.props.match.params.id}</a>
        </p>
        <table>
          <thead>
            <tr>
              <th> Date
              </th>
              <th> Votes
              </th>
              <th> Paid
              </th>
              <th> Tx
              </th>
            </tr>
          </thead>
          <tbody>{ paymentRow }</tbody>
        </table>
      </div>
    );
  }
}
