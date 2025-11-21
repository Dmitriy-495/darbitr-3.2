import fs from 'fs';
import path from 'path';

export class ConfigLoader {
  private configPath: string;

  constructor() {
    this.configPath = path.join(__dirname);
  }

  getEnabledExchanges(): any[] {
    const exchanges: any[] = [];
    const enabledPath = path.join(this.configPath, 'enabled', 'exchange');
    
    try {
      if (!fs.existsSync(enabledPath)) {
        console.log('📁 Создана папка enabled/exchange');
        fs.mkdirSync(enabledPath, { recursive: true });
        return [];
      }

      const files = fs.readdirSync(enabledPath);
      
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const config = this.loadConfig(path.join(enabledPath, file));
          if (config) {
            exchanges.push(config);
          }
        }
      });
    } catch (error) {
      console.error('❌ Ошибка загрузки бирж:', error);
    }
    
    console.log(`✅ Загружено ${exchanges.length} бирж`);
    return exchanges;
  }

  getEnabledActives(): any[] {
    const actives: any[] = [];
    const enabledPath = path.join(this.configPath, 'enabled', 'active');
    
    try {
      if (!fs.existsSync(enabledPath)) {
        console.log('📁 Создана папка enabled/active');
        fs.mkdirSync(enabledPath, { recursive: true });
        return [];
      }

      const files = fs.readdirSync(enabledPath);
      
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const config = this.loadConfig(path.join(enabledPath, file));
          if (config) {
            actives.push(config);
          }
        }
      });
    } catch (error) {
      console.error('❌ Ошибка загрузки активов:', error);
    }
    
    console.log(`✅ Загружено ${actives.length} активов`);
    return actives;
  }

  private loadConfig(filePath: string): any {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const config = JSON.parse(data);
      
      // Базовая валидация
      if (!config.name || !config.code) {
        console.warn(`⚠️ Невалидный конфиг: ${filePath}`);
        return null;
      }
      
      return config;
    } catch (error) {
      console.error(`❌ Ошибка загрузки конфига ${filePath}:`, error);
      return null;
    }
  }

  // Вспомогательный метод для создания симлинков
  createSymlink(targetPath: string, linkPath: string): boolean {
    try {
      if (fs.existsSync(linkPath)) {
        fs.unlinkSync(linkPath);
      }
      
      fs.symlinkSync(targetPath, linkPath);
      console.log(`✅ Создан симлинк: ${linkPath} -> ${targetPath}`);
      return true;
    } catch (error) {
      console.error(`❌ Ошибка создания симлинка:`, error);
      return false;
    }
  }
}
