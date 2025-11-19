import fs from 'fs';
import path from 'path';

export class ConfigLoader {
    // 🎯 ЗАГРУЗКА ВКЛЮЧЕННЫХ БИРЖ (СИМЛИНКИ)
    static loadEnabledExchanges(): any[] {
        const dir = './src/config/exchange_enabled';
        const exchanges = [];
        
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(dir, file);
                    // 🎯 ПРОВЕРЯЕМ ЯВЛЯЕТСЯ ЛИ СИМЛИНКОМ
                    const realPath = fs.realpathSync(filePath);
                    const config = JSON.parse(fs.readFileSync(realPath, 'utf8'));
                    exchanges.push(config);
                }
            }
        }
        
        return exchanges;
    }

    // 🎯 ЗАГРУЗКА ВКЛЮЧЕННЫХ АКТИВОВ (СИМЛИНКИ)
    static loadEnabledActives(): any[] {
        const dir = './src/config/active_enabled';
        const actives = [];
        
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(dir, file);
                    // 🎯 ПРОВЕРЯЕМ ЯВЛЯЕТСЯ ЛИ СИМЛИНКОМ
                    const realPath = fs.realpathSync(filePath);
                    const config = JSON.parse(fs.readFileSync(realPath, 'utf8'));
                    actives.push(config);
                }
            }
        }
        
        return actives;
    }

    // 🎯 АКТИВАЦИЯ БИРЖИ (СОЗДАНИЕ СИМЛИНКА)
    static enableExchange(code: string): boolean {
        const source = `../exchange_available/${code}.json`;
        const target = `./src/config/exchange_enabled/${code}.json`;
        
        if (!fs.existsSync(source.replace('../', './src/config/'))) {
            return false;
        }
        
        try {
            if (fs.existsSync(target)) {
                fs.unlinkSync(target);
            }
            fs.symlinkSync(source, target);
            return true;
        } catch {
            return false;
        }
    }

    // 🎯 АКТИВАЦИЯ ПАРЫ (СОЗДАНИЕ СИМЛИНКА)
    static enableActive(symbol: string): boolean {
        const source = `../active_available/${symbol}.json`;
        const target = `./src/config/active_enabled/${symbol}.json`;
        
        if (!fs.existsSync(source.replace('../', './src/config/'))) {
            return false;
        }
        
        try {
            if (fs.existsSync(target)) {
                fs.unlinkSync(target);
            }
            fs.symlinkSync(source, target);
            return true;
        } catch {
            return false;
        }
    }

    // 🎯 ДЕАКТИВАЦИЯ (УДАЛЕНИЕ СИМЛИНКА)
    static disableExchange(code: string): boolean {
        const target = `./src/config/exchange_enabled/${code}.json`;
        try {
            if (fs.existsSync(target)) {
                fs.unlinkSync(target);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    static disableActive(symbol: string): boolean {
        const target = `./src/config/active_enabled/${symbol}.json`;
        try {
            if (fs.existsSync(target)) {
                fs.unlinkSync(target);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }
}
