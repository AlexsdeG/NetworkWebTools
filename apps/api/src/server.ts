import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT} im ${env.NODE_ENV} Modus`);
});