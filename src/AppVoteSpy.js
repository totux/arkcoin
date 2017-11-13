import React, { Component } from 'react';

const satoshi = 1/100000000;

export class AppVoteSpy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voters: [],
      transactions: [],
      fetchDone: false,
    }
  }

  publicKey;

  signedAmount(transaction) {
    
      if (transaction.type === 3) {
          if (transaction.asset.votes == "+"+this.publicKey) {
            return transaction.balance * satoshi;
          } else {
            return 0;  
          }
      } else {
          if (transaction.voter == transaction.recipientId) {
            return transaction.amount * satoshi;
          } else {
            return -Math.abs(transaction.amount * satoshi);  
          } 
      }
  };

  componentDidMount() {
    var that = this;
    that.publicKey = that.props.match.params.id;

    //Backward compatibility default to jarunik
    if (typeof(that.publicKey) === "undefined") {
      that.publicKey = "02c7455bebeadde04728441e0f57f82f972155c088252bf7c1365eb0dc84fbf5de";
    }

    var url = 'https://api.arkcoin.net/api/delegates/voters?publicKey='+that.publicKey;
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {  
        
        that.setState({
          voters: data
        });

        data.accounts.forEach( function (voter, idx, array)
        {
            if (voter.balance*satoshi > 100) {
                fetch("https://explorer.arkcoin.net/api/getTransactionsByAddress?limit=3&offset=0&address="+voter.address)
                .then(function(response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
                })
                .then(function(data) {
                    
                    data.transactions.forEach( function (transaction, idx, array)
                    {
                        if (transaction.confirmations < 10800 &&
                            (transaction.amount*satoshi > 100 ||
                            (transaction.type === 3 && transaction.asset.votes == "+"+that.publicKey)
                            )
                        ) {
                            var transactionRow = transaction;
                            transactionRow.voter = voter.address;
                            transactionRow.balance = voter.balance;
                            var joined = that.state.transactions.concat(transactionRow);
                            that.setState({ transactions: joined });
                        }
                    });

                    if (idx === array.length - 1){ 
                    that.setState({ fetchDone: true });
                    }
                });
            }
        });
      });
  }

  render() {
    if (!this.state.fetchDone) {
      return (
        <div>
          <p> <b>Vote Changes</b> <br/>
              (for the last 24h)
          </p>
          <p> loading
          </p>
          <br/>
          <p>
             Searching voters with more than 100 Ark. <br/>
             Looking for new Votes from them. <br/>
             Gathering transactions above 100 Ark. <br/>
          </p>
          <p>
             Ignoring removed votes.<br/>
          </p>
        </div>
      );
    }

    const voterRow = [].concat(this.state.transactions)
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((transaction) =>
            <tr key={transaction.voter+transaction.id}>
                <td> <a href={"https://scan.arkcoin.net/address/"+transaction.voter}> {transaction.voter}</a>
                </td>
                <td> {transaction.type === 3 ? "Vote":"TX"}
                </td>
                <td> {this.signedAmount(transaction) > 0
                ? <font color="green"> {this.signedAmount(transaction).toLocaleString('en')} </font> 
                : <font color="red"> {this.signedAmount(transaction).toLocaleString('en')} </font> 
                }
                </td>

            </tr>
        );

    return (
      <div>
        <p>
          <b>Vote Changes (1 day)</b>
        </p>
        <p>
          {}
        </p>
        <table>
          <thead>
            <tr>
              <th> Voter
              </th>
              <th> Type
              </th>
              <th> Change
              </th>              
            </tr>
          </thead>
          <tbody>{ voterRow }</tbody>
        </table>
      </div>
    );
  }
}
