import React, { useState } from 'react';
import './App.css';

function App() {
  const [casualties, setCasualties] = useState(0);
  const [broken, setBroken] = useState(null);
  const [quartered, setQuartered] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [heroes, setHeroes] = useState([]);
  const [newHero, setNewHero] = useState({
    name: '',
    might: '',
    will: '',
    fate: '',
    wounds: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const brokenValue = parseInt(inputValue);
    setBroken(brokenValue);
    setQuartered(brokenValue * 2);
  };

  const handleReset = () => {
    setCasualties(0);
    setBroken(null);
    setQuartered(null);
    setInputValue('');
    setHeroes([]);
  };

  const addHero = () => {
    if (newHero.name && newHero.might >= 0 && newHero.will >= 0 && newHero.fate >= 0 && newHero.wounds >= 0) {
      setHeroes([...heroes, {
        id: Date.now(),
        name: newHero.name,
        might: { max: parseInt(newHero.might), current: parseInt(newHero.might) },
        will: { max: parseInt(newHero.will), current: parseInt(newHero.will) },
        fate: { max: parseInt(newHero.fate), current: parseInt(newHero.fate) },
        wounds: { max: parseInt(newHero.wounds), current: parseInt(newHero.wounds) }
      }]);
      setNewHero({ name: '', might: '', will: '', fate: '', wounds: '' });
    }
  };

  const adjustValue = (heroId, stat, delta) => {
    setHeroes(heroes.map(hero => {
      if (hero.id === heroId) {
        const newValue = hero[stat].current + delta;
        return {
          ...hero,
          [stat]: {
            ...hero[stat],
            current: Math.max(0, Math.min(hero[stat].max, newValue))
          }
        };
      }
      return hero;
    }));
  };

  const getButtonColor = () => {
    if (broken === null) return '';
    if (casualties >= quartered) return 'quartered';
    if (casualties >= broken) return 'broken';
    return '';
  };

  if (broken === null) {
    return (
      <div className="container">
        <form onSubmit={handleSubmit} className="setup-form">
          <h1 className="title">Battle Tracker</h1>
          
          <div className="form-section">
            <label className="input-label">
              Casualties until broken:
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="1"
                required
                className="number-input"
              />
            </label>
          </div>

          <div className="form-section">
            <h3>Add Heroes</h3>
            <div className="hero-form">
              <input
                type="text"
                placeholder="Hero name"
                value={newHero.name}
                onChange={(e) => setNewHero({...newHero, name: e.target.value})}
                className="hero-input"
              />
              <div className="stat-grid">
                {['might', 'will', 'fate', 'wounds'].map((stat) => (
                  <div key={stat} className="stat-input">
                    <label>{stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                    <input
                      type="number"
                      min="0"
                      value={newHero[stat]}
                      onChange={(e) => setNewHero({...newHero, [stat]: e.target.value})}
                      className="number-input"
                    />
                  </div>
                ))}
              </div>
              <button type="button" onClick={addHero} className="add-hero-button">
                Add Hero
              </button>
            </div>
            
            <div className="hero-preview">
              {heroes.map(hero => (
                <div key={hero.id} className="hero-badge">
                  {hero.name}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="start-button">
            Start Battle
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="counter-container">
        <h2 className="status-text">
          Quattered: {quartered} | Broken: {broken}
        </h2>
        
        <button
          className={`casualty-button ${getButtonColor()}`}
          onClick={() => setCasualties(casualties + 1)}
        >
          <span className="count">{casualties}</span>
          <span className="label">CASUALTIES</span>
        </button>

        <div className="heroes-section">
          {heroes.map(hero => (
            <div key={hero.id} className="hero-card">
              <h3 className="hero-name">{hero.name}</h3>
              <div className="hero-stats">
                {['might', 'will', 'fate', 'wounds'].map((stat) => (
                  <div key={stat} className="hero-stat">
                    <div className="stat-label">
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </div>
                    <div className="stat-controls">
                      <button 
                        onClick={() => adjustValue(hero.id, stat, -1)}
                        disabled={hero[stat].current <= 0}
                      >
                        -
                      </button>
                      <div className="stat-value">
                        {hero[stat].current}/{hero[stat].max}
                      </div>
                      <button 
                        onClick={() => adjustValue(hero.id, stat, 1)}
                        disabled={hero[stat].current >= hero[stat].max}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {casualties >= quartered && (
          <button className="reset-button" onClick={handleReset}>
            Reset Battle
          </button>
        )}
      </div>
    </div>
  );
}

export default App;