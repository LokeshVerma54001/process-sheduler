// Utility to create chart blocks
const createChartBlocks = (segments, color) => {
  return segments.map(seg => ({
    label: seg.name,
    start: seg.start,
    end: seg.end,
    color
  }));
};

// FCFS
exports.fcfs = (req, res) => {
  const processes = req.body.processes.map(p => ({ ...p }));
  processes.sort((a, b) => a.arrival - b.arrival);

  let currentTime = 0;
  const segments = [];
  const metrics = [];

  processes.forEach(p => {
    const start = Math.max(currentTime, p.arrival);
    const end = start + p.burst;

    metrics.push({
      name: p.name,
      arrival: p.arrival,
      burst: p.burst,
      completionTime: end,
      turnaroundTime: end - p.arrival,
      waitingTime: end - p.arrival - p.burst,
      responseTime: start - p.arrival
    });

    segments.push({ name: p.name, start, end });
    currentTime = end;
  });

  res.json({ chart: createChartBlocks(segments, "#3B82F6"), metrics });
};

// SJF
exports.sjf = (req, res) => {
  let processes = req.body.processes.map(p => ({ ...p }));
  let currentTime = 0;
  const segments = [];
  const metrics = [];

  while (processes.length > 0) {
    const available = processes.filter(p => p.arrival <= currentTime);
    if (available.length === 0) {
      currentTime = processes[0].arrival;
      continue;
    }

    available.sort((a, b) => a.burst - b.burst);
    const current = available[0];
    const start = currentTime;
    const end = start + current.burst;

    metrics.push({
      name: current.name,
      arrival: current.arrival,
      burst: current.burst,
      completionTime: end,
      turnaroundTime: end - current.arrival,
      waitingTime: end - current.arrival - current.burst,
      responseTime: start - current.arrival
    });

    segments.push({ name: current.name, start, end });
    currentTime = end;
    processes = processes.filter(p => p !== current);
  }

  res.json({ chart: createChartBlocks(segments, "#10B981"), metrics });
};

// Round Robin
exports.rr = (req, res) => {
  const { processes, timeQuantum } = req.body;
  const queue = [...processes.map(p => ({ ...p, remaining: p.burst }))];
  let currentTime = 0;
  const readyQueue = [];
  const finished = new Map();
  const segments = [];
  const firstResponse = {};

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

    if (!firstResponse[current.name]) {
      firstResponse[current.name] = start - current.arrival;
    }

    segments.push({ name: current.name, start, end });
    current.remaining -= execTime;
    currentTime = end;

    while (queue.length > 0 && queue[0].arrival <= currentTime) {
      readyQueue.push(queue.shift());
    }

    if (current.remaining > 0) {
      readyQueue.push(current);
    } else {
      current.completionTime = currentTime;
      finished.set(current.name, current);
    }
  }

  const metrics = [...finished.values()].map(p => {
    const turnaround = p.completionTime - p.arrival;
    const waiting = turnaround - p.burst;
    return {
      name: p.name,
      arrival: p.arrival,
      burst: p.burst,
      completionTime: p.completionTime,
      turnaroundTime: turnaround,
      waitingTime: waiting,
      responseTime: firstResponse[p.name]
    };
  });

  res.json({ chart: createChartBlocks(segments, "#F59E0B"), metrics });
};

// Priority Scheduling
exports.priority = (req, res) => {
  let processes = req.body.processes.map(p => ({ ...p }));
  let currentTime = 0;
  const segments = [];
  const metrics = [];

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

    metrics.push({
      name: current.name,
      arrival: current.arrival,
      burst: current.burst,
      completionTime: end,
      turnaroundTime: end - current.arrival,
      waitingTime: end - current.arrival - current.burst,
      responseTime: start - current.arrival
    });

    segments.push({ name: current.name, start, end });
    currentTime = end;
    processes = processes.filter(p => p !== current);
  }

  res.json({ chart: createChartBlocks(segments, "#8B5CF6"), metrics });
};
