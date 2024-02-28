import { app } from '@/app';
import { env } from '@/env';

function main() {
  app.listen(env.PORT, () =>
    console.log(`Server is running 🔥\nlink: http://localhost:${env.PORT}\n`)
  );
}
main();
