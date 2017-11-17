import React, { Component } from 'react';

export class AppExchange extends Component {
  render() {
    return (
      <div className="AppExchange">
        <AppBittrex />
        <AppBinance />
      </div>
    );
  }
}

export class AppBittrex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payments: [],
      balance: []
    }
  }

  componentDidMount() {
    var that = this;
    var url = 'https://scan.arkcoin.net/api/getTransactionsByAddress?address=AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK&limit=50&offset=0';
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({
          payments: data
        });
      });

      var url2 = 'https://scan.arkcoin.net/api/getAccount?address=AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK';
      fetch(url2)
        .then(function(response2) {
          if (response2.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response2.json();
        })
        .then(function(data2) {
          that.setState({
            balance: data2
          });
        });
    }

  render() {
    const bittrex = "AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK";

    if (typeof(this.state.payments.success) === "undefined") {
      return (
        <div>
          <p> Bittrex history
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const paymentRow = this.state.payments.transactions.map((payment) =>
      <tr key={ payment.id }>
        <td> { payment.senderId === bittrex ?
            <a href={"https://scan.arkcoin.net/address/"+payment.recipientId}> {payment.recipientId}</a>
            :
            <a href={"https://scan.arkcoin.net/address/"+payment.senderId}> {payment.senderId}</a>
            }
        </td>
        <td> 
        {payment.amount / 100000000 > 1000 ?
            <b>
                {payment.senderId === bittrex ?
                    <font color='green'> {Number(-Math.round(payment.amount / 100000000)).toLocaleString('en')} </font>
                    :
                    <font color='red'> {Number(Math.round(payment.amount / 100000000)).toLocaleString('en')} </font>
                }
            </b>  
            :
            <div>
                {payment.senderId === bittrex ?
                    <font color='green'> {Number (-Math.round(payment.amount / 100000000)).toLocaleString('en')} </font>
                    :
                    <font color='red'> {Number(Math.round(payment.amount / 100000000)).toLocaleString('en')} </font>
                }
            </div>                  
        }         

        </td>
      </tr>
    );

    return (
      <div>
        <p>        
          <a href={"https://scan.arkcoin.net/address/"+bittrex}> Bittrex</a>: {Number (Math.round(this.state.balance.balance / 100000000)).toLocaleString('en')}
        </p>          
        <table>
          <thead>
            <tr>
              <th> Address
              </th>
              <th> Amount
              </th>
            </tr>
          </thead>
          <tbody>{ paymentRow }</tbody>
        </table>
      </div>
    );
  }
}

export class AppBinance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payments: [],
      balance: []
    }
  }

  componentDidMount() {
    var that = this;
    var url = 'https://scan.arkcoin.net/api/getTransactionsByAddress?address=AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V&limit=50&offset=0';
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({
          payments: data
        });
      });

      var url2 = 'https://scan.arkcoin.net/api/getAccount?address=AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V';
      fetch(url2)
        .then(function(response2) {
          if (response2.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response2.json();
        })
        .then(function(data2) {
          that.setState({
            balance: data2
          });
        });
    }

  render() {
    const binance = "AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V";

    if (typeof(this.state.payments.success) === "undefined") {
      return (
        <div>
          <p> Binance history
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const paymentRow = this.state.payments.transactions.map((payment) =>
      <tr key={ payment.id }>
        <td> { payment.senderId === binance ?
            <a href={"https://scan.arkcoin.net/address/"+payment.recipientId}> {payment.recipientId}</a>
            :
            <a href={"https://scan.arkcoin.net/address/"+payment.senderId}> {payment.senderId}</a>
            }
        </td>
        <td> 
        {payment.amount / 100000000 > 1000 ?
            <b>
                {payment.senderId === binance ?
                    <font color='green'> {Number(-Math.round(payment.amount / 100000000)).toLocaleString('en')} </font>
                    :
                    <font color='red'> {Number(Math.round(payment.amount / 100000000)).toLocaleString('en')} </font>
                }
            </b>  
            :
            <div>
                {payment.senderId === binance ?
                    <font color='green'> {Number (-Math.round(payment.amount / 100000000)).toLocaleString('en')} </font>
                    :
                    <font color='red'> {Number(Math.round(payment.amount / 100000000)).toLocaleString('en')} </font>
                }
            </div>                  
        }         

        </td>
      </tr>
    );

    return (
      <div>
        <p>        
          <a href={"https://scan.arkcoin.net/address/"+binance}> Binance</a>: {Number (Math.round(this.state.balance.balance / 100000000)).toLocaleString('en')}
        </p>          
        <table>
          <thead>
            <tr>
              <th> Address
              </th>
              <th> Amount
              </th>
            </tr>
          </thead>
          <tbody>{ paymentRow }</tbody>
        </table>
      </div>
    );
  }
}

