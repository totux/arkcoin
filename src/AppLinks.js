import React, { Component } from 'react';

export class AppLinks extends Component {
  render() {
    return (
      <div className="AppLinks">
        <p>
          Welcome to arkcoin.net <br />
          List of services powered by
        </p>
        <table>
          <thead>
            <tr>
              <th>
                Delegate Jarunik
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://www.reddit.com/r/DelegateJarunik/wiki/proposal">delegate proposal</a>
              </td>
            </tr>
            <tr>
                <td>
                  <a href="https://www.reddit.com/r/DelegateJarunik/">delegate subreddit</a>
                </td>
            </tr>
            <tr>
              <td>
                <a href="https://medium.com/@jarunik">medium blog</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://www.reddit.com/r/DelegateJarunik/wiki/bounty">voter bounty program</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://doc.arkcoin.net">downloads</a>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <table>
          <thead>
            <tr>
              <th>
                Communities
                </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://www.reddit.com/r/ArkEcosystem/"> /r/ArkEcosystem</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://www.reddit.com/r/ArkDelegates/"> /r/ArkDelegates</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://www.reddit.com/r/arktrader/"> /r/arktrader</a>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <table>
          <thead>
            <tr>
              <th>
                Tools
                </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://explorer.arkcoin.net/">explorer</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://api.arkcoin.net/api/peers/version">mainnet node api</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://dev.arkcoin.net/api/peers/version">devnet node api</a>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <table>
          <thead>
            <tr>
              <th>
                <b>Github</b>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://github.com/jarunik/">jarunik</a>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>
          <b>Vote delegate jarunik!</b>
        </p>
      </div>
    );
  }
}
