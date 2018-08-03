import config from './server/config/config';
import { app, server } from './server/server';
import logger from './server/utils/logger';

app.listen({ port: config.port }, () => logger.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`));
