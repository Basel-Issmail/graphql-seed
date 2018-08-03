import config from './server/config/config';
import { app, server } from './server/server';

app.listen({ port: config.port }, () => console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`));
