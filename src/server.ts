import app from "./app";
import { initDb } from "./config/db";
import logger from "./config/logger";
import config from "config";
import { MessageBroker } from "./types/broker";
import { createMessageBroker } from "./common/factories/brokerFactory";

const startServer = async () => {
    const PORT: number = config.get("server.port") || 5503;
    let broker: MessageBroker | null = null;
    try {
        await initDb();
        broker = createMessageBroker();
        await broker.connectConsumer();
        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (broker) {
            await broker.disconnectConsumer();
        }
        if (err instanceof Error) {
            logger.error(err.message);
            logger.on("finish", () => {
                process.exit(1);
            });
        }
    }
};

void startServer();
