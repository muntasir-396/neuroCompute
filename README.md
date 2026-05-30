<div align="center">

<h1>⚡ NeuroCompute</h1>
<h3>GPU Cluster Job Scheduler & Real-Time MLOps Visualizer</h3>

<p>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts" />
</p>

<p>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" />
</p>

<p><em>A sophisticated, interactive visualizer that bridges classical OS scheduling theory with modern ML infrastructure challenges — demonstrating how CPU scheduling algorithms manage GPU clusters in real-world MLOps environments.</em></p>

<br />

![NeuroCompute Dashboard](https://github.com/user-attachments/assets/6d41c636-6bec-49dd-a411-257d8115d60f)

</div>

---
Link: https://neurocompute-244954813348.asia-southeast1.run.app




## 🧠 The Problem

In AI research labs and tech companies, **GPUs are expensive, highly-contended shared resources.** When a researcher submits a massive 200-epoch deep learning training job, it can block other engineers' quick validation scripts for hours — or cause severe latency for live inference services that customers depend on.

> **NeuroCompute simulates this exact challenge.** It visualizes how different CPU scheduling algorithms, when applied to a GPU cluster, produce dramatically different outcomes in terms of throughput, fairness, waiting time, and resource utilization.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🖥️ **Real-Time 8-Core GPU Simulation** | Tracks utilization, power draw, and temperature of a simulated 8× RTX 3080 cluster |
| ⚙️ **5 Scheduling Algorithms** | Dynamically switch between FCFS, SJF, SRTF, Priority Queue, and Round Robin mid-simulation |
| 🤖 **Realistic ML Workloads** | Auto-generate or manually submit Deep Learning Training, Hyperparameter Tuning, and Inference jobs |
| 📊 **Comprehensive Metrics Dashboard** | Tracks avg. waiting time, turnaround time, cluster utilization, power consumption, and context-switch overhead |
| 🛡️ **Preemption & Aging Engine** | Advanced preemptive logic with priority aging to prevent job starvation |
| 📈 **Historical Performance Charts** | Area charts via Recharts for retrospective analysis of cluster behavior over time |

---

## ⚙️ Algorithms Implemented

<details>
<summary><strong>FCFS — First Come, First Serve</strong> (Non-Preemptive)</summary>

Processes jobs strictly in arrival order. Simple and fair in submission sequence, but a long 100-minute training job will **completely block** quick 2-minute inference tasks behind it — classic convoy effect.
</details>

<details>
<summary><strong>SJF — Shortest Job First</strong> (Non-Preemptive)</summary>

Prioritizes jobs with the shortest burst time. Maximizes throughput and minimizes average waiting time, but risks **indefinitely starving** massive training jobs if short jobs keep arriving.
</details>

<details>
<summary><strong>SRTF — Shortest Remaining Time First</strong> (Preemptive)</summary>

The preemptive variant of SJF. Will **immediately pause** a running 100-minute job the moment a 5-minute job arrives. Achieves the theoretically optimal average waiting time at the cost of high context-switch overhead.
</details>

<details>
<summary><strong>Priority Queue with Aging</strong> (Preemptive / Dynamic)</summary>

Jobs are sorted by tier — **Premium/Critical > Regular > Free**. Jobs waiting too long automatically "age" into a higher priority bracket, preventing starvation while still honoring SLA commitments.
</details>

<details>
<summary><strong>Round Robin</strong> (Preemptive)</summary>

Cycles through all active jobs with a fixed time quantum. The most **fair and interactive** algorithm — every job makes steady progress — but introduces the highest context-switch overhead and lowest pure throughput.
</details>

---

## 🛠️ Tech Stack

```
Frontend       React 19 + TypeScript
Styling        Tailwind CSS + custom UI components
Icons          Lucide React
Charts         Recharts (Area charts for historical performance)
Build Tool     Vite
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/neurocompute.git
cd neurocompute

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open your browser and navigate to the port shown in the terminal (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🖼️ Screenshots

**Cluster Overview & Real-Time Job Queue**

![Dashboard View](https://github.com/user-attachments/assets/6d41c636-6bec-49dd-a411-257d8115d60f)

**Metrics Analysis & Historical Performance**

![Metrics View](https://github.com/user-attachments/assets/e805cfa4-a9c1-4ca1-893a-00d841f5f39d)

---

## 📈 Guided Simulation Walkthrough

Try this sequence to witness the algorithms' differences firsthand:

1. **Submit a massive job** → Add a *Deep Learning Training* job with a 120-minute burst time via the sidebar.
2. **Block the queue** → Submit 4–5 small *Model Inference* jobs (1–5 minutes each).
3. **Observe with FCFS** → Watch the inference jobs wait indefinitely behind the training job.
4. **Switch to SRTF** → The system aggressively preempts the training job, completing all inference tasks almost instantly and dramatically reducing average waiting time.
5. **Try Priority Queue** → Assign inference jobs to *Critical* tier and watch them jump the queue immediately.
6. **Enable Round Robin** → Every job gets a fair time slice — notice how context-switch overhead climbs in the metrics panel.

---

## 🎓 Learning Objectives

NeuroCompute is designed as both a **portfolio project and an educational tool** for understanding:

- Classical OS process scheduling algorithms and their trade-offs
- How scheduling theory directly maps to real-world ML infrastructure (MLOps)
- The tension between **throughput, fairness, and latency** in shared compute systems
- Why starvation prevention (aging) is critical in production GPU clusters

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Open an issue to report bugs or suggest features
- Submit a pull request with improvements
- Share the project if you found it useful

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ to demonstrate the intersection of **Operating Systems theory** and **modern ML Infrastructure**

*by [Muntasir](https://github.com/yourusername) · Bangladesh University of Professionals*

</div>
