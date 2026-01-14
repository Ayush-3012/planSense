const requiredEnvVars = ["PORT", "CLAUDE_API_KEY"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

const config = {
  port: Number(process.env.PORT),
  
};

export default config;
