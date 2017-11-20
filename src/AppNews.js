import React, { Component } from 'react';
import Linkify from 'react-linkify';
import moment from 'moment';
import { Button , ToggleButtonGroup , ToggleButton } from 'react-bootstrap';

const satoshi = 1/100000000;

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

  resolveSenderId(senderId , tx) {
    const sender = {
      "ANaBAcnie5vcaHRgwrCUijyvkLgRA8zP6S": "jarunik",
      "AZFz6Tf7KJQfzkfNDK93TavXJjUvb23xoa": "jarunik"
    };

    if (tx.senderDelegate !== null) {
      console.log(tx.senderDelegate);
      return <a href={"https://explorer.arkcoin.net/address/"+senderId}>{tx.senderDelegate.username}</a>;
    }

    if (sender[senderId] !== undefined) {
      return <a href={"https://explorer.arkcoin.net/address/"+senderId}>{sender[senderId]}</a>;
    } else {
      return <a href={"https://explorer.arkcoin.net/address/"+senderId}>{senderId.substring(0,10)}</a>;
    }
  }

  fetchData(page) {   
    var that = this;
    var url = "https://explorer.arkcoin.net/api/getTransactionsByAddress?address=AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR&limit=50&offset=" + page + "&direction=received";
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
    .filter((news) => news.vendorField !== undefined && news.amount >= this.state.filterKey / satoshi  )
    .map((news) =>
        <tr key={news.id}>
            <td>
              { news.amount >= 1 / satoshi ?
                <b><Linkify> {news.vendorField}</Linkify></b> :
                news.amount < 0.1 / satoshi ?
                <i><Linkify> {news.vendorField}</Linkify></i>:
                <Linkify> {news.vendorField}</Linkify>  }  
              <br/>
                <font color="grey" size="1">
                  <a href={"https://explorer.arkcoin.net/tx/"+news.id} className="atdate">@</a>&nbsp;
                  {this.getTimeCounter(news.timestamp)}&nbsp;
                  by &nbsp;
                  {this.resolveSenderId(news.senderId,news)}
                </font>                                     
            </td>               
        </tr>
    );

    return (
      <div className="AppNews">
        <p>
          Send a transaction with Smartbridge to <br/>
          <a href="https://explorer.arkcoin.net/address/AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR">AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR</a> <br/>
            Regular: 0.1 Ark  <br/>
            Premium: 1.0 Ark
        </p> 
          <ToggleButtonGroup bsSize="xs" type="radio" name="filter" defaultValue={0.1}>
            <ToggleButton value={0} onClick={() => this.setState({ filterKey: 0 })}>
              All
            </ToggleButton>
            <ToggleButton value={0.1} onClick={() => this.setState({ filterKey: 0.1 })}>
              Regular
            </ToggleButton>
            <ToggleButton value={1.0} onClick={() => this.setState({ filterKey: 1.0 })}>
              Premium
            </ToggleButton>
          </ToggleButtonGroup>
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
        <br/>
        <p>
          {this.state.page > 0 ?
            <Button bsSize="xs" onClick={() => this.lastPage(this.state.page)}>
              Previous
            </Button>
            : 
            <Button bsSize="xs" onClick={() => this.lastPage(this.state.page)} disabled>
              Previous
            </Button>
          }
          &nbsp; page {this.state.page / 50} &nbsp;
          {this.state.news.transactions.length === 50 ?
            <Button bsSize="xs" onClick={() => this.nextPage(this.state.page)}>
              Next
            </Button>
            :
            <Button bsSize="xs" onClick={() => this.nextPage(this.state.page)} disabled>
              Next
            </Button>
          }
        </p>
      </div>

    );
  }
}