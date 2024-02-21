'use client'
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { GanttChart } from './ganttchart';

export function Algoselect() {
  const [processes, setProcesses] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState("FCFS");
  const [inputValues, setInputValues] = useState({});
  const [quantum, setQuantum] = useState(1);
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(0);
  const [averageWaitTime, setAverageWaitTime] = useState(0);


  const addProcess = () => {
    const newId = processes.length +   1;
    setProcesses([...processes, { id: newId, arrivalTime:   0, burstTime:   0, priority:   0, completionTime:   0, turnaroundTime:   0, waitTime:   0 }]);
  };

  const deleteProcess = (id) => {
    const updatedProcesses = processes.filter((process) => process.id !== id);
    setProcesses(updatedProcesses);
  };

  const calculateFCFS = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    sortedProcesses.forEach((process, index) => {
      if (process.arrivalTime > currentTime) {
        currentTime = process.arrivalTime;
      }
      process.waitTime = currentTime - process.arrivalTime;
      totalWaitingTime += process.waitTime;
      currentTime += process.burstTime;
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      totalTurnaroundTime += process.turnaroundTime;
    });

    const updatedProcesses = sortedProcesses.map((process) => ({ ...process }));
    setProcesses(updatedProcesses);

    setAverageTurnaroundTime(totalTurnaroundTime / processes.length);
    setAverageWaitTime(totalWaitingTime / processes.length);
  };

  const calculateSJN = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.burstTime - b.burstTime);
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    sortedProcesses.forEach((process, index) => {
      if (process.arrivalTime > currentTime) {
        currentTime = process.arrivalTime;
      }
      process.waitTime = currentTime - process.arrivalTime;
      totalWaitingTime += process.waitTime;
      currentTime += process.burstTime;
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      totalTurnaroundTime += process.turnaroundTime;
    });

    const updatedProcesses = sortedProcesses.map((process) => ({ ...process }));
    setProcesses(updatedProcesses);

    setAverageTurnaroundTime(totalTurnaroundTime / processes.length);
    setAverageWaitTime(totalWaitingTime / processes.length);
  };

  const calculateRR = () => {
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const remainingProcesses = [...processes];
  
    while (remainingProcesses.length > 0) {
      for (let i = 0; i < remainingProcesses.length; i++) {
        const process = remainingProcesses[i];
        const timeToExecute = Math.min(quantum, process.burstTime);
        currentTime += timeToExecute;
        process.burstTime -= timeToExecute;
  
        if (process.burstTime <= 0) {
          process.completionTime = currentTime;
          process.turnaroundTime = process.completionTime - process.arrivalTime;
          process.waitTime = process.turnaroundTime - process.burstTime; 
          totalWaitingTime += process.waitTime;
          totalTurnaroundTime += process.turnaroundTime;
          remainingProcesses.splice(i, 1);
          i--;
        }
      }
    }
  
    const updatedProcesses = processes.map((process) => ({ ...process }));
    setProcesses(updatedProcesses);
  
    const numProcesses = processes.length;
    const averageTurnaroundTime = totalTurnaroundTime / numProcesses;
    const averageWaitTime = totalWaitingTime / numProcesses;
  
    setAverageTurnaroundTime(averageTurnaroundTime);
    setAverageWaitTime(averageWaitTime);
  };
  
  const calculateNonPreemptivePriority = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.priority - b.priority);
    let currentTime =  0;
    let totalWaitingTime =  0;
    let totalTurnaroundTime =  0;

    sortedProcesses.forEach((process, index) => {
      if (process.arrivalTime > currentTime) {
        currentTime = process.arrivalTime;
      }
      process.waitTime = currentTime - process.arrivalTime;
      totalWaitingTime += process.waitTime;
      currentTime += process.burstTime;
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      totalTurnaroundTime += process.turnaroundTime;
    });

    const updatedProcesses = sortedProcesses.map((process) => ({ ...process }));
    setProcesses(updatedProcesses);

    setAverageTurnaroundTime(totalTurnaroundTime / processes.length);
    setAverageWaitTime(totalWaitingTime / processes.length);
  };

  const calculatePreemptivePriority = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.priority - b.priority);
    let currentTime =   0;
    let totalWaitingTime =   0;
    let totalTurnaroundTime =   0;
  
    while (sortedProcesses.length >   0) {
      let highestPriority = sortedProcesses[0];
      for (let i =   0; i < sortedProcesses.length; i++) {
        if (sortedProcesses[i].priority > highestPriority.priority) {
          highestPriority = sortedProcesses[i];
        }
      }
  
      if (highestPriority.arrivalTime > currentTime) {
        currentTime = highestPriority.arrivalTime;
      }
      highestPriority.waitTime = currentTime - highestPriority.arrivalTime;
      totalWaitingTime += highestPriority.waitTime;
      currentTime += highestPriority.burstTime;
      highestPriority.completionTime = currentTime;
      highestPriority.turnaroundTime = highestPriority.completionTime - highestPriority.arrivalTime;
      totalTurnaroundTime += highestPriority.turnaroundTime;
  
      sortedProcesses.splice(sortedProcesses.indexOf(highestPriority),   1);
    }
  
    const updatedProcesses = processes.map((process) => ({ ...process }));
    setProcesses(updatedProcesses);
  
    setAverageTurnaroundTime(totalTurnaroundTime / processes.length);
    setAverageWaitTime(totalWaitingTime / processes.length);
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    switch (selectedAlgo) {
      case 'FCFS':
        calculateFCFS();
        break;
      case 'SJN':
        calculateSJN();
        break;
      case 'RR':
        calculateRR();
        break;
      case 'Priority (non-preemptive)':
        calculateNonPreemptivePriority();
        break;
      case 'Priority (preemptive)':
        calculatePreemptivePriority();
        break;
      default:
        break;
    }
  };

  const handleQuantumChange = (event) => {
    setQuantum(parseInt(event.target.value,  10));
  };

  const handleInputChange = (id, type, value) => {
    const updatedProcesses = processes.map((process) => {
      if (process.id === id) {
        return {
          ...process,
          [type]: parseInt(value,  10)
        };
      }
      return process;
    });
    setProcesses(updatedProcesses);
  };


