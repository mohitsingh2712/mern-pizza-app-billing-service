import { KafkaBroker } from "../../config/kafka";
import { MessageBroker } from "../../types/broker";
import config from "config";
let broker: MessageBroker | null = null;
export const createMessageBroker = (): MessageBroker => {
    if (!broker) {
        // making this instance singleton
        broker = new KafkaBroker("billing-service", [
            config.get("kafka.brokers"),
        ]);
    }
    return broker;
};
