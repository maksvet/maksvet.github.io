import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';

const CountdownTimer = ({ N0, N1, timeLeft, setTimeLeft, onTacticalLanding, isPlayerLanded, isOpponentLanded }) => {
    const [landCountdown, setLandCountdown] = useState(null);
    const [showLandImmediately, setShowLandImmediately] = useState(false);
    const totalMatchTime = 240; // Total match time in seconds

    // Update main countdown every second
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, setTimeLeft]);

    // Check condition for tactical landing
    useEffect(() => {
        const elapsedTime = totalMatchTime - timeLeft;
        const playerPoints = isPlayerLanded ? 50 * N0 : elapsedTime + 50 * N0;
        const opponentPoints = isOpponentLanded ? 50 * N1 : elapsedTime + 50 * N1;
        const opponentPotentialPoints = opponentPoints + (totalMatchTime - elapsedTime) + 6;

        if (playerPoints > opponentPotentialPoints) {
            setShowLandImmediately(true); // Show "LAND IMMEDIATELY" immediately
        } else if (playerPoints > opponentPoints) {
            const tacticalTime = opponentPotentialPoints - playerPoints;
            setLandCountdown(tacticalTime);
        } else {
            setShowLandImmediately(false); // Hide "LAND IMMEDIATELY" if condition not met
            setLandCountdown(null);
        }
    }, [N0, N1, timeLeft, isPlayerLanded, isOpponentLanded]);

    // Update tactical landing countdown every second
    useEffect(() => {
        if (landCountdown !== null && landCountdown > 0) {
            const timer = setTimeout(() => setLandCountdown(landCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }

        if (landCountdown === 0 && onTacticalLanding) {
            onTacticalLanding();
        }
    }, [landCountdown, onTacticalLanding]);

    // Renderer callback for the main countdown
    const renderer = ({ completed }) => {
        if (completed) {
            return <div>Countdown finished!</div>;
        } else {
            return <span>{timeLeft} seconds</span>;
        }
    };

    return (
        <div>
            <Countdown
                date={Date.now() + timeLeft * 1000}
                renderer={renderer}
            />
            {showLandImmediately && (
                <div>LAND IMMEDIATELY</div>
            )}
            {!showLandImmediately && landCountdown !== null && landCountdown > 0 && (
                <div>Time for tactical landing: {landCountdown} seconds</div>
            )}
        </div>
    );
};

CountdownTimer.propTypes = {
    N0: PropTypes.number.isRequired,
    N1: PropTypes.number.isRequired,
    timeLeft: PropTypes.number.isRequired,
    setTimeLeft: PropTypes.func.isRequired,
    onTacticalLanding: PropTypes.func,
    isPlayerLanded: PropTypes.bool.isRequired,
    isOpponentLanded: PropTypes.bool.isRequired
};

export default CountdownTimer;
