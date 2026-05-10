const { mysqlDB, postgresDB, testConnections } = require('../config/database');
const fs = require('fs');
const path = require('path');

class DatabaseMigrator {
  constructor() {
    this.mysqlSchemaPath = path.join(__dirname, 'mysql_schema.sql');
    this.postgresSchemaPath = path.join(__dirname, 'postgresql_schema.sql');
  }

  async migrate() {
    try {
      console.log('Starting database migration...');

      // Test connections first
      const connectionsOk = await testConnections();
      if (!connectionsOk) {
        throw new Error('Database connections failed');
      }

      // Migrate MySQL schema
      await this.migrateMySQL();

      // Migrate PostgreSQL schema
      await this.migratePostgreSQL();

      console.log('Migration completed successfully!');
      return { success: true, message: 'Migration completed successfully' };

    } catch (error) {
      console.error('Migration failed:', error);
      return { success: false, error: error.message };
    }
  }

  async migrateMySQL() {
    try {
      console.log('Migrating MySQL schema...');

      const schemaSQL = fs.readFileSync(this.mysqlSchemaPath, 'utf8');

      // Split SQL into individual statements
      const statements = this.splitSQLStatements(schemaSQL);

      for (const statement of statements) {
        if (statement.trim()) {
          await mysqlDB.query(statement);
        }
      }

      console.log('MySQL migration completed');
    } catch (error) {
      console.error('MySQL migration failed:', error);
      throw error;
    }
  }

  async migratePostgreSQL() {
    try {
      console.log('Migrating PostgreSQL schema...');

      const schemaSQL = fs.readFileSync(this.postgresSchemaPath, 'utf8');

      // Split SQL into individual statements
      const statements = this.splitSQLStatements(schemaSQL);

      for (const statement of statements) {
        if (statement.trim()) {
          await postgresDB.query(statement);
        }
      }

      console.log('PostgreSQL migration completed');
    } catch (error) {
      console.error('PostgreSQL migration failed:', error);
      throw error;
    }
  }

  splitSQLStatements(sql) {
    // Split on semicolons, but be careful with semicolons inside strings
    const statements = [];
    let currentStatement = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      const prevChar = sql[i - 1] || '';

      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
        stringChar = '';
      }

      currentStatement += char;

      if (char === ';' && !inString) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }

    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    return statements.filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  migrator.migrate().then(result => {
    console.log('Migration result:', result);
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = DatabaseMigrator;

// Made with Bob