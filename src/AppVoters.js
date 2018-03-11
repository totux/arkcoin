import React, { Component } from 'react';

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
    var delegateAddress = that.props.match.params.id;
    
    //Backward compatibility default to jarunik
    if (typeof(delegateAddress) === "undefined") {
      delegateAddress = "Aasu14aTs9ipZdy1FMv7ay1Vqn3jPskA8t";
    }
    var url = 'https://explorer.arkcoin.net/api/getAccount?address='+delegateAddress;
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
                <td> <a href={"https://explorer.arkcoin.net/address/"+voter.address}>{voter.address}</a>
                </td>
                <td> { Number (Math.round(voter.balance * satoshi)).toLocaleString('en') }
                </td>
            </tr>
        );

    const votesArrayAll = [].concat(this.state.delegate.voters)
        .sort((a, b) => b.balance - a.balance)
        .map((voter) => voter.balance);

    const votesArrayGtZero = [].concat(this.state.delegate.voters)
        .filter((voter) => voter.balance > 0)
        .sort((a, b) => b.balance - a.balance)
        .map((voter) => voter.balance);
        
    function getMedian(sortedArray) {
      var len = sortedArray.length;
      if(!len) return 0;      
      var half = Math.floor(len / 2);
      return len % 2 ? Number(sortedArray[half]) : (Number(sortedArray[half - 1]) + Number(sortedArray[half])) / 2;
    }
        
    return (
      <div>
        <p>
          Voters of <b>{this.state.delegate.delegate.username}</b>
        </p>
        <p>
          Ark: {Number (Math.round(this.state.delegate.delegate.vote * satoshi) ).toLocaleString('en') } <br/>
          Voters: {this.state.delegate.voters.length} <br/>     
          Average: {Number (Math.round(this.state.delegate.delegate.vote * satoshi / this.state.delegate.voters.length) ).toLocaleString('en') } <br/>
          Median: {Number (Math.round(getMedian(votesArrayAll) * satoshi) ).toLocaleString('en') } <br/>
        </p>
        <p>
          Excluding 0 balance <br/>
          Voters: {voterRow.length} <br/>
          Average: {Number (Math.round(this.state.delegate.delegate.vote * satoshi / voterRow.length) ).toLocaleString('en') } <br/>
          Median: {Number (Math.round(getMedian(votesArrayGtZero) * satoshi) ).toLocaleString('en') }  
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
