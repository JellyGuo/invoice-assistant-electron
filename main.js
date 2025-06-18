const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProc = null;
let win = null;

function startBackend() {
  const exePath = path.join(process.resourcesPath, 'app', 'backend', 'main');
  backendProc = spawn(exePath);

  backendProc.stdout.on('data', (data) => {
    console.log(`[FastAPI stdout] ${data}`);
  });

  backendProc.stderr.on('data', (data) => {
    console.error(`[FastAPI stderr] ${data}`);
  });

  backendProc.on('exit', (code) => {
    console.log(`FastAPI exited with code ${code}`);
    backendProc = null;
  });
}

function createWindowImmediately() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(process.resourcesPath, 'app', 'frontend', 'index.html'));

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindowImmediately();
});

app.on('before-quit', () => {
  if (backendProc) {
    backendProc.kill();
    backendProc = null;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindowImmediately();
  }
});


