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
                <td> { (getWeight(voter.balance, this.state.delegate.delegate.vote)).toLocaleString('en')}%
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
        
    const weightArray = [].concat(this.state.delegate.voters)
        .filter((voter) => voter.balance > 0)
        .sort((a, b) => b.balance - a.balance)
        .map((voter) => Number(getWeight(voter.balance, this.state.delegate.delegate.vote)));
    
    function getWeight(vote, candidateTotal, cap=132563692) {
      return Math.round(vote * satoshi) < cap ? ((vote * 100) / candidateTotal).toFixed(3) : ((cap/satoshi * 100) / candidateTotal).toFixed(3) ;
    }
    
    // works sorted arrays
    function quartile(sortedArray, q) {
      var pos = ((sortedArray.length) - 1) * q;
      var base = Math.floor(pos);
      var rest = pos - base;
      if( (sortedArray[base+1]!==undefined) ) {
        return Number(sortedArray[base]) + rest * (Number(sortedArray[base+1]) - Number(sortedArray[base]));
      } else {
        return Number(sortedArray[base]);
      }
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
          Median: {Number (Math.round(quartile(votesArrayAll, 0.5) * satoshi)).toLocaleString('en') } <br/>
        </p>
        <p>
          Excluding 0 balance <br/>
          Voters: {voterRow.length} <br/>
          Average: {Number (Math.round(this.state.delegate.delegate.vote * satoshi / voterRow.length) ).toLocaleString('en') } <br/>
          Median: {Number (Math.round(quartile(votesArrayGtZero, 0.5) * satoshi) ).toLocaleString('en') } <br/>
        </p>
        <p>
          <b>Vote Weight Statistics</b><br/>
          Max share: {(weightArray[0]).toLocaleString('en') }% <br/>
          Average share: {(weightArray.reduce((a, b) => a + b, 0) / weightArray.length).toLocaleString('en')}% <br/>
          Estimate Vote to 1%: {Number (Math.round(this.state.delegate.delegate.vote * satoshi/ 100)).toLocaleString('en') } <br/>
          Actual first balance above 1%: {Number (Math.round(votesArrayAll[(weightArray.findIndex(x => x < 1) > 0 ? weightArray.findIndex(x => x < 1) : weightArray.length) - 1] * satoshi)).toLocaleString('en') } <br/>
          Distance: {(Number(Math.round(votesArrayAll[(weightArray.findIndex(x => x < 1) > 0 ? weightArray.findIndex(x => x < 1) : weightArray.length) - 1] * satoshi)) - Number(Math.round(this.state.delegate.delegate.vote * satoshi/100))).toLocaleString('en') } <br/>
          1st quartile: {quartile(weightArray, 0.25).toFixed(3) }% <br/>
          Median: {quartile(weightArray, 0.5).toFixed(3) }% <br/>
          3rd quartile: {quartile(weightArray, 0.75).toFixed(3) }% <br/>
          Weight in 25% highest: {(weightArray.filter((x) => x  >= quartile(weightArray, 0.25)).reduce((a, b) => a + b, 0)).toFixed(3)}%  <br/>
          Weight in 75% lowest: {Number(100 - (weightArray.filter((x) => x  >= quartile(weightArray, 0.25)).reduce((a, b) => a + b, 0))).toFixed(3)}%
        </p>
        <table>
          <thead>
            <tr>
              <th> Voter
              </th>
              <th> Balance
              </th>
              <th> Weight
              </th>
            </tr>
          </thead>
          <tbody>{ voterRow }</tbody>
        </table>
      </div>
    );
  }
}
