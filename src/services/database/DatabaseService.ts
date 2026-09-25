import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'weatherguard.db';

class DatabaseService {
  private db: SQLiteDatabase | null = null;

  async open(): Promise<SQLiteDatabase> {
    if (this.db) return this.db;
    this.db = await SQLite.openDatabase({
      name: DB_NAME,
      location: 'default',
    });
    await this.createTables();
    return this.db;
  }

  private async createTables(): Promise<void> {
    const db = this.db!;

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'resident',
        home_zone_id TEXT DEFAULT 'zone_village_a_ward_3',
        home_zone_name TEXT DEFAULT 'Village A (Ward 3)',
        avatar_color TEXT DEFAULT '#00D4FF',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        zone_id TEXT NOT NULL,
        severity TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        is_read INTEGER DEFAULT 0
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS settings (
        user_id TEXT PRIMARY KEY,
        notifications_enabled INTEGER DEFAULT 1,
        dark_mode INTEGER DEFAULT 1,
        alert_sound INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // ─── Historical Weather Data ───────────────────────────────
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS weather_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id TEXT NOT NULL,
        date TEXT NOT NULL,
        rainfall_mm REAL DEFAULT 0,
        river_level_m REAL DEFAULT 0,
        soil_saturation_pct REAL DEFAULT 0,
        wind_speed_kmh REAL DEFAULT 0,
        flood_level TEXT DEFAULT 'NONE',
        water_accumulation_mm REAL DEFAULT 0,
        landslide_risk_pct REAL DEFAULT 0,
        landslide_occurred INTEGER DEFAULT 0,
        notes TEXT DEFAULT ''
      );
    `);

    // ─── Landslide Records ─────────────────────────────────────
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS landslide_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id TEXT NOT NULL,
        date TEXT NOT NULL,
        severity TEXT NOT NULL,
        slope_angle_deg REAL DEFAULT 0,
        soil_type TEXT DEFAULT 'clay',
        rainfall_trigger_mm REAL DEFAULT 0,
        casualties INTEGER DEFAULT 0,
        damage_estimate TEXT DEFAULT '',
        notes TEXT DEFAULT ''
      );
    `);

    // Seed default alerts if empty
    const [alertCountResult] = await db.executeSql('SELECT COUNT(*) as count FROM alerts');
    if (alertCountResult.rows.item(0).count === 0) {
      await this.seedAlerts();
    }

    // Seed weather history if empty
    const [histCountResult] = await db.executeSql('SELECT COUNT(*) as count FROM weather_history');
    if (histCountResult.rows.item(0).count === 0) {
      await this.seedWeatherHistory();
    }

