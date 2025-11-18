import { Database } from './database/db';
import { SetupWizard } from './modules/setup-wizard';

class DTArbitr {
    private running = false;

    async initialize() {
        console.log('🚀 Запуск...');
        
        const wizard = new SetupWizard();
        const { mode } = await wizard.start();
        
        if (await this.isMaintenanceTime()) {
            console.log('⏸️ Техперерыв 03:00-04:00 МСК');
            process.exit(0);
        }

        await this.startTrading(mode);
    }

    private async isMaintenanceTime(): Promise<boolean> {
        try {
            const config = await Database.getConfig<any>('daily_maintenance');
            if (!config) return false;

            const now = new Date();
            const msk = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
            const current = msk.getHours() * 60 + msk.getMinutes();
            
            const [startH, startM] = config.start.split(':').map(Number);
            const [endH, endM] = config.end.split(':').map(Number);
            
            return current >= startH * 60 + startM && current < endH * 60 + endM;
        } catch {
            return false;
        }
    }

    private async startTrading(mode: string): Promise<void> {
        console.log(`\n🎯 ${mode === 'test' ? '📊 TEST MODE' : '⚡ BATTLE MODE'}`);
        
        this.running = true;
        const battle = 5000;  // 5сек для теста
        const break_ = 1000;  // 1сек для теста
        
        for (let cycle = 1; cycle <= 3 && this.running; cycle++) {
            console.log(`\n♻️ Цикл ${cycle}: Бой ${battle}мс`);
            await this.delay(battle);
            console.log(`💾 Синх ${break_}мс`);
            await this.delay(break_);
        }
        
        console.log('✅ Завершено');
        await this.shutdown();
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => {
            if (!this.running) return;
            setTimeout(resolve, ms);
        });
    }

    private async shutdown(): Promise<void> {
        this.running = false;
        await Database.close();
        process.exit(0);
    }
}

// 🚀 ЗАПУСК
new DTArbitr().initialize();

// 🛑 CTRL+C
process.on('SIGINT', async () => {
    console.log('\n🛑 Выход...');
    await Database.close();
    process.exit(0);
});
