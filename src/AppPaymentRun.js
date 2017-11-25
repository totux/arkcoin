import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export class AppPaymentRun extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payments: []
    }
  }

  componentDidMount() {
    var that = this;
    var paymentRunId = that.props.match.params.id;
    var url = 'https://server.arkcoin.net/delegate/paymentruns/details?parentid='+paymentRunId;
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
          <p> Sharing run
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const paymentRow = this.state.payments.data.map((payment) =>
      <tr key={ payment.Address }>
        <td> <Link to={'/paymentvoter/'+payment.Address}> { payment.Address } </Link>
        </td>
        <td> { Number (Math.round(payment.VoteWeight)).toLocaleString('en') }
        </td>
        <td> { Number (payment.EarnedAmountXX).toFixed(2).toLocaleString('en')}
        </td>
      </tr>
    );

    return (
      <div>
        <p>
          Sharing run of <b>jarunik</b>
        </p>
        <p>
          Run: {this.state.payments.data[0].PaymentRecordID}<br/>
          Date: { this.state.payments.data[0].CreatedAt.substring(0,10) }
        </p>
        <table>
          <thead>
            <tr>
              <th> Voter
              </th>
              <th> Votes
              </th>
              <th> Paid
              </th>
            </tr>
          </thead>
          <tbody>{ paymentRow }</tbody>
        </table>
      </div>
    );
  }
}