    // Seed landslide records if empty
    const [lsCountResult] = await db.executeSql('SELECT COUNT(*) as count FROM landslide_records');
    if (lsCountResult.rows.item(0).count === 0) {
      await this.seedLandslideRecords();
    }
  }

  // ─── Simple hash (djb2 variant) ────────────────────────────
  hashPassword(password: string): string {
    let hash = 5381;
    for (let i = 0; i < password.length; i++) {
      hash = ((hash << 5) + hash) + password.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = 'wg_';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  generateId(): string {
    return 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }

  // ─── Auth Operations ──────────────────────────────────────
  async signUp(name: string, email: string, password: string): Promise<{ userId: string; token: string } | null> {
    const db = await this.open();

    // Check if email already exists
    const [existing] = await db.executeSql('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return null; // Email already in use
    }

    const userId = this.generateId();
    const passwordHash = this.hashPassword(password);
    const token = this.generateToken();

    await db.executeSql(
      `INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)`,
      [userId, name, email.toLowerCase(), passwordHash]
    );

    await db.executeSql(
      `INSERT INTO sessions (user_id, token) VALUES (?, ?)`,
      [userId, token]
    );

    await db.executeSql(
      `INSERT INTO settings (user_id) VALUES (?)`,
      [userId]
    );

    return { userId, token };
  }

  async login(email: string, password: string): Promise<{ userId: string; token: string } | null> {
    const db = await this.open();
    const passwordHash = this.hashPassword(password);

    const [result] = await db.executeSql(
      'SELECT id FROM users WHERE email = ? AND password_hash = ?',
      [email.toLowerCase(), passwordHash]
    );

    if (result.rows.length === 0) return null;

    const userId = result.rows.item(0).id;
    const token = this.generateToken();

    // Clear old sessions and create new one
    await db.executeSql('DELETE FROM sessions WHERE user_id = ?', [userId]);
    await db.executeSql(
      'INSERT INTO sessions (user_id, token) VALUES (?, ?)',
      [userId, token]
    );

    return { userId, token };
  }

  async getUserById(userId: string): Promise<any | null> {
    const db = await this.open();
    const [result] = await db.executeSql('SELECT * FROM users WHERE id = ?', [userId]);
    if (result.rows.length === 0) return null;
    return result.rows.item(0);
  }

  async getActiveSession(): Promise<{ userId: string; token: string } | null> {
    const db = await this.open();
    const [result] = await db.executeSql(
      'SELECT user_id, token FROM sessions ORDER BY created_at DESC LIMIT 1'
    );
    if (result.rows.length === 0) return null;
    const row = result.rows.item(0);
    return { userId: row.user_id, token: row.token };
  }

  async logout(userId: string): Promise<void> {
    const db = await this.open();
    await db.executeSql('DELETE FROM sessions WHERE user_id = ?', [userId]);
  }

  async updateUser(userId: string, updates: { name?: string; email?: string; home_zone_id?: string; home_zone_name?: string; avatar_color?: string }): Promise<void> {
    const db = await this.open();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.email) { fields.push('email = ?'); values.push(updates.email.toLowerCase()); }
    if (updates.home_zone_id) { fields.push('home_zone_id = ?'); values.push(updates.home_zone_id); }
    if (updates.home_zone_name) { fields.push('home_zone_name = ?'); values.push(updates.home_zone_name); }
    if (updates.avatar_color) { fields.push('avatar_color = ?'); values.push(updates.avatar_color); }

    if (fields.length === 0) return;

    fields.push("updated_at = datetime('now')");
    values.push(userId);

    await db.executeSql(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  // ─── Alerts Operations ────────────────────────────────────
  async getAlerts(zoneId?: string): Promise<any[]> {
    const db = await this.open();
    const query = zoneId
      ? 'SELECT * FROM alerts WHERE zone_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM alerts ORDER BY created_at DESC';
    const params = zoneId ? [zoneId] : [];
    const [result] = await db.executeSql(query, params);
    const alerts: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      alerts.push(result.rows.item(i));
    }
    return alerts;
  }

  async markAlertRead(alertId: string): Promise<void> {
    const db = await this.open();
    await db.executeSql('UPDATE alerts SET is_read = 1 WHERE id = ?', [alertId]);
  }

  async getUnreadAlertCount(): Promise<number> {
    const db = await this.open();
    const [result] = await db.executeSql('SELECT COUNT(*) as count FROM alerts WHERE is_read = 0');
    return result.rows.item(0).count;
  }

  // ─── Settings Operations ──────────────────────────────────
  async getSettings(userId: string): Promise<any | null> {
    const db = await this.open();
    const [result] = await db.executeSql('SELECT * FROM settings WHERE user_id = ?', [userId]);
    if (result.rows.length === 0) return null;
    return result.rows.item(0);
  }

  async updateSettings(userId: string, updates: { notifications_enabled?: number; dark_mode?: number; alert_sound?: number }): Promise<void> {
    const db = await this.open();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.notifications_enabled !== undefined) { fields.push('notifications_enabled = ?'); values.push(updates.notifications_enabled); }
    if (updates.dark_mode !== undefined) { fields.push('dark_mode = ?'); values.push(updates.dark_mode); }
    if (updates.alert_sound !== undefined) { fields.push('alert_sound = ?'); values.push(updates.alert_sound); }

    if (fields.length === 0) return;
    values.push(userId);

    await db.executeSql(`UPDATE settings SET ${fields.join(', ')} WHERE user_id = ?`, values);
  }

  // ─── Weather History Operations ───────────────────────────
  async getWeatherHistory(zoneId?: string, limit: number = 30): Promise<any[]> {
    const db = await this.open();
    const query = zoneId
      ? 'SELECT * FROM weather_history WHERE zone_id = ? ORDER BY date DESC LIMIT ?'
      : 'SELECT * FROM weather_history ORDER BY date DESC LIMIT ?';
    const params = zoneId ? [zoneId, limit] : [limit];
    const [result] = await db.executeSql(query, params);
    const records: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      records.push(result.rows.item(i));
    }
    return records;
  }

  async getWeatherStats(zoneId: string): Promise<any> {
    const db = await this.open();
    const [result] = await db.executeSql(`
      SELECT
        AVG(rainfall_mm) as avg_rainfall,
        MAX(rainfall_mm) as max_rainfall,
        AVG(river_level_m) as avg_river_level,
        MAX(river_level_m) as max_river_level,
        AVG(soil_saturation_pct) as avg_soil_saturation,
        AVG(landslide_risk_pct) as avg_landslide_risk,
        MAX(landslide_risk_pct) as max_landslide_risk,
        SUM(landslide_occurred) as total_landslides,
        COUNT(*) as total_records
      FROM weather_history WHERE zone_id = ?
    `, [zoneId]);
    return result.rows.item(0);
  }

  // ─── Landslide Records Operations ────────────────────────
  async getLandslideRecords(zoneId?: string): Promise<any[]> {
    const db = await this.open();
    const query = zoneId
      ? 'SELECT * FROM landslide_records WHERE zone_id = ? ORDER BY date DESC'
      : 'SELECT * FROM landslide_records ORDER BY date DESC';
    const params = zoneId ? [zoneId] : [];
    const [result] = await db.executeSql(query, params);
    const records: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      records.push(result.rows.item(i));
    }
    return records;
  }

  // ─── Seed Data ─────────────────────────────────────────────
  private async seedAlerts(): Promise<void> {
    const db = this.db!;
    const alerts = [
      { id: 'alert_001', zone_id: 'zone_village_a_ward_3', severity: 'CRITICAL', title: 'Flash Flood Warning', description: 'Heavy rainfall upstream has triggered a flash flood warning for Ward 3. Water levels are expected to rise rapidly in the next 2-4 hours. Move to higher ground immediately if you are in low-lying areas.' },
      { id: 'alert_002', zone_id: 'zone_village_a_ward_3', severity: 'HIGH', title: 'Severe Thunderstorm Alert', description: 'A severe thunderstorm cell is approaching from the southwest. Expect intense rainfall (50-70mm/hr), frequent lightning, and wind gusts exceeding 80 km/h. Secure loose outdoor items and stay indoors.' },
      { id: 'alert_003', zone_id: 'zone_village_a_ward_3', severity: 'MODERATE', title: 'Soil Saturation Advisory', description: 'Ground soil moisture levels have reached 78% saturation. Increased risk of landslides on slopes exceeding 30 degrees. Avoid steep terrain and monitor for ground movement near hillsides.' },
      { id: 'alert_004', zone_id: 'zone_village_a_ward_3', severity: 'LOW', title: 'River Level Update', description: 'The Kosi River gauge at Station B7 is reading 2.1m, which is within normal operating range. Conditions are stable but monitoring continues. No immediate action required.' },
      { id: 'alert_005', zone_id: 'zone_village_a_ward_3', severity: 'HIGH', title: 'Evacuation Route Change', description: 'Due to road damage on NH-34, the primary evacuation route via Bridge Point has been redirected. Use the alternate route through Market Road to reach the relief center at Community Hall B.' },
      { id: 'alert_006', zone_id: 'zone_village_a_ward_3', severity: 'MODERATE', title: 'Wind Speed Elevation', description: 'Sustained wind speeds have increased to 55 km/h with gusts up to 72 km/h. Loose structures, temporary shelters, and signage may be affected. Reinforce temporary covers and stay away from trees.' },
    ];

    for (const alert of alerts) {
      await db.executeSql(
        'INSERT OR IGNORE INTO alerts (id, zone_id, severity, title, description) VALUES (?, ?, ?, ?, ?)',
        [alert.id, alert.zone_id, alert.severity, alert.title, alert.description]
      );
    }
  }

  private async seedWeatherHistory(): Promise<void> {
    const db = this.db!;
    const history = [
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-24', rainfall_mm: 45.2, river_level_m: 2.8, soil_saturation_pct: 72, wind_speed_kmh: 42, flood_level: 'MINOR', water_accumulation_mm: 120, landslide_risk_pct: 35, landslide_occurred: 0, notes: 'Moderate rainfall throughout the day' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-23', rainfall_mm: 78.5, river_level_m: 3.4, soil_saturation_pct: 85, wind_speed_kmh: 58, flood_level: 'MODERATE', water_accumulation_mm: 280, landslide_risk_pct: 62, landslide_occurred: 0, notes: 'Heavy rainfall with flooding in low-lying areas' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-22', rainfall_mm: 112.3, river_level_m: 4.1, soil_saturation_pct: 94, wind_speed_kmh: 72, flood_level: 'SEVERE', water_accumulation_mm: 450, landslide_risk_pct: 88, landslide_occurred: 1, notes: 'Extreme rainfall event, minor landslide on eastern slope' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-21', rainfall_mm: 22.1, river_level_m: 2.1, soil_saturation_pct: 55, wind_speed_kmh: 28, flood_level: 'NONE', water_accumulation_mm: 45, landslide_risk_pct: 15, landslide_occurred: 0, notes: 'Light scattered showers' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-20', rainfall_mm: 8.4, river_level_m: 1.8, soil_saturation_pct: 42, wind_speed_kmh: 18, flood_level: 'NONE', water_accumulation_mm: 12, landslide_risk_pct: 8, landslide_occurred: 0, notes: 'Mostly clear with brief drizzle' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-19', rainfall_mm: 55.8, river_level_m: 3.0, soil_saturation_pct: 68, wind_speed_kmh: 45, flood_level: 'MINOR', water_accumulation_mm: 165, landslide_risk_pct: 42, landslide_occurred: 0, notes: 'Steady rain throughout evening hours' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-18', rainfall_mm: 92.6, river_level_m: 3.8, soil_saturation_pct: 89, wind_speed_kmh: 65, flood_level: 'MODERATE', water_accumulation_mm: 340, landslide_risk_pct: 75, landslide_occurred: 0, notes: 'Heavy sustained rainfall with strong winds' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-17', rainfall_mm: 15.3, river_level_m: 1.9, soil_saturation_pct: 48, wind_speed_kmh: 22, flood_level: 'NONE', water_accumulation_mm: 28, landslide_risk_pct: 12, landslide_occurred: 0, notes: 'Overcast with light showers' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-16', rainfall_mm: 3.2, river_level_m: 1.6, soil_saturation_pct: 35, wind_speed_kmh: 12, flood_level: 'NONE', water_accumulation_mm: 5, landslide_risk_pct: 5, landslide_occurred: 0, notes: 'Clear skies, dry conditions' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-15', rainfall_mm: 68.4, river_level_m: 3.2, soil_saturation_pct: 78, wind_speed_kmh: 52, flood_level: 'MINOR', water_accumulation_mm: 210, landslide_risk_pct: 55, landslide_occurred: 0, notes: 'Thunderstorm activity with heavy downpours' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-14', rainfall_mm: 125.7, river_level_m: 4.5, soil_saturation_pct: 96, wind_speed_kmh: 78, flood_level: 'SEVERE', water_accumulation_mm: 520, landslide_risk_pct: 92, landslide_occurred: 1, notes: 'Major flooding event, landslide on Ward 3 hillside' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-13', rainfall_mm: 38.9, river_level_m: 2.5, soil_saturation_pct: 62, wind_speed_kmh: 35, flood_level: 'NONE', water_accumulation_mm: 85, landslide_risk_pct: 28, landslide_occurred: 0, notes: 'Moderate rainfall in afternoon' },
    ];

    for (const h of history) {
      await db.executeSql(
        `INSERT INTO weather_history (zone_id, date, rainfall_mm, river_level_m, soil_saturation_pct, wind_speed_kmh, flood_level, water_accumulation_mm, landslide_risk_pct, landslide_occurred, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [h.zone_id, h.date, h.rainfall_mm, h.river_level_m, h.soil_saturation_pct, h.wind_speed_kmh, h.flood_level, h.water_accumulation_mm, h.landslide_risk_pct, h.landslide_occurred, h.notes]
      );
    }
  }

  private async seedLandslideRecords(): Promise<void> {
    const db = this.db!;
    const records = [
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-22', severity: 'MODERATE', slope_angle_deg: 32, soil_type: 'laterite', rainfall_trigger_mm: 112.3, casualties: 0, damage_estimate: 'Minor road blockage, 2 structures damaged', notes: 'Debris flow on eastern slope after sustained rainfall exceeding 100mm' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-09-14', severity: 'HIGH', slope_angle_deg: 38, soil_type: 'clay-loam', rainfall_trigger_mm: 125.7, casualties: 0, damage_estimate: '4 homes damaged, main road blocked for 8 hours', notes: 'Rotational slide on Ward 3 hillside. Soil was pre-saturated from 3 consecutive days of rain.' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-08-28', severity: 'LOW', slope_angle_deg: 25, soil_type: 'sandy-clay', rainfall_trigger_mm: 88.4, casualties: 0, damage_estimate: 'Minor soil movement, no structural damage', notes: 'Small surface slip near river bank area' },
      { zone_id: 'zone_village_a_ward_3', date: '2026-07-15', severity: 'CRITICAL', slope_angle_deg: 42, soil_type: 'clay', rainfall_trigger_mm: 145.2, casualties: 2, damage_estimate: '12 homes destroyed, bridge damaged', notes: 'Major debris avalanche triggered by extreme monsoon rainfall. Area was under evacuation advisory.' },
    ];

    for (const r of records) {
      await db.executeSql(
        `INSERT INTO landslide_records (zone_id, date, severity, slope_angle_deg, soil_type, rainfall_trigger_mm, casualties, damage_estimate, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.zone_id, r.date, r.severity, r.slope_angle_deg, r.soil_type, r.rainfall_trigger_mm, r.casualties, r.damage_estimate, r.notes]
      );
    }
  }
}

export const databaseService = new DatabaseService();
