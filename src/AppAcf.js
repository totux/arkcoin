import React, { Component } from 'react';
import moment from 'moment';

export class AppAcf extends Component {
  constructor(props) {
    super(props);

    this.state = {
      success: true,
      candidates: [],
      height: [],
      deadline: 2563000
    }
  };

  componentDidMount() {
    var that = this;

    var candList = [           
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

    candList.forEach( function (candi)
    {
        fetch("https://api.arkcoin.net/api/transactions?recipientId="+candi.address+"&limit=0")
        .then(function(response) {
            if (response.status >= 400) {
            throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(info) {
            var fetchSuccess = info.success;
            if (!fetchSuccess) { that.setState({ success : false}); } 

            var candiRow = info;
            candiRow.name = candi.name;
            candiRow.address = candi.address;
            candiRow.votes = 0;
            var joined = that.state.candidates.concat(candiRow);
            that.setState({ candidates: joined });

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
                            if(voters.indexOf(trans[j].senderId) === -1 && trans[j].amount === 1){
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
                                    
                                    var vote = parseFloat(info3.account.balance)/100000000;                                  
                                    var items = that.state.candidates;
                                    items.filter((e) => e.name === candi.name)[0].votes = items.filter((e) => e.name === candi.name)[0].votes + vote;
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

  render() {
    if (typeof(this.state.success) === "undefined") {
      return (
        <div>
          <p> Candidates
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const candRow= this.state.candidates
    .sort((a, b) => b.votes - a.votes)
    .map((cand, index) =>
      <tr key={ cand.name }>
        <td> { index < 5 ? <b><font color='green'> { index+1} </font></b> : index+1 }
        </td>
        <td> { index < 5 ? <b><font color='green'> { cand.name} </font></b> : cand.name }
        </td>
        <td> <a href={"https://explorer.arkcoin.net/address/"+cand.address}>{ cand.address}</a>
        </td>
        <td> { index < 5 ? <b><font color='green'>  { Number (Math.round(cand.votes) ).toLocaleString('en') }  </font></b> : Number (Math.round(cand.votes) ).toLocaleString('en')  }
        </td>
      </tr>
    );

    return (
      <div>
      <p>
        <b>ACF Board Voting</b>
      </p>
      <p>
        Send 0.00000001 Ark to a candidate address to vote.<br/>
        You can vote for multiple candidates.
      </p>
      <p>
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
            <th> Candidate
              </th>
              <th> Address
              </th>
              <th> Votes
              </th>
            </tr>
          </thead>
          <tbody>{ candRow }</tbody>
        </table>
      </div>
    );
  }
}
