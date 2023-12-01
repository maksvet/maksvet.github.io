import React, { useState } from 'react';
import CountdownTimer from './components/countdown.js'; // Make sure this path is correct


const App = () => {
  const [N0, setN0] = useState(0);
  const [N1, setN1] = useState(0);
  const [startCountdown, setStartCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(240); // Total match time in seconds

  const handleTacticalLanding = (time) => {
    console.log("Tactical Landing Time:", time);
  };

  const elapsedTime = 240 - timeLeft; // Time elapsed since the start of the match
  const playerPoints = elapsedTime + 50 * N0;
  const opponentPoints = elapsedTime + 50 * N1;

  return (
    <div>
      <input
        type="number"
        placeholder="N0 (My Cuts)"
        value={N0}
        onChange={(e) => setN0(parseInt(e.target.value))}
      />
      <div>My Points: {playerPoints}</div>

      <input
        type="number"
        placeholder="N1 (Opponent Cuts)"
        value={N1}
        onChange={(e) => setN1(parseInt(e.target.value))}
      />
      <div>Opponent Points: {opponentPoints}</div>

      <button onClick={() => setStartCountdown(true)}>Start Countdown</button>

      {startCountdown && (
        <CountdownTimer
          N0={N0}
          N1={N1}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onTacticalLanding={handleTacticalLanding}
        />
      )}
    </div>
  );
};

export default App;
