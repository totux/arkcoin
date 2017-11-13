import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom'

import { AppLinks } from './AppLinks.js'
import { AppDelegate } from './AppDelegate.js'
import { AppVoters } from './AppVoters.js'
import { AppHistory } from './AppHistory.js'
import { AppPaymentRun} from './AppPaymentRun.js'
import { AppPaymentVoter} from './AppPaymentVoter.js'
import { AppBittrex} from './AppBittrex.js'
import { AppNews} from './AppNews.js'
import { AppRewards } from './AppRewards.js'
import { AppVoting } from './AppVoting.js'
import { AppVoteSpy } from './AppVoteSpy.js'

class AppHeader extends Component {
  render() {
    return (
      <div className="AppHeader">
        <img src={ logo } className="AppLogo" alt="logo" />
        <nav>
          <Link to='/news'>News</Link> &nbsp;
          <Link to='/links'>Links</Link> &nbsp;     
          <Link to='/delegates'>Delegates</Link> &nbsp;
          <Link to='/voters'>Voters</Link> &nbsp;
          <Link to='/votespy'>Spy</Link> &nbsp;           
          <Link to='/history'>History</Link> &nbsp;
          <Link to='/rewards'>Rewards</Link> &nbsp;          
          <Link to='/bittrex'>Bittrex</Link> &nbsp;   
          <Link to='/voting'>Voting</Link>
        </nav>
      </div>
    );
  }
}

class AppMain extends Component {
  render() {
    return (
      <div className="AppMain">
        <Switch>
          <Route exact path='/' component={AppNews}/>
          <Route path='/news' component={AppNews}/>
          <Route path='/links' component={AppLinks}/>
          <Route path='/delegates' component={AppDelegate}/>
          <Route path='/voters/:id' component={AppVoters}/>  
          <Route path='/voters' component={AppVoters}/>  
          <Route path='/votespy/:id' component={AppVoteSpy}/>   
          <Route path='/votespy' component={AppVoteSpy}/>                    
          <Route path='/history' component={AppHistory}/>
          <Route path='/paymentrun/:id' component={AppPaymentRun}/>
          <Route path='/paymentvoter/:id' component={AppPaymentVoter}/>
          <Route path='/rewards' component={AppRewards}/>
          <Route path='/bittrex' component={AppBittrex}/>
          <Route path='/acf' component={AppVoting}/>
          <Route path='/voting' component={AppVoting}/>
        </Switch>
      </div>
    );
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <AppHeader />
        <AppMain />
      </div>
    );
  }
}

export default App;
