import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DB {
    private static db: sqlite3.Database | null = null;

    static async connect(): Promise<sqlite3.Database> {
        if (!this.db) {
            // 🎯 БАЗА В ПАПКЕ database/database.db
            const dbPath = path.join(__dirname, 'database.db');
            this.db = new sqlite3.Database(dbPath);
            
            // 🎯 МИНИМАЛЬНАЯ СХЕМА
            const run = promisify(this.db.run.bind(this.db));
            await run(`
                CREATE TABLE IF NOT EXISTS config (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            `);

            // 🎯 БАЗОВЫЕ НАСТРОЙКИ
            const row: any = await this.get("SELECT COUNT(*) as count FROM config");
            if (row.count === 0) {
                await run(`INSERT INTO config (key, value) VALUES 
                    ('battle_time', '10000'),
                    ('break_time', '2000')
                `);
                console.log('✅ База database.db инициализирована');
            }
        }
        return this.db;
    }

    static async get(key: string): Promise<any> {
        const db = await this.connect();
        const get = promisify(db.get.bind(db));
        const row = await get('SELECT value FROM config WHERE key = ?', [key]);
        return row ? row.value : null;
    }

    static async close(): Promise<void> {
        if (this.db) {
            const close = promisify(this.db.close.bind(this.db));
            await close();
            this.db = null;
        }
    }
}
