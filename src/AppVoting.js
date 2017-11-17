import React, { Component } from 'react';
import moment from 'moment';

const satoshi = 1/100000000;

//Configure your Voting (also adapt optionList)
const acitveVoting = false;
// Voting Title
const votingName = "ACF Board Voting";
// How much Satoshi to send with vote TX 
const voteAmount = 1;
// Block when voting will end
const votingEnd = 2563000;
// Rank needed that option wins the vote
const winRank = 5; 
// Should the balance of voters count as vote?
const balanceWins = true; //false means voter count wins

export class AppVoting extends Component {
  
  constructor(props) {   
    super(props);
   
    this.state = {
      success: true,
      options: [],
      height: [],
      deadline: votingEnd
    }
  };

  votingSort(a,b) {
    if (balanceWins) {
      return b.votes - a.votes;  
    } else {
      return b.count - a.count;
    }
  }

  componentDidMount() {
    var that = this;

    // New Address for each Voting needed!
    var optionList = [           
        {name:"casanova", address:"AQkUn9yULbPxio5h4ygUpsYT7AENj188wp"},
        {name:"del", address:"AKrCQnwA26nJtNTSARaEPBeero5BLkfBmP"},
        {name:"blazeron", address:"ASNDRPjmM8kQTBqZqbLJt9HPqSFPoQT9m4"},
        {name:"goldenpepe", address:"AWH6e8B5JKAnMZ3oHjxzjE5vibDtAJATBh"},
        {name:"michaelthecryptoguy", address:"AYhW46TvBeEaYFP3wmyt9eoFpKxVKEjJ4e"},
        {name:"criptodogg", address:"APL8ptiNTcn5ND1nGtiuCQbmrTcrkPiWhr"},
        {name:"moonman", address:"AQVvztdMPuscc28NXjjDRYLuWqn7JHEjUD"},
        {name:"sleepdeficit", address:"AH7STbJ2iJDfjEgrLhZCqNkswB7SXSLB97"},
        {name:"yokoama", address:"AFwKCp1v4CQCdEjcSuc4L6FN7QuhuQXcjQ"},
        {name:"faustbrian", address:"AdPiqP6zQ9xJQzVp6xj5bocUf2mDgXbP6L"},
        {name:"reconnico", address:"APSi8MrCY2u2Ka5DWYQnhffLhU766a2wac"},
        {name:"turnip", address:"AFuNopRKj2VwhaTWQraZgPTT5nofXskBTN"}
    ];

    if (acitveVoting) {
    optionList.forEach( function (option)
    {
        fetch("https://api.arkcoin.net/api/transactions?recipientId="+option.address+"&limit=0")
        .then(function(response) {
            if (response.status >= 400) {
            throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(info) {
            var fetchSuccess = info.success;
            if (!fetchSuccess) { that.setState({ success : false}); } 

            var optionRow = info;
            optionRow.name = option.name;
            optionRow.address = option.address;
            optionRow.votes = 0;
            var joined = that.state.options.concat(optionRow);
            that.setState({ options: joined });

            //extract unique voters  
            var voters = [];
            var looper = 0;
            var targetLoops = info.count/50;
            for(var i = 0; i< info.count; i++){   
                if (i%50 === 0) {            
                    fetch("https://api.arkcoin.net/api/transactions?recipientId="+info.address+"&offset="+i+"&limit=50")
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                        return response.json();
                    })
                    .then(function(info2) {            
                        looper = looper +1;
                        //extract unique voters  
                        var trans = info2.transactions;
                        for (var j=0; j< trans.length; j++) {
                            if(voters.indexOf(trans[j].senderId) === -1 && trans[j].amount === voteAmount){
                              voters.push(trans[j].senderId);        
                            }
                        }
                        
                        //once we got all pages/voters we can start summing up
                        if(looper >= targetLoops) { //trans.length < 50 does not work for 50 TX
                            var uVoters = voters.filter(function(elem, index, self) {
                              return index === self.indexOf(elem);
                            })                    
                            
                            //calculate total  
                            for(i = 0; i< uVoters.length; i++){                            
                                fetch("https://api.arkcoin.net/api/accounts?address="+uVoters[i])
                                .then(function(response) {
                                    if (response.status >= 400) {
                                    throw new Error("Bad response from server");
                                    }
                                    return response.json();
                                })
                                .then(function(info3) {            
                                    //Sum up on state                                                         
                                    
                                    var vote = parseFloat(info3.account.balance) * satoshi;                                  
                                    var items = that.state.options;
                                    items.filter((e) => e.name === option.name)[0].votes = items.filter((e) => e.name === option.name)[0].votes + vote;
                                    that.forceUpdate();            
                                });                           
                            }
                        }                                                               
                    });
                }
            }    
            
 
        });
    });

    fetch("https://api.arkcoin.net/api/blocks/getHeight")
      .then(function(response2) {
        if (response2.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response2.json();
      })
      .then(function(data2) {
        that.setState({
          height : data2
        });
      });  
      
    }

  }

  render() {
    if (typeof(this.state.success) === "undefined") {
      return (
        <div>
          <p> Voting
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const optionRow= this.state.options
    .sort((a, b) => this.votingSort(a,b))
    .map((opt, index) =>
      <tr key={ opt.name }>
        <td> { index < winRank ? <b><font color='green'> { index+1} </font></b> : index+1 }
        </td>
        <td> { index < winRank ? <b><font color='green'> { opt.name} </font></b> : opt.name }
        </td>
        <td> <a href={"https://explorer.arkcoin.net/address/"+opt.address}>{ opt.address}</a>
        </td>
        <td> { index < winRank ? <b><font color='green'>  { Number (Math.round(opt.votes) ).toLocaleString('en') }  </font></b> : Number (Math.round(opt.votes) ).toLocaleString('en')  }
        </td>
        <td> { index < winRank ? <b><font color='green'>  { Number (Math.round(opt.count) ).toLocaleString('en') }  </font></b> : Number (Math.round(opt.count) ).toLocaleString('en')  }
        </td>
      </tr>
    );
    
    if (acitveVoting) {
      return (
        <div className="AppVote">
        <p>
          <b>{votingName}</b>
        </p>
        <p>
          Send {(voteAmount * satoshi).toLocaleString('en', {minimumFractionDigits: 8 })} Ark to an address below to vote for an option.<br/>
          You can vote for multiple options.
        </p>
        <p>
            Rank needed to win: { winRank} <br/>
            Deadline on Block: {this.state.deadline} <br/>
            Current Block Height: {this.state.height.height} <br/>
            Blocks remaining: { this.state.deadline - this.state.height.height }<br/>
            Estimated time remaining: <b><font color='red'>{moment.duration((this.state.deadline - this.state.height.height) * 8,'seconds').humanize()}</font></b> 
        </p>
          <table>
            <thead>
              <tr>
              <th> Rank
                </th>              
              <th> Option
                </th>
                <th> Address
                </th>
                <th> Votes
                </th>
                <th> Voter
                </th>
              </tr>
            </thead>
            <tbody>{ optionRow }</tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div>
          <p> <b>Voting</b> <br/>
          </p>
          <p> There is currently no active voting.
          </p>
        </div>
      );      
    }
  }
}
