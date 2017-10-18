import React, { Component } from 'react';
import Linkify from 'react-linkify';

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
        console.log(data);
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
            <td><Linkify> {news.vendorField}</Linkify> &nbsp;        
            (<a href={"https://explorer.arkcoin.net/tx/"+news.id}>{Number(news.amount / 100000000).toLocaleString('en')}</a>)
            </td>               
        </tr>
    );

    return (
      <div>
        <p>
          Send 0.1 Ark with vendorfield to <br/>
          AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR   
        </p> 
        <p>
          <button
            type="button"
            onClick={() => this.setState({ filterKey: 0 })}
          >All (0)</button>
          &nbsp;
          <button
            type="button"
            onClick={() => this.setState({ filterKey: 0.1 })}
          >Normal (0.1)</button>
          &nbsp;
          <button
            type="button"
            onClick={() => this.setState({ filterKey: 1.0 })}
          >Premium (1)</button>
        </p>
        <table>
          <thead>
            <tr>
              <th>News (Ark)
              </th>        
            </tr>
          </thead>
          <tbody>
            {newsRow}
          </tbody>
        </table>
        <p>
        <button
            type="button"
            onClick={() => this.lastPage(this.state.page)}
          >Last</button>     
          &nbsp; {this.state.page / 50} &nbsp; 
        <button
            type="button"
            onClick={() => this.nextPage(this.state.page)}
          >Next</button>            
        </p>
      </div>

    );
  }
}