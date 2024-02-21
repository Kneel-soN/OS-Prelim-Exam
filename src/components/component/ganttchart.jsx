import React from 'react';

export function GanttChart({ processes }) {
  const totalExecutionTime = processes.reduce((total, process) => total + process.burstTime, 0);
  let currentTime = 0;
  const chart = [];

  processes.forEach((process) => {
    const entry = {
      id: process.id,
      start: currentTime,
      end: currentTime + process.burstTime,
      completionTime: process.completionTime,
    };
    chart.push(entry);
    currentTime += process.burstTime;
  });

  return (
    <div className="mt-4">
      <p>Gantt Chart:</p>
      <div className="flex">
        {chart.map((entry) => (
          <div
            key={entry.id}
            style={{
              width: `${(entry.end - entry.start) / totalExecutionTime * 100}%`,
              backgroundColor: 'black',
              borderRight: '1px solid #fff',
              textAlign: 'center',
              color: '#fff',
              position: 'relative',
            }}
          >
            {`P${entry.id}`}
            <span
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.8em',
                color: 'black', 
              }}
            >
              {entry.completionTime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
