import React, { Component } from 'react';

export class AppDelegate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delegates: []
    }
  }

  componentDidMount() {
    var that = this;
    var url = `https://scan.arkcoin.net/api/delegates/getactive`;
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
        <td>{ delegate.rate }
        </td>
        <td>{ delegate.username === 'jarunik' ? <b> { delegate.username } </b> : delegate.username }
        </td>
        <td>{ Number (Math.round(delegate.vote / 100000000) ).toLocaleString('en') }
        </td>
      </tr>
    );

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Rank
              </th>
              <th>Delegate
              </th>
              <th>Vote
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
    var url = `https://scan.arkcoin.net/api/delegates/getStandby`;
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
      <td>{ delegate.rate }
      </td>
      <td>{ delegate.username === 'jarunik' ? <b> { delegate.username } </b> : delegate.username }
      </td>
      <td>{ Number (Math.round(delegate.vote / 100000000)).toLocaleString('en') }
      </td>
    </tr>
  );

    return (
      <div>
        <br/>
        <table>
          <thead>
            <tr>
              <th>Rank
              </th>
              <th>Standby
              </th>
              <th>Vote
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
