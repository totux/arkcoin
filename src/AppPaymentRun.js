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
          <p> History
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
        <td> { Number (payment.VoteWeight).toLocaleString('en') }
        </td>
        <td> { Number (payment.EarnedAmountXX).toLocaleString('en')}
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
