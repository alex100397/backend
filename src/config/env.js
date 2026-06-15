/**
 * Environment variable validation.
 * Crashes early with a clear message if required vars are missing.
 */

const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
];

const optionalVarsWithDefaults = {
    NODE_ENV: 'development',
    PORT: '5000',
    HOST: '0.0.0.0',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
    CORS_ORIGIN: 'http://localhost:3000',
};

export const validateEnv = () => {
    const missing = requiredVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error(`❌ Missing required environment variables:\n   ${missing.join('\n   ')}`);
        process.exit(1);
    }

    // Apply defaults for optional vars
    for (const [key, defaultValue] of Object.entries(optionalVarsWithDefaults)) {
        if (!process.env[key]) {
            process.env[key] = defaultValue;
        }
    }

    console.log(`✅ Environment validated (${process.env.NODE_ENV})`);
};
