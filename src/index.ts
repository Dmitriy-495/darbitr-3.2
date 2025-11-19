import { DB } from './database/connection.js';
import { ConfigLoader } from './config/loader.js';

console.log('🚀 DT ARBITR 3.2 - Apache/Nginx Symlinks');

let running = true;

// 🛑 Выход
process.on('SIGINT', () => {
    console.log('\n🛑 Выход');
    running = false;
    DB.close();
    process.exit(0);
});

// ♻️ Главный цикл
async function main() {
    // 🎯 АКТИВИРУЕМ БИРЖИ И ПАРЫ ПРИ ПЕРВОМ ЗАПУСКЕ
    const availableExchanges = ConfigLoader.loadAvailableExchanges();
    if (availableExchanges.length > 0 && ConfigLoader.loadEnabledExchanges().length === 0) {
        console.log('🔧 Первая настройка...');
        ConfigLoader.enableExchange('binance');
        ConfigLoader.enableActive('btcusdt');
    }

    // 🎯 ЗАГРУЗКА АКТИВНЫХ КОНФИГОВ
    const exchanges = ConfigLoader.loadEnabledExchanges();
    const actives = ConfigLoader.loadEnabledActives();
    
    console.log(`✅ Биржи: ${exchanges.map(e => e.code).join(', ')}`);
    console.log(`✅ Пары: ${actives.map(a => a.symbol).join(', ')}`);
    console.log('🎯 Используются симлинки из *_enabled папок\n');
    
    const battle = parseInt(await DB.get('battle_time')) || 5000;
    const break_ = parseInt(await DB.get('break_time')) || 1000;

    let cycle = 0;
    while (running) {
        cycle++;
        console.log(`♻️ ${cycle}: Мониторинг ${actives.length} пар`);
        await new Promise(r => setTimeout(r, battle));
        if (!running) break;
        console.log(`💾 Анализ арбитража`);
        await new Promise(r => setTimeout(r, break_));
    }
}

main();
