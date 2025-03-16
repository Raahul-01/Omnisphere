const { spawn } = require('child_process');
const path = require('path');

// Function to start the Next.js server
function startNextServer() {
    const nextServer = spawn('npm', ['run', 'start'], {
        stdio: 'inherit',
        shell: true
    });

    nextServer.on('error', (err) => {
        console.error('Failed to start Next.js server:', err);
    });

    return nextServer;
}

// Function to start the Flask server
function startFlaskServer() {
    const flaskServer = spawn('python', ['app.py'], {
        stdio: 'inherit',
        shell: true
    });

    flaskServer.on('error', (err) => {
        console.error('Failed to start Flask server:', err);
    });

    return flaskServer;
}

// Start both servers
console.log('Starting servers...');
const next = startNextServer();
const flask = startFlaskServer();

// Handle process termination
process.on('SIGINT', () => {
    next.kill();
    flask.kill();
    process.exit();
});

process.on('SIGTERM', () => {
    next.kill();
    flask.kill();
    process.exit();
}); 