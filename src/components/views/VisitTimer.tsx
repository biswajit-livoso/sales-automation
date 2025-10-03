import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

interface VisitTimerProps {
  startTime: string; // ISO string
}

const VisitTimer: React.FC<VisitTimerProps> = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(() => Date.now() - new Date(startTime).getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - new Date(startTime).getTime());
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [startTime]);

  return (
    <Typography variant="h6" sx={{ mt: 1 }}>
      ⏱ {formatDuration(elapsed)}
    </Typography>
  );
};

export default VisitTimer;
