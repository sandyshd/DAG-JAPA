module.exports = {
  apps: [{
    name: "dag-japa-nextjs",
    script: "./node_modules/.next/standalone/server.js",
    cwd: "/home/username/public_html/developing.africa",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      HOSTNAME: "0.0.0.0"
    },
    instances: 1,
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "500M",
    merge_logs: true,
    error_file: "./logs/error.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time_format: "YYYY-MM-DD HH:mm:ss Z",
    autorestart: true,
    max_restarts: 10,
    min_uptime: "10s"
  }]
};
