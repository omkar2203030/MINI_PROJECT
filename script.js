let processes = [];
function toggleTQ() {
  const algo = document.getElementById("algorithm").value;

  // Show TQ only for RR
  document.getElementById("tqContainer").style.display =
    algo === "rr" ? "block" : "none";

  // Show Priority input only for Priority Scheduling
  document.getElementById("priorityContainer").style.display =
    algo === "priority" ? "block" : "none";
  document.getElementById("priorityHeader").style.display =
    algo === "priority" ? "" : "none";
}

function runSelectedAlgorithm() {
  const algo = document.getElementById("algorithm").value;
  if (algo === "fcfs") {
    calculateFCFS();
  } else if (algo === "sjf") {
    calculateSJF();
  } else if (algo === "priority") {
    calculatePriority();
  } else if (algo === "rr") {
    const tq = parseInt(document.getElementById("timeQuantum").value);
    if (isNaN(tq) || tq <= 0) {
      alert("Please enter a valid time quantum!");
      return;
    }
    calculateRR(tq);
  }
}
function generateColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r},${g},${b},0.6)`;
}

function addProcess() {
  const at = document.getElementById("arrival").value;
  const bt = document.getElementById("burst").value;
  const algo = document.getElementById("algorithm").value;
  const pr = document.getElementById("priority").value;

  if (at === "" || bt === "") {
    alert("Please enter Arrival and Burst Time.");
    return;
  }

  if (algo === "priority" && pr === "") {
    alert("Please enter Priority!");
    return;
  }

  const pid = processes.length + 1;
  console.log(pid);
  const color = generateColor();

  processes.push({
    pid,
    at: parseInt(at),
    bt: parseInt(bt),
    priority: algo === "priority" ? parseInt(pr) : null,
    color,
  });

  renderInputTable();
  document.getElementById("arrival").value = "";
  document.getElementById("burst").value = "";
  document.getElementById("priority").value = "";
}

function removeProcess(id) {
  processes = processes.filter((p) => p.pid !== id);
  renderInputTable();
}

function renderInputTable() {
  const algo = document.getElementById("algorithm").value;
  const table = document.querySelector("#inputTable tbody");
  table.innerHTML = "";
  processes.forEach((p, index) => {
    p.pid = index + 1;
    table.innerHTML += `
      <tr>
        <td>${p.pid}</td>
        <td>${p.at}</td>
        <td>${p.bt}</td>
        ${
          algo === "priority"
            ? `<td>${p.priority}</td>`
            : '<td style="display:none;"></td>'
        }
        <td><div style="width: 40px; height: 20px; margin: auto; background-color: ${
          p.color
        }; border-radius: 4px;"></div></td>
        <td><button class="btn btn-link p-0 text-danger" onclick="removeProcess(${
          p.pid
        })">Remove</button></td>
      </tr>`;
  });
}

function renderOutputTable(output) {
  let totalTat = 0,
    totalWt = 0;
  const outTable = document.querySelector("#outputTable tbody");
  outTable.innerHTML = "";
  output.forEach((p) => {
    outTable.innerHTML += `
      <tr>
        <td>${p.pid}</td>
        <td>${p.at}</td>
        <td>${p.bt}</td>
        <td>${p.ct}</td>
        <td>${p.tat}</td>
        <td>${p.wt}</td>
      </tr>`;
    totalTat += p.tat;
    totalWt += p.wt;
  });
  document.getElementById("avgTat").innerText = (
    totalTat / output.length
  ).toFixed(2);
  document.getElementById("avgWt").innerText = (
    totalWt / output.length
  ).toFixed(2);
}

function renderGanttChart(output) {
  const gantt = document.getElementById("ganttChart");
  const times = document.getElementById("ganttTimes");

  gantt.innerHTML = "";
  times.innerHTML = "";

  let lastTime = output[0]?.start ?? 0;

  output.forEach((p) => {
    // Create Gantt box
    const box = document.createElement("div");
    box.className = "gantt-box";
    box.style.backgroundColor = p.color;
    box.innerText = `P${p.pid}`;
    gantt.appendChild(box);

    // Create time label for the left edge
    const timeLabel = document.createElement("div");
    timeLabel.className = "time-label";
    timeLabel.innerText = lastTime;
    times.appendChild(timeLabel);

    lastTime = p.ct;
  });

  // Add final end time
  const timeLabel = document.createElement("div");
  timeLabel.className = "time-label";
  timeLabel.innerText = lastTime;
  times.appendChild(timeLabel);
}

function calculateFCFS() {
  const sorted = [...processes].sort((a, b) => a.at - b.at);
  let time = 0;
  const output = [];

  sorted.forEach((p) => {
    const start = Math.max(time, p.at);
    const ct = start + p.bt;
    const tat = ct - p.at;
    const wt = tat - p.bt;
    output.push({ ...p, start, ct, tat, wt });
    time = ct;
  });

  renderOutputTable(output);
  renderGanttChart(output);
}

function calculateSJF() {
  const sorted = [...processes].sort((a, b) => a.at - b.at);
  const ready = [];
  const output = [];
  let time = 0;

  while (sorted.length > 0 || ready.length > 0) {
    while (sorted.length > 0 && sorted[0].at <= time) {
      ready.push(sorted.shift());
    }
    if (ready.length === 0) {
      time = sorted[0].at;
      continue;
    }
    ready.sort((a, b) => a.bt - b.bt);
    const p = ready.shift();
    const start = Math.max(time, p.at);
    const ct = start + p.bt;
    const tat = ct - p.at;
    const wt = tat - p.bt;
    output.push({ ...p, start, ct, tat, wt });
    time = ct;
  }

  renderOutputTable(output);
  renderGanttChart(output);
}

function calculatePriority() {
  const sorted = [...processes].sort((a, b) => a.at - b.at);
  const ready = [];
  const output = [];
  let time = 0;

  sorted.forEach((p) => (p.priority = Math.floor(Math.random() * 10) + 1));

  while (sorted.length > 0 || ready.length > 0) {
    while (sorted.length > 0 && sorted[0].at <= time) {
      ready.push(sorted.shift());
    }
    if (ready.length === 0) {
      time = sorted[0].at;
      continue;
    }
    ready.sort((a, b) => a.priority - b.priority);
    const p = ready.shift();
    const start = Math.max(time, p.at);
    const ct = start + p.bt;
    const tat = ct - p.at;
    const wt = tat - p.bt;
    output.push({ ...p, start, ct, tat, wt });
    time = ct;
  }

  renderOutputTable(output);
  renderGanttChart(output);
}

function calculateRR(tq) {
  const queue = [];
  const output = [];
  const remaining = processes.map((p) => ({
    ...p,
    remaining: p.bt,
    originalAt: p.at, // keep original AT for final calc
  }));

  let time = Math.min(...remaining.map((p) => p.at)); // handle if first AT > 0

  // Initially enqueue processes that have arrived at time 0 or earliest AT
  remaining.sort((a, b) => a.at - b.at);
  while (remaining.length && remaining[0].at <= time) {
    queue.push(remaining.shift());
  }

  while (queue.length > 0) {
    const p = queue.shift();

    const start = Math.max(time, p.at);
    const exec = Math.min(tq, p.remaining);
    const end = start + exec;

    // First response time
    if (p.remaining === p.bt) {
      p.firstStart = start;
    }

    p.remaining -= exec;
    time = end;

    // Enqueue new arrivals during this time slice
    while (remaining.length && remaining[0].at <= time) {
      queue.push(remaining.shift());
    }

    if (p.remaining > 0) {
      // Put back in queue with updated ready time
      p.at = time;
      queue.push(p);
    } else {
      // Finished!
      p.ct = time;
      p.tat = p.ct - p.originalAt;
      p.wt = p.tat - p.bt;
      output.push({
        pid: p.pid,
        at: p.originalAt,
        bt: p.bt,
        start: p.firstStart,
        ct: p.ct,
        tat: p.tat,
        wt: p.wt,
        color: p.color,
      });
    }

    // If queue is empty but processes remain, jump to next AT
    if (queue.length === 0 && remaining.length) {
      time = Math.max(time, remaining[0].at);
      while (remaining.length && remaining[0].at <= time) {
        queue.push(remaining.shift());
      }
    }
  }

  renderOutputTable(output);
  renderGanttChart(output);
}
