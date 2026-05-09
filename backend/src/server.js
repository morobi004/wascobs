const app = require('./app');
const { mysqlDB, postgresDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Database connection and server startup
const startServer = async () => {
  try {
    // Test MySQL connection (required)
    await mysqlDB.authenticate();
    console.log('✓ MySQL database connection established successfully');

    // Test PostgreSQL connection (optional - for analytics only)
    try {
      await Promise.race([
        postgresDB.authenticate(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('PostgreSQL connection timeout')), 3000)
        )
      ]);
      console.log('✓ PostgreSQL analytics database connected successfully');
    } catch (pgError) {
      console.warn('⚠ PostgreSQL connection failed (analytics features disabled):', pgError.message);
      console.warn('  → Application will run with MySQL only');
    }

    // Note: Database sync is disabled because tables are already created via SQL scripts
    // If you need to sync models, use: await mysqlDB.sync({ alter: false });

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  await sequelize.close();
  await postgresSequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  await sequelize.close();
  await postgresSequelize.close();
  process.exit(0);
});

// Start the server
startServer();

// Made with Bob
