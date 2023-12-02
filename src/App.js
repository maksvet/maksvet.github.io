import React, { useState, useEffect } from 'react';
import CountdownTimer from './components/countdown.js';
import SpeechRec from './components/speech_rec.js';

const App = () => {
  const [N0, setN0] = useState(0);
  const [N1, setN1] = useState(0);
  const [isPlayerLanded, setIsPlayerLanded] = useState(false);
  const [isOpponentLanded, setIsOpponentLanded] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(240); // Total match time in seconds
  const [playerAirtime, setPlayerAirtime] = useState(0);
  const [opponentAirtime, setOpponentAirtime] = useState(0);

  const handleTacticalLanding = () => {
    console.log("Tactical Landing Time reached!");
  };
  const handleVoiceCommand = (command) => {
    switch (command) {
      case 'старт':
        setStartCountdown(true);
        break;
      case 'взлетел':
        setIsPlayerLanded(false);
        break;
      case 'сел':
        setIsPlayerLanded(true);
        break;
      case 'отруб':
        setN0(N0 + 1);
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    // Update airtime points every second if the countdown has started
    if (startCountdown) {
      const updateAirtime = () => {
        if (!isPlayerLanded) {
          setPlayerAirtime(playerAirtime + 1);
        }
        if (!isOpponentLanded) {
          setOpponentAirtime(opponentAirtime + 1);
        }
      };

      const timer = setTimeout(updateAirtime, 1000);
      return () => clearTimeout(timer);
    }
  }, [playerAirtime, opponentAirtime, isPlayerLanded, isOpponentLanded, startCountdown]);

  // Calculate total points for player and opponent
  const playerPoints = playerAirtime + 50 * N0;
  const opponentPoints = opponentAirtime + 50 * N1;

  return (
    <div>
      <input type="number" placeholder="N0 (My Cuts)" value={N0} onChange={(e) => setN0(parseInt(e.target.value, 10))} />
      <button onClick={() => setIsPlayerLanded(!isPlayerLanded)}>
        {isPlayerLanded ? "Take Off" : "Land"}
      </button>
      <div>My Points: {playerPoints}</div>

      <input type="number" placeholder="N1 (Opponent Cuts)" value={N1} onChange={(e) => setN1(parseInt(e.target.value, 10))} />
      <button onClick={() => setIsOpponentLanded(!isOpponentLanded)}>
        {isOpponentLanded ? "Take Off" : "Land"}
      </button>
      <div>Opponent Points: {opponentPoints}</div>

      <button onClick={() => setStartCountdown(true)}>Start Countdown</button>
      <SpeechRec onCommand={handleVoiceCommand} />
      {startCountdown && (
        <CountdownTimer
          N0={N0}
          N1={N1}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onTacticalLanding={handleTacticalLanding}
          isPlayerLanded={isPlayerLanded}
          isOpponentLanded={isOpponentLanded}
        />
      )}
    </div>
  );
};

export default App;
