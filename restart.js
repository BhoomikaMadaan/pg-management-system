const { exec } = require('child_process');
const path = require('path');

console.log('Killing existing node processes...');

// Kill on Windows
exec('taskkill /F /IM node.exe /T', (err) => {
    console.log('Processes terminated');
    setTimeout(() => {
        console.log('\nStarting backend server...\n');
        process.chdir(path.join(__dirname, 'backend'));
        exec('npm run dev', { stdio: 'inherit' });
    }, 2000);
});
