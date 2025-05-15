import './App.css';
//import Landing from './pages/landing';
import SearchSchool from './pages/searchSchool';
import SchoolData from './Data.json'

function App() {
  return (
    <div className="App">
      <SearchSchool placeholder="Find a school..." data={SchoolData}/>
    </div>
  );
}

export default App;