return (
  <div className="px-4 grid gap-4">
    <div className="border rounded-lg">
      <div className="flex items-center gap-2 p-4">
        <div className="flex items-center space-x-2">
          <Label className="min-width-0" htmlFor="algorithm">
            Select Algorithm
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-expanded="true"
                aria-haspopup="true"
                className="ml-auto"
                id="algorithm"
                size="sm">
                <span className="hidden md:inline">{selectedAlgo}</span>
                <span className="md:hidden">A</span>
                <div className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-1 w-36">
              <DropdownMenuItem value="fcfs" onClick={() => setSelectedAlgo('FCFS')}>First Come First Serve</DropdownMenuItem>
              <DropdownMenuItem value="sjn" onClick={() => setSelectedAlgo('SJN')}>Shortest Job Next</DropdownMenuItem>
              <DropdownMenuItem value="rr" onClick={() => setSelectedAlgo('RR')}>Round Robin</DropdownMenuItem>
              <DropdownMenuItem value="priority-nonpreemptive" onClick={() => setSelectedAlgo('Priority (non-preemptive)')}>Priority(non-preemptive)</DropdownMenuItem>
              <DropdownMenuItem value="priority-preemptive" onClick={() => setSelectedAlgo('Priority (preemptive)')}>Priority (preemptive)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
    <div className="border rounded-lg">
      <div className="flex items-center justify-between p-4">
        <div className="font-medium">Processes</div>
        <hr />
        <Button className="w-8 h-8" size="icon" variant="ghost">
          <div className="w-4 h-4" />
          <span className="sr-only">Add</span>
        </Button>
      </div>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Burst Time</TableHead>
              {(selectedAlgo === 'Priority (non-preemptive)' || selectedAlgo === 'Priority (preemptive)') && <TableHead>Priority</TableHead>}
              <TableHead>Completion Time</TableHead>
              <TableHead>Turn Around Time</TableHead>
              <TableHead>Wait Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => (
              <TableRow key={process.id}>
                <TableCell>{process.id}</TableCell>
                <TableCell>
                  <Input
                    value={inputValues[`arrival-${process.id}`] || process.arrivalTime || ""}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        [`arrival-${process.id}`]: e.target.value,
                      })
                    }
                    onBlur={(e) => handleInputChange(process.id, 'arrivalTime', e.target.value)}
                    id={`arrival-${process.id}`}
                    size="sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={inputValues[`burst-${process.id}`] || process.burstTime || ""}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        [`burst-${process.id}`]: e.target.value,
                      })
                    }
                    onBlur={(e) => handleInputChange(process.id, 'burstTime', e.target.value)}
                    id={`burst-${process.id}`}
                    size="sm"
                  />
                </TableCell>
                {(selectedAlgo === 'Priority (non-preemptive)' || selectedAlgo === 'Priority (preemptive)') && (
                  <TableCell>
                    <Input
                      value={inputValues[`priority-${process.id}`] || process.priority || ""}
                      onChange={(e) =>
                        setInputValues({
                          ...inputValues,
                          [`priority-${process.id}`]: e.target.value,
                        })
                      }
                      onBlur={(e) => handleInputChange(process.id, 'priority', e.target.value)}
                      id={`priority-${process.id}`}
                      size="sm"
                    />
                  </TableCell>
                )}
                <TableCell>
                  <Input value={process.completionTime} size="sm" disabled />
                </TableCell>
                <TableCell>
                  <Input value={process.turnaroundTime} size="sm" disabled />
                </TableCell>
                <TableCell>
                  <Input value={process.waitTime} size="sm" disabled />
                </TableCell>
                <TableCell>
                  <Button onClick={() => deleteProcess(process.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4">
        <Button onClick={addProcess} size="sm">Add Process</Button>
      </div>
    </div>
    {selectedAlgo === 'RR' && (
      <div className="border rounded-lg p-4">
        <Label htmlFor="quantum">Quantum:</Label>
        <Input
          type="number"
          id="quantum"
          name="quantum"
          value={quantum}
          onChange={handleQuantumChange}
          className="w-20 ml-2"
          size="sm"
        />
      </div>
    )}
    <Button onClick={handleSubmit} size="lg">Submit</Button>
    {averageTurnaroundTime !==   0 && averageWaitTime !==   0 && (
      <div className="mt-4">
        <p>Average Turnaround Time: {averageTurnaroundTime}</p>
        <p>Average Wait Time: {averageWaitTime}</p>
        <GanttChart processes={processes} />
      </div>
    )}
  </div>
);
}  