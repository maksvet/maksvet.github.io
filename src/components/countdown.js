import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';

const CountdownTimer = ({ N0, N1, timeLeft, setTimeLeft, onTacticalLanding }) => {
    const [landCountdown, setLandCountdown] = useState(null);

    // Update main countdown every second
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, setTimeLeft]);

    // Check condition for tactical landing
    useEffect(() => {
        const elapsedTime = 240 - timeLeft;
        const playerPoints = elapsedTime + 50 * N0;
        const opponentPoints = elapsedTime + 50 * N1;
        const opponentPotentialPoints = opponentPoints + (240 - elapsedTime) + 6;

        if (playerPoints > opponentPoints) {

            setLandCountdown(opponentPotentialPoints - playerPoints);

        } else if (landCountdown !== null) {
            setLandCountdown(null);
        }
    }, [N0, N1, timeLeft]);

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

    // Renderer callback for main countdown
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
            {landCountdown !== null && landCountdown > 0 && (
                <div>Time for tactical landing: {landCountdown} seconds</div>
            )}
            {landCountdown === 0 && (
                <div>LAND IMMEDIATELY</div>
            )}
        </div>
    );
};

CountdownTimer.propTypes = {
    N0: PropTypes.number.isRequired,
    N1: PropTypes.number.isRequired,
    timeLeft: PropTypes.number.isRequired,
    setTimeLeft: PropTypes.func.isRequired,
    onTacticalLanding: PropTypes.func
};

export default CountdownTimer;
