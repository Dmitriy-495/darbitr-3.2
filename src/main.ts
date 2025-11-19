import { ConfigLoader } from './config/loader.js';

export class Main {
    private running = true;

    start() {
        console.log('🎯 Главный модуль запущен');
        this.mainLoop();
    }

    private async mainLoop() {
        let cycle = 0;
        while (this.running) {
            cycle++;
            console.log(`\n♻️ Цикл ${cycle} - ${new Date().toLocaleTimeString()}`);
            
            // 🎯 ДИНАМИЧЕСКАЯ ЗАГРУЗКА КОНФИГОВ КАЖДЫЙ ЦИКЛ
            const exchanges = ConfigLoader.loadEnabledExchanges();
            const actives = ConfigLoader.loadEnabledActives();
            
            console.log(`📊 Мониторинг ${actives.length} пар на ${exchanges.length} биржах`);
            
            if (actives.length > 0 && exchanges.length > 0) {
                this.printPrices(actives, exchanges);
            } else {
                console.log('⚠️ Нет активных пар или бирж. Проверьте папки *_enabled');
            }
            
            // ⏱️ ОЖИДАНИЕ 10 СЕКУНД
            await this.delay(10000);
        }
    }

    private printPrices(actives: any[], exchanges: any[]) {
        for (const active of actives) {
            console.log(`\n${active.symbol}:`);
            
            for (const exchange of exchanges) {
                // 🎯 ГЕНЕРАЦИЯ ЦЕНЫ НА ОСНОВЕ ДАННЫХ ИЗ КОНФИГОВ
                const price = this.generatePrice(active, exchange);
                const change = (Math.random() * 4 - 2).toFixed(2);
                
                console.log(`  ${exchange.name}: $${price} (${change}%)`);
            }
        }
    }

    private generatePrice(active: any, exchange: any): string {
        // 🎯 БАЗОВАЯ ЦЕНА ИЗ КОНФИГА АКТИВА (ЕСЛИ ЕСТЬ)
        const basePrice = active.base_price || this.getDefaultBasePrice(active.symbol);
        
        // 🎯 КОРРЕКЦИЯ НА ОСНОВЕ ВЕСА БИРЖИ И ВОЛАТИЛЬНОСТИ
        const exchangeWeight = exchange.weight || 1.0;
        const volatility = active.volatility || 2.0;
        
        const correction = exchangeWeight + (Math.random() - 0.5) * (volatility / 100);
        const price = basePrice * correction;
        
        return price.toFixed(2);
    }

    private getDefaultBasePrice(symbol: string): number {
        // 🎯 РЕЗЕРВНЫЕ ЦЕНЫ ТОЛЬКО ДЛЯ ТЕСТА
        const defaults: { [key: string]: number } = {
            'BTCUSDT': 50000,
            'ETHUSDT': 3000,
            'SOLUSDT': 100,
            'ADAUSDT': 0.5
        };
        
        return defaults[symbol] || 10 + Math.random() * 100;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.running = false;
        console.log('🛑 Главный модуль остановлен');
    }
}
