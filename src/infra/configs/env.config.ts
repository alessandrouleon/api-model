export const envConfig = () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  pythonServerUrl: process.env.PYTHON_SERVER_URL || '',
});
