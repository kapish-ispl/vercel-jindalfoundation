import React from 'react';

interface PlayIconProps {
    size?: number;
    circleOpacity?: number;
}

const PlayIcon: React.FC<PlayIconProps> = ({ size = 56, circleOpacity = 0.5 }) => (
    <span
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <svg
            width={size}
            height={size}
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="28" cy="28" r="28" fill={`rgba(0,0,0,${circleOpacity})`} />
            <polygon points="22,16 44,28 22,40" fill="white" />
        </svg>
    </span>
);

export default PlayIcon;
