import fs from 'fs';
import path from 'path';

export class ConfigLoader {
    // 🎯 ЗАГРУЗКА ВКЛЮЧЕННЫХ БИРЖ
    static loadEnabledExchanges(): any[] {
        return this.loadConfigs('./src/config/enabled/exchange');
    }

    // 🎯 ЗАГРУЗКА ВКЛЮЧЕННЫХ АКТИВОВ
    static loadEnabledActives(): any[] {
        return this.loadConfigs('./src/config/enabled/active');
    }

    // 🎯 ДОСТУПНЫЕ БИРЖИ
    static loadAvailableExchanges(): any[] {
        return this.loadConfigs('./src/config/available/exchange');
    }

    // 🎯 ДОСТУПНЫЕ АКТИВЫ
    static loadAvailableActives(): any[] {
        return this.loadConfigs('./src/config/available/active');
    }

    // 🎯 ОБЩИЙ МЕТОД ЗАГРУЗКИ КОНФИГОВ
    private static loadConfigs(dir: string): any[] {
        const configs = [];
        
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    try {
                        const filePath = path.join(dir, file);
                        const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        configs.push(config);
                    } catch (error: any) {
                        console.log(`⚠️ Ошибка загрузки ${file}:`, error.message);
                    }
                }
            }
        }
        
        return configs;
    }

    // 🎯 АКТИВАЦИЯ БИРЖИ
    static enableExchange(code: string): boolean {
        return this.createSymlink(
            `../available/exchange/${code}.json`,
            `./src/config/enabled/exchange/${code}.json`
        );
    }

    // 🎯 АКТИВАЦИЯ АКТИВА
    static enableActive(symbol: string): boolean {
        return this.createSymlink(
            `../available/active/${symbol}.json`,
            `./src/config/enabled/active/${symbol}.json`
        );
    }

    // 🎯 ДЕАКТИВАЦИЯ БИРЖИ
    static disableExchange(code: string): boolean {
        return this.removeSymlink(`./src/config/enabled/exchange/${code}.json`);
    }

    // 🎯 ДЕАКТИВАЦИЯ АКТИВА
    static disableActive(symbol: string): boolean {
        return this.removeSymlink(`./src/config/enabled/active/${symbol}.json`);
    }

    // 🎯 СОЗДАНИЕ СИМЛИНКА
    private static createSymlink(source: string, target: string): boolean {
        const sourcePath = source.replace('../', './src/config/');
        if (!fs.existsSync(sourcePath)) {
            console.log(`❌ Файл не найден: ${sourcePath}`);
            return false;
        }
        
        try {
            // Создаем папку если не существует
            const targetDir = path.dirname(target);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            if (fs.existsSync(target)) {
                fs.unlinkSync(target);
            }
            fs.symlinkSync(source, target);
            console.log(`✅ Симлинк создан: ${target} -> ${source}`);
            return true;
        } catch (error: any) {
            console.log(`❌ Ошибка создания симлинка:`, error.message);
            return false;
        }
    }

    // 🎯 УДАЛЕНИЕ СИМЛИНКА
    private static removeSymlink(target: string): boolean {
        try {
            if (fs.existsSync(target)) {
                fs.unlinkSync(target);
                console.log(`✅ Симлинк удален: ${target}`);
                return true;
            }
            return false;
        } catch (error: any) {
            console.log(`❌ Ошибка удаления симлинка:`, error.message);
            return false;
        }
    }
}
