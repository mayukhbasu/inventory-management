import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './containers/LoginPage/LoginPage';
import HomePage from './containers/HomePage/HomePage';
import Navbar from './components/Navbar/Navbar';


function App() {
  return (
    <>
      <Navbar/>
       <Router>
      {/* <Route render={({location}) => (
        location.pathname !== '/' && location.pathname !== '/login' && <Navbar/>
      )}></Route> */}
      
      <Switch>
        <Route path="/" exact component={LoginPage} />  
        <Route path="/home" exact component={HomePage} />  
      </Switch>
    </Router>
    </>
   
  );
}

export default App;
