'use client'
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export function Algoselect() {
  const [processes, setProcesses] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState("FCFS");
  const [inputValues, setInputValues] = useState({});

  const addProcess = () => {
    const newId = processes.length +   1;
    setProcesses([...processes, { id: newId, arrivalTime:   0, burstTime:  0 }]);
  };

  const deleteProcess = (id) => {
    const updatedProcesses = processes.filter((process) => process.id !== id);
    const reindexedProcesses = updatedProcesses.map((process, index) => ({
      ...process,
      id: index +   1,
    }));
    setProcesses(reindexedProcesses);
  };

  const calculateFCFS = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime =   0;
    const waitingTimes = {};
    const turnaroundTimes = {};

    sortedProcesses.forEach((process) => {
      if (process.arrivalTime > currentTime) {
        currentTime = process.arrivalTime;
      }
      waitingTimes[process.id] = currentTime - process.arrivalTime;
      currentTime += process.burstTime;
      turnaroundTimes[process.id] = currentTime - process.arrivalTime;
    });

    const updatedProcesses = processes.map((process) => ({
      ...process,
      waitingTime: waitingTimes[process.id],
      completionTime: turnaroundTimes[process.id],
      turnaroundTime: turnaroundTimes[process.id],
    }));

    setProcesses(updatedProcesses);
    console.log(updatedProcesses)
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
                      id={`burst-${process.id}`}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input defaultValue={process.completionTime} id={`arrival-${process.id}`} size="sm" disabled/>
                  </TableCell>
                  <TableCell>
                    <Input defaultValue={process.turnAroundTime} id={`arrival-${process.id}`} size="sm" disabled/>
                  </TableCell>
                  <TableCell>
                    <Input defaultValue={process.waitTime} id={`arrival-${process.id}`} size="sm" disabled/>
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
      <Button onClick={calculateFCFS} size="lg">Submit</Button>
    </div>
  );
}
