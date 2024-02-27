'use client'
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { GanttChart } from './ganttchart';
import Image from 'next/image';
import kneelson from "../../../public/kneelson.png"
import gelo from "../../../public/gelo.png"
import edep from "../../../public/edep.jpg"
import rein from "../../../public/rein.png"
import dyl from "../../../public/dylan.jpg"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


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

  const calculateSJF = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.burstTime - b.burstTime);
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
  
  const calculateRR = () => {
    if (quantum <=   0) {
      console.error("Quantum should be a positive integer.");
      return;
    }
  
    let currentTime =   0;
    let totalWaitingTime =   0;
    let totalTurnaroundTime =   0;
    const updatedProcesses = [...processes]; 
  
    while (updatedProcesses.length >   0) {
      for (let i =   0; i < updatedProcesses.length; i++) {
        const process = updatedProcesses[i];
        const timeToExecute = Math.min(quantum, process.burstTime);
        currentTime += timeToExecute;
        process.burstTime -= timeToExecute;
  
        if (process.burstTime <=   0) {
          process.completionTime = currentTime +  1; 
          process.turnaroundTime = process.completionTime - process.arrivalTime; 
          process.waitTime = process.turnaroundTime - process.burstTime - 2; 
          totalWaitingTime += process.waitTime  ;
          totalTurnaroundTime += process.turnaroundTime;
          updatedProcesses.splice(i,   1);
          i--; 
        } else {
          updatedProcesses.push(updatedProcesses.splice(i,   1)[0]);
          i--; 
        }
      }
    }
  
    const numProcesses = processes.length;
    if (numProcesses ===   0) {
      console.error("No processes to calculate averages.");
      return;
    }
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
      case 'SJF': // Changed from 'SJN' to 'SJF'
        calculateSJF(); // Changed from calculateSJN to calculateSJF
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
  <div className="bg-white border rounded-lg">
          <Drawer>
          <DrawerTrigger>
          <a className='bg-primary text-primary-foreground h-10 px-4 py-2 h-11 rounded-md px-8 hover:underline'>
Show Authors
</a>
</DrawerTrigger>

    <DrawerContent>
      <DrawerHeader>
      <DrawerTitle className="rainbow-button" style={{ textAlign: 'center', width: '100%',  justifyContent: 'center' }}>
  <a style={{fontSize:20}}>  Operating Systems Prelim Exam Submission By: </a>
  </DrawerTitle>
  <DrawerDescription style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '25px' }}>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
  <a href="https://github.com/Kneel-soN" target="_blank" rel="noopener noreferrer">
    <Image src={kneelson} width={100} height={100} className="rounded-image" />
  </a>
  <a href="https://github.com/Kneel-soN" target="_blank" rel="noopener noreferrer">
    <span className='span-right'>Neilson Diñoso</span>
  </a>
</div>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
  <a href="https://github.com/franzivanedep" target="_blank" rel="noopener noreferrer">
    <Image src={edep} width={100} height={100} className="rounded-image" />
  </a>
  <a href="https://github.com/franzivanedep" target="_blank" rel="noopener noreferrer">
    <span className='span-right'>Franz Ivan Edep</span>
  </a>
</div>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
  <a href="https://github.com/I-Drink-Coffee" target="_blank" rel="noopener noreferrer">
    <Image src={gelo} width={100} height={100} className="rounded-image" />
  </a>
  <a href="https://github.com/I-Drink-Coffee" target="_blank" rel="noopener noreferrer">
    <span className='span-right'>Angelo De Vera</span>
  </a>
</div>

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
  <a href="https://web.facebook.com/dylanpangilinan30" target="_blank" rel="noopener noreferrer">
    <Image src={dyl} width={100} height={100} className="rounded-image" />
  </a>
  <a href="https://web.facebook.com/dylanpangilinan30" target="_blank" rel="noopener noreferrer">
    <span className='span-right'>Dylan Pangilinan</span>
  </a>
</div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
  <a href="https://web.facebook.com/reinier.mariscotes.94" target="_blank" rel="noopener noreferrer">
    <Image src={rein} width={100} height={100} className="rounded-image" />
  </a>
  <a href="https://web.facebook.com/reinier.mariscotes.94" target="_blank" rel="noopener noreferrer">
    <span className='span-right'>Reinier Mariscotes</span>
  </a>
</div>

</DrawerDescription>





      </DrawerHeader>
      <DrawerFooter>
        <DrawerClose>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
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
              <DropdownMenuItem value="sjf" onClick={() => setSelectedAlgo('SJF')}>Shortest Job First</DropdownMenuItem>
              <DropdownMenuItem value="rr" onClick={() => setSelectedAlgo('RR')}>Round Robin</DropdownMenuItem>
              <DropdownMenuItem value="priority-nonpreemptive" onClick={() => setSelectedAlgo('Priority (non-preemptive)')}>Priority(non-preemptive)</DropdownMenuItem>
              <DropdownMenuItem value="priority-preemptive" onClick={() => setSelectedAlgo('Priority (preemptive)')}>Priority (preemptive)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
    <div className="gap-2 p-4border rounded-lg">
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


