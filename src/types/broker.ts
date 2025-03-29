export interface MessageBroker {
    connectConsumer: () => Promise<void>;
    disconnectConsumer: () => Promise<void>;
    consumeMessage: (topic: string, fromBegining: boolean) => Promise<void>;
}
