// In-memory status (resets on cold start, but fine for demo)
let status = {
  project: null,
  status: "idle",
  startTime: null,
  agents: {
    atlas: { status: "idle", location: "bar", tokens: 0, task: null },
    nova: { status: "idle", location: "bar", tokens: 0, task: null },
    sage: { status: "idle", location: "bar", tokens: 0, task: null },
    phoenix: { status: "idle", location: "bar", tokens: 0, task: null },
    shadow: { status: "idle", location: "bar", tokens: 0, task: null },
    echo: { status: "idle", location: "bar", tokens: 0, task: null },
    bolt: { status: "idle", location: "bar", tokens: 0, task: null },
    scribe: { status: "idle", location: "bar", tokens: 0, task: null }
  },
  logs: [],
  console: [],
  stats: { totalTokens: 0, totalCost: 0, tasksComplete: 0, totalTasks: 8 }
};

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json(status);
  }
  
  if (req.method === 'POST') {
    const update = req.body;
    
    // Merge update into status
    if (update.project !== undefined) status.project = update.project;
    if (update.status !== undefined) status.status = update.status;
    if (update.startTime !== undefined) status.startTime = update.startTime;
    if (update.stats) status.stats = { ...status.stats, ...update.stats };
    
    // Update specific agent
    if (update.agent && update.agentData) {
      status.agents[update.agent] = { ...status.agents[update.agent], ...update.agentData };
    }
    
    // Add log
    if (update.log) {
      status.logs.push(update.log);
      if (status.logs.length > 50) status.logs.shift();
    }
    
    // Add console
    if (update.console) {
      status.console.push(update.console);
      if (status.console.length > 50) status.console.shift();
    }
    
    // Full reset
    if (update.reset) {
      status = {
        project: update.project || null,
        status: "running",
        startTime: new Date().toISOString(),
        agents: {
          atlas: { status: "idle", location: "entrance", tokens: 0, task: null },
          nova: { status: "idle", location: "entrance", tokens: 0, task: null },
          sage: { status: "idle", location: "entrance", tokens: 0, task: null },
          phoenix: { status: "idle", location: "entrance", tokens: 0, task: null },
          shadow: { status: "idle", location: "entrance", tokens: 0, task: null },
          echo: { status: "idle", location: "entrance", tokens: 0, task: null },
          bolt: { status: "idle", location: "entrance", tokens: 0, task: null },
          scribe: { status: "idle", location: "entrance", tokens: 0, task: null }
        },
        logs: [{ agent: null, message: "Pipeline started" }],
        console: [{ text: "Pipeline initialized", type: "success" }],
        stats: { totalTokens: 0, totalCost: 0, tasksComplete: 0, totalTasks: 8 }
      };
    }
    
    return res.status(200).json({ ok: true });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
