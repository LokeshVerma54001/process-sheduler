import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [processes, setProcesses] = useState([
    { name: "P1", arrival: 0, burst: 4, priority: 1 },
    { name: "P2", arrival: 1, burst: 3, priority: 2 },
  ]);
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(2); // Only used in Round Robin
  const [result, setResult] = useState("");

  const handleChange = (index, key, value) => {
    const newProcesses = [...processes];
    newProcesses[index][key] = key === "name" ? value : parseInt(value);
    setProcesses(newProcesses);
  };

  const addRow = () => {
    setProcesses([
      ...processes,
      { name: `P${processes.length + 1}`, arrival: 0, burst: 1, priority: 1 },
    ]);
  };

  const simulate = async () => {
    try {
      const payload = { processes };

      if (algorithm === "rr") {
        payload.timeQuantum = timeQuantum;
      }

      const response = await axios.post(`http://localhost:5000/api/${algorithm}`, payload);
      setResult(response.data.result);
    } catch (err) {
      setResult("Error fetching simulation results. " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Process Scheduling Visualizer
        </h1>

        {/* Dropdown for Algorithm Selection */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Select Algorithm:</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="fcfs">First Come First Serve (FCFS)</option>
            <option value="sjf">Shortest Job First (SJF)</option>
            <option value="rr">Round Robin (RR)</option>
            <option value="priority">Priority Scheduling</option>
          </select>
        </div>

        {/* Time Quantum input if Round Robin */}
        {algorithm === "rr" && (
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Time Quantum:</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
            />
          </div>
        )}

        {/* Process Table */}
        <table className="w-full mb-4 border border-gray-200">
          <thead className="bg-blue-100">
            <tr className="text-center">
              <th className="py-2">Process</th>
              <th className="py-2">Arrival Time</th>
              <th className="py-2">Burst Time</th>
              {algorithm === "priority" && <th className="py-2">Priority</th>}
            </tr>
          </thead>
          <tbody>
            {processes.map((p, idx) => (
              <tr key={idx} className="text-center">
                <td>
                  <input
                    className="border rounded px-2 py-1"
                    type="text"
                    value={p.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="border rounded px-2 py-1"
                    type="number"
                    value={p.arrival}
                    onChange={(e) => handleChange(idx, "arrival", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="border rounded px-2 py-1"
                    type="number"
                    value={p.burst}
                    onChange={(e) => handleChange(idx, "burst", e.target.value)}
                  />
                </td>
                {algorithm === "priority" && (
                  <td>
                    <input
                      className="border rounded px-2 py-1"
                      type="number"
                      value={p.priority}
                      onChange={(e) => handleChange(idx, "priority", e.target.value)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mb-4">
          <button
            onClick={addRow}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Process
          </button>
          <button
            onClick={simulate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Simulate
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-6 bg-blue-100 p-4 rounded border border-blue-300">
            <h3 className="text-lg font-semibold mb-2">Gantt Chart</h3>
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
        )}
      </div>
    </div>
  );
}
