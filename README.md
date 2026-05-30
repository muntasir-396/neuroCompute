🚀 NeuroCompute: GPU Cluster Job Scheduler
![alt text](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

![alt text](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![alt text](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
NeuroCompute is a sophisticated, real-time visualizer that demonstrates how classic CPU scheduling algorithms can be applied to manage GPU clusters in modern Machine Learning (MLOps) environments.
🧠 The Problem
In AI research labs and tech startups, GPUs are expensive, highly-contended shared resources. When a researcher submits a massive 200-epoch deep learning training job, it often blocks other engineers' quick validation scripts or causes severe latency for live inference requests. NeuroCompute simulates this exact problem and visualizes how different scheduling algorithms handle the throughput, fairness, and execution of ML workloads.
✨ Key Features
Real-Time 8-Core GPU Simulation: Visually tracks the utilization, power draw, and temperature of an 8x RTX 3080 cluster.
5 Scheduling Algorithms: Dynamically switch between FCFS, SJF, SRTF, Priority Queue, and Round Robin while the simulation runs.
Realistic ML Workloads: Automatically generate job mixes including Deep Learning Training, Hyperparameter Tuning, and Model Inference, or submit jobs manually.
Comprehensive Metrics: Tracks average waiting time, turnaround time, cluster utilization, power consumption, and context switch overhead.
Preemption & Aging Engine: Features advanced preemptive logic (for SRTF and Round Robin) and priority aging to prevent job starvation.
⚙️ Algorithms Implemented
Algorithm	Type	Behavior in NeuroCompute
FCFS (First Come First Serve)	Non-Preemptive	Processes jobs strictly in the order they arrive. Simple, but long training jobs will block quick inference tasks.
SJF (Shortest Job First)	Non-Preemptive	Prioritizes jobs with the shortest burst time (e.g., quick hyperparameter tuning). Highly efficient but risks starving massive training jobs.
SRTF (Shortest Remaining Time First)	Preemptive	Will pause a running 100-minute job if a 5-minute job arrives, prioritizing the absolute fastest completion times.
Priority Queue (w/ Aging)	Preemptive/Dynamic	Jobs are sorted by Tier (Premium/Critical > Regular > Free). Jobs waiting too long gradually "age" into a higher priority to prevent starvation.
Round Robin	Preemptive	Cycles through all active jobs with a fixed time quantum. Highly fair for interactive computing, but introduces high context-switch overhead.
🛠️ Tech Stack
Frontend Framework: React 19 + TypeScript
Styling: Tailwind CSS + custom UI components
Icons: Lucide React
Charts & Data Viz: Recharts (Area charts for historical performance analysis)
Build Tool: Vite
🚀 Getting Started
To run this project locally:
1. Clone the repository
code
Bash
git clone https://github.com/yourusername/neurocompute.git
cd neurocompute
2. Install dependencies
code
Bash
npm install
3. Run the development server
code
Bash
npm run dev
4. Open your browser
Navigate to http://localhost:3000 or the port provided by Vite in your terminal.
📈 Exploring the Simulation
Submit a massive job: Add a Deep Learning Training job for 120 minutes using the sidebar.
Block the queue: Submit several small Model Inference jobs (1-5 minutes).
Observe FCFS: Note how the small jobs wait indefinitely.
Switch to SRTF: Watch the system aggressively pause the massive job to let the small inference jobs finish instantly, reducing the overall average waiting time.
Built with ❤️ to demonstrate the intersection of Operating Systems concepts and modern ML Infrastructure.

<img width="1600" height="739" alt="image" src="https://github.com/user-attachments/assets/6d41c636-6bec-49dd-a411-257d8115d60f" />
<img width="1600" height="730" alt="image" src="https://github.com/user-attachments/assets/e805cfa4-a9c1-4ca1-893a-00d841f5f39d" />


