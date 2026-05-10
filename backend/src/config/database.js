const { Sequelize } = require('sequelize');
require('dotenv').config();

// MySQL Primary Database Connection (Optimized for performance)
const mysqlDB = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Disable SQL logging for better performance
    pool: {
      min: 2, // Keep minimum connections ready
      max: 10, // Maximum connections
      acquire: 10000, // Reduce acquire timeout to 10 seconds
      idle: 5000, // Reduce idle timeout to 5 seconds
      evict: 1000 // Evict idle connections after 1 second
    },
    dialectOptions: {
      connectTimeout: 5000, // 5 second connection timeout
      decimalNumbers: true
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    },
    timezone: '+02:00' // Africa/Johannesburg
  }
);

// PostgreSQL Analytics Database Connection (Optional - for analytics only)
const postgresDB = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Disable logging for better performance
    pool: {
      min: 0, // Allow zero connections if not needed
      max: 5, // Reduce max connections
      acquire: 10000, // Reduce acquire timeout
      idle: 5000, // Reduce idle timeout
      evict: 1000 // Evict idle connections faster
    },
    dialectOptions: {
      connectTimeout: 5000, // 5 second connection timeout
      statement_timeout: 10000 // 10 second query timeout
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    timezone: '+02:00' // Africa/Johannesburg
  }
);

// Test database connections
const testConnections = async () => {
  try {
    // Test MySQL connection
    await mysqlDB.authenticate();
    console.log('✓ MySQL Primary Database connected successfully');

    // Test PostgreSQL connection
    await postgresDB.authenticate();
    console.log('✓ PostgreSQL Analytics Database connected successfully');

    return true;
  } catch (error) {
    console.error('✗ Database connection error:', error.message);
    return false;
  }
};

// Close database connections
const closeConnections = async () => {
  try {
    await mysqlDB.close();
    await postgresDB.close();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error.message);
  }
};

module.exports = {
  mysqlDB,
  postgresDB,
  sequelize: mysqlDB,
  postgresSequelize: postgresDB,
  testConnections,
  closeConnections
};

// Made with Bob
