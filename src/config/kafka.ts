import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { MessageBroker } from "../types/broker";

export class KafkaBroker implements MessageBroker {
    private consumer: Consumer;
    constructor(clientId: string, brokers: string[]) {
        const kafka = new Kafka({ clientId, brokers });
        this.consumer = kafka.consumer({ groupId: clientId });
    }
    async connectConsumer() {
        await this.consumer.connect();
    }
    async disconnectConsumer() {
        await this.consumer.disconnect();
    }
    async consumeMessage(topics: string[], fromBegining: boolean = false) {
        await this.consumer.subscribe({ topics, fromBeginning: fromBegining });
        await this.consumer.run({
            eachMessage: async ({
                topic,
                partition,
                message,
            }: EachMessagePayload) => {
                // eslint-disable-next-line no-console
                console.log({
                    topic,
                    partition,
                    value: message.value!.toString(),
                });
            },
        });
    }
}
