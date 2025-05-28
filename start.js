const { spawn } = require('child_process');

console.log('🚀 Запускаем приложение Panda...');

const child = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('❌ Ошибка запуска:', error);
});

child.on('close', (code) => {
  console.log(`📋 Процесс завершен с кодом ${code}`);
});