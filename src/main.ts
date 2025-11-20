import { ConfigLoader } from './config/loader.js';

export class Main {
    private running = true;

    start() {
        console.log('🎯 Главный модуль запущен');
        this.mainLoop();
    }

    private async mainLoop() {
        const exchanges = ConfigLoader.loadEnabledExchanges();
        const actives = ConfigLoader.loadEnabledActives();

        console.log(`📊 Мониторинг ${actives.length} пар на ${exchanges.length} биржах`);
        
        let cycle = 0;
        while (this.running) {
            cycle++;
            console.log(`\n♻️ Цикл ${cycle} - ${new Date().toLocaleTimeString()}`);
            
            // 🎯 ВЫВОД ЦЕН
            this.printPrices(actives, exchanges);
            
            // ⏱️ ОЖИДАНИЕ 5 СЕКУНД
            await this.delay(5000);
        }
    }

    private printPrices(actives: any[], exchanges: any[]) {
        for (const active of actives) {
            console.log(`\n${active.symbol}:`);
            
            for (const exchange of exchanges) {
                const price = this.generatePrice(active, exchange);
                const change = (Math.random() * 4 - 2).toFixed(2);
                
                console.log(`  ${exchange.name}: $${price} (${change}%)`);
            }
        }
    }

    private generatePrice(active: any, exchange: any): string {
        const basePrice = active.base_price || this.getDefaultBasePrice(active.symbol);
        const volatility = active.volatility || 2.0;
        const exchangeWeight = exchange.weight || 1.0;
        
        const price = basePrice * (exchangeWeight + (Math.random() - 0.5) * (volatility / 100));
        return price.toFixed(2);
    }

    private getDefaultBasePrice(symbol: string): number {
        const defaults: { [key: string]: number } = {
            'BTCUSDT': 50000,
            'ETHUSDT': 3000,
            'SOLUSDT': 100
        };
        return defaults[symbol] || 10;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.running = false;
        console.log('🛑 Остановлен');
    }
}
