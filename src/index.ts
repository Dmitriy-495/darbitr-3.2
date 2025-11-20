import { Main } from './main.js';

console.log('🚀 DT ARBITR 3.2 - Запуск...');

// 🛑 Безопасный выход
process.on('SIGINT', () => {
    console.log('\n🛑 Выход...');
    process.exit(0);
});

// 🚀 ЗАПУСК
const main = new Main();
main.start();
