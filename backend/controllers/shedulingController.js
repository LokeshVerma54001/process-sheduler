// controllers/fcfsController.js
exports.fcfs = (req, res) => {
    const processes = req.body.processes;
    processes.sort((a, b) => a.arrival - b.arrival);
  
    let currentTime = 0;
    let result = "<div class='flex gap-2'>";
  
    processes.forEach((p) => {
      const start = Math.max(currentTime, p.arrival);
      const end = start + p.burst;
      result += `<div class='bg-blue-500 text-white px-4 py-2 rounded'>${p.name} (${start}-${end})</div>`;
      currentTime = end;
    });
  
    result += "</div>";
    res.json({ result });
  };
  
  // controllers/sjfController.js
  exports.sjf = (req, res) => {
    let processes = req.body.processes.map(p => ({ ...p }));
    let currentTime = 0;
    let result = "<div class='flex gap-2'>";
    const completed = [];
  
    while (processes.length > 0) {
      let available = processes.filter(p => p.arrival <= currentTime);
      if (available.length === 0) {
        currentTime = processes[0].arrival;
        continue;
      }
      available.sort((a, b) => a.burst - b.burst);
      const current = available[0];
      const start = currentTime;
      const end = start + current.burst;
      result += `<div class='bg-green-500 text-white px-4 py-2 rounded'>${current.name} (${start}-${end})</div>`;
      currentTime = end;
      processes = processes.filter(p => p !== current);
      completed.push(current);
    }
  
    result += "</div>";
    res.json({ result });
  };
  
  // controllers/rrController.js
  exports.rr = (req, res) => {
    const { processes, timeQuantum } = req.body;
    const queue = [...processes.map(p => ({ ...p, remaining: p.burst }))];
    let currentTime = 0;
    let result = "<div class='flex gap-2'>";
    const readyQueue = [];
  
    while (queue.length > 0 || readyQueue.length > 0) {
      while (queue.length > 0 && queue[0].arrival <= currentTime) {
        readyQueue.push(queue.shift());
      }
  
      if (readyQueue.length === 0) {
        currentTime = queue[0]?.arrival || currentTime;
        continue;
      }
  
      const current = readyQueue.shift();
      const execTime = Math.min(current.remaining, timeQuantum);
      const start = currentTime;
      const end = start + execTime;
      result += `<div class='bg-yellow-500 text-white px-4 py-2 rounded'>${current.name} (${start}-${end})</div>`;
      currentTime = end;
      current.remaining -= execTime;
  
      while (queue.length > 0 && queue[0].arrival <= currentTime) {
        readyQueue.push(queue.shift());
      }
  
      if (current.remaining > 0) readyQueue.push(current);
    }
  
    result += "</div>";
    res.json({ result });
  };
  
  // controllers/priorityController.js
  exports.priority = (req, res) => {
    let processes = req.body.processes.map(p => ({ ...p }));
    let currentTime = 0;
    let result = "<div class='flex gap-2'>";
  
    while (processes.length > 0) {
      let available = processes.filter(p => p.arrival <= currentTime);
      if (available.length === 0) {
        currentTime = processes[0].arrival;
        continue;
      }
      available.sort((a, b) => a.priority - b.priority);
      const current = available[0];
      const start = currentTime;
      const end = start + current.burst;
      result += `<div class='bg-purple-500 text-white px-4 py-2 rounded'>${current.name} (${start}-${end})</div>`;
      currentTime = end;
      processes = processes.filter(p => p !== current);
    }
  
    result += "</div>";
    res.json({ result });
  };
  