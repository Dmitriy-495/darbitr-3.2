import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class Database {
    private static db: sqlite3.Database | null = null;
    private static initialized = false;

    static async connect(): Promise<sqlite3.Database> {
        if (!this.db) {
            this.db = new sqlite3.Database('./dt_arbitr.db');
            await this.initSchema();
        }
        return this.db;
    }

    private static async initSchema(): Promise<void> {
        if (this.initialized) return;

        const db = this.db!;
        const run = promisify(db.run.bind(db));
        const get = promisify(db.get.bind(db));

        // 🎯 СОЗДАЕМ ТАБЛИЦЫ ЕСЛИ ИХ НЕТ
        await run(`
            CREATE TABLE IF NOT EXISTS system_config (
                config_key TEXT PRIMARY KEY,
                config_value TEXT NOT NULL
            )
        `);

        // 🎯 ПРОВЕРЯЕМ ЕСТЬ ЛИ НАСТРОЙКИ
        const row = await get("SELECT COUNT(*) as count FROM system_config");
        
        if (row.count === 0) {
            // 🎯 БАЗОВЫЕ НАСТРОЙКИ
            await run(`INSERT INTO system_config (config_key, config_value) VALUES 
                ('daily_maintenance', '{"start": "03:00", "end": "04:00", "timezone": "Europe/Moscow"}'),
                ('battle_cycle', '{"battle_time": 52700, "break_time": 7300}')
            `);
            console.log('✅ База SQLite инициализирована');
        }

        this.initialized = true;
    }

    static async getConfig<T>(key: string): Promise<T | null> {
        const db = await this.connect();
        const get = promisify(db.get.bind(db));
        
        const row: any = await get(
            'SELECT config_value FROM system_config WHERE config_key = ?',
            [key]
        );
        
        return row ? JSON.parse(row.config_value) : null;
    }

    static async close(): Promise<void> {
        if (this.db) {
            const close = promisify(this.db.close.bind(this.db));
            await close();
            this.db = null;
        }
    }
}
