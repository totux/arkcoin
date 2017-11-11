import React, { Component } from 'react';
import Linkify from 'react-linkify';
import moment from 'moment';

export class AppNews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      filterKey: 0.1,
      page: 0
    }
  }

  lastPage(currentPage) {
    var newPage = currentPage - 50
    if (newPage < 0) {newPage=0}
    this.setState({ page: newPage })
    this.fetchData(newPage)
  }

  nextPage(currentPage) {
    var newPage = currentPage + 50
    if (this.state.news.transactions.length === 50) {
      this.setState({ page: newPage })
      this.fetchData(newPage)      
    }
  }

  getTimeCounter(t) {
    var arkStart = moment.utc([2017, 2, 21, 13, 0, 0, 0]).local();
    var duration = moment.duration(t, 'seconds');
    var dt = arkStart.add(duration);

    return dt.format('LLL') + ' (' + dt.fromNow() + ')';
  }

  fetchData(page) {   
    var that = this;
    var url = "https://scan.arkcoin.net/api/getTransactionsByAddress?address=AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR&limit=50&offset=" + page + "&direction=received";
    fetch(url)
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function (data) {
        that.setState({
          news: data
        });
      });
  }


  componentDidMount() {
    this.fetchData(0)
  }

  render() {
    if (typeof(this.state.news.success) === "undefined") {
      return (
        <div>
          <p> News
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const newsRow = [].concat(this.state.news.transactions)
    .filter((news) => news.vendorField !== undefined && news.amount >= this.state.filterKey * 100000000  )
    .map((news) =>
        <tr key={news.id}>
            <td>
              { news.amount >= 1 * 100000000 ?
                <b><Linkify> {news.vendorField}</Linkify></b> :
                news.amount < 0.1 * 100000000 ?
                <i><Linkify> {news.vendorField}</Linkify></i>:
                <Linkify> {news.vendorField}</Linkify>  }  
              <br/>
                <font color="grey" size="1">
                  <a href={"https://scan.arkcoin.net/tx/"+news.id} className="atdate">@</a>&nbsp;
                  {this.getTimeCounter(news.timestamp)}
                </font>          
            </td>               
        </tr>
    );

    return (
      <div className="AppNews">
        <p>
          Send a transaction with vendorfield to <br/>
          <a href="https://scan.arkcoin.net/address/AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR">AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR</a> <br/>
          (Regular:0.1 - Premium:1.0) <br/>
        </p> 
        <p>
          <button
            type="button"
            onClick={() => this.setState({ filterKey: 0 })}
          ><i>All</i></button>
          &nbsp;
          <button
            type="button"
            onClick={() => this.setState({ filterKey: 0.1 })}
          >Regular</button>
          &nbsp;
          <button
            type="button"
            onClick={() => this.setState({ filterKey: 1.0 })}
          ><b>Premium</b></button>
        </p>
        <table>
          <thead>
            <tr>
              <th>Ark Blockchain News
              </th>        
            </tr>
          </thead>
          <tbody>
            {newsRow}
          </tbody>
        </table>
        <p>
        {this.state.page > 0 ?
        <button
            type="button"
            onClick={() => this.lastPage(this.state.page)}
          >Previous</button>
        : " "}     
          &nbsp; page {this.state.page / 50} &nbsp; 
       {this.state.news.transactions.length === 50 ?
       <button
            type="button"
            onClick={() => this.nextPage(this.state.page)}
          >Next</button>  
        : " "}          
        </p>
      </div>

    );
  }
}