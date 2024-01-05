import React, { useState, useEffect } from 'react';
import CountdownTimer from './components/countdown.js';
import VoiceWidget from './voiceWidgets/VoiceWidget.js';
import VoiceWidgetRhino from './voiceWidgets/VoiceWidgetRhino.js';

const App = () => {
  console.log('Rendering App component');

  const [N0, setN0] = useState(0);
  const [N1, setN1] = useState(0);
  const [isPlayerLanded, setIsPlayerLanded] = useState(false);
  const [isOpponentLanded, setIsOpponentLanded] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(240); // Total match time in seconds
  const [playerAirtime, setPlayerAirtime] = useState(0);
  const [opponentAirtime, setOpponentAirtime] = useState(0);

  // Porcupine code
  const [wakeWordDetected, setWakeWordDetected] = useState(false);


  const onWakeWordDetected = () => {
    console.log('Wake word detected');
    setWakeWordDetected(true);
    setInitRhino(false);
    setTimeout(() => {
      setInitRhino(true);
      setIsListeningForCommand(true);
    }, 0)


  };

  useEffect(() => {
    if (wakeWordDetected) {
      setIsListeningForCommand(true);
    }
  }, [wakeWordDetected]);

  // Rhino code
  const [initRhino, setInitRhino] = useState(false);
  const [isListeningForCommand, setIsListeningForCommand] = useState(false);
  const onCommandRecognized = (command) => {
    console.log(`Command recognized: ${command}`);
    // Logic to handle different commands
    if (command === 'Start') {
      setStartCountdown(true);
    }
    // ... handle other commands
    // // Reset Rhino states for next command
    // setInitRhino(false);
    // setTimeout(() => {
    //   setInitRhino(true);
    //   setStartlistening(true); // Re-activate listening
    // }, 0);
  };

  const handleTacticalLanding = () => {
    console.log("Tactical Landing Time reached!");
  };

  useEffect(() => {
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

      <div className="App">
        <VoiceWidget onWakeWordDetected={onWakeWordDetected} />
      </div>

      {isListeningForCommand && (
        <VoiceWidgetRhino initRhino={initRhino} startListening={isListeningForCommand} onCommandRecognized={onCommandRecognized} />
      )}
    </div>
  );
};

export default App;
