import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class AppDelegate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delegates: []
    }
  }

  componentDidMount() {
    var that = this;
    var url = `https://explorer.arkcoin.net/api/delegates/getactive`;
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({
          delegates: data.delegates
        });
      });
  }

  render() {
    if (typeof(this.state.delegates[0]) === "undefined") {
      return (
        <div>
          <p> Ark Delegates
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const delegateRow = this.state.delegates.map((delegate) =>
      <tr key={ delegate.username }>
        <td><Link to={'/votespy/' + delegate.publicKey}> {delegate.rate} </Link>
        </td>
        <td>{ delegate.username === 'jarunik' ? <b> { delegate.username } </b> : delegate.username }
        </td>
        <td><Link to={'/voters/' + delegate.address}>{ Number (Math.round(delegate.vote / 100000000) ).toLocaleString('en') }</Link>
        </td>
      </tr>
    );

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Rank/Spy
              </th>
              <th>Delegate
              </th>
              <th>Vote/List
              </th>            
            </tr>
          </thead>
          <tbody>{delegateRow}
          </tbody>
        </table>
        <AppStandby />
      </div>

    );
  }
}

class AppStandby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delegates: []
    }
  }

  componentDidMount() {
    var that = this;
    var url = `https://explorer.arkcoin.net/api/delegates/getStandby`;
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({
          delegates: data.delegates
        });
      });
  }

  render() {
    if (typeof(this.state.delegates[0]) === "undefined") {
      return (
        <div>
          <p> Ark Standby
          </p>
          <p> loading
          </p>
        </div>
      );
    }

    const delegateRow = this.state.delegates.map((delegate) =>
    <tr key={ delegate.username }>
      <td><Link to={'/votespy/' + delegate.publicKey}>{delegate.rate} </Link>
      </td>
      <td>{ delegate.username === 'jarunik' ? <b> { delegate.username } </b> : delegate.username }
      </td>
      <td><Link to={'/voters/' + delegate.address}> { Number (Math.round(delegate.vote / 100000000)).toLocaleString('en') } </Link>
      </td>
    </tr>
  );

    return (
      <div>
        <br/>
        <table>
          <thead>
            <tr>
              <th>Rank/Spy
              </th>
              <th>Standby
              </th>
              <th>Vote/List
              </th>            
            </tr>
          </thead>
          <tbody>{delegateRow}
          </tbody>
        </table>
      </div>

    );
  }
}
