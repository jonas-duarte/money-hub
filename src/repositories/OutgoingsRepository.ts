import { Outgoing } from "@/models/Outgoing";
import { Collection } from "./Collection";
import { IndexedDBCollection } from "./IndexedDBCollection";

export class OutgoingsRepository {
    private static instance: OutgoingsRepository;
    private collection: Collection<Outgoing>;
    private constructor() {
        this.collection = new IndexedDBCollection('money-hub-db', 'outgoings');
    }

    static getInstance() {
        if (!OutgoingsRepository.instance) {
            OutgoingsRepository.instance = new OutgoingsRepository();
        }
        return OutgoingsRepository.instance;
    }

    public async add(outgoings: Outgoing[]) {
        return await this.collection.add(outgoings);
    }

    public async get(id: string): Promise<Outgoing> {
        return await this.collection.get(id);
    }

    public async getAll(): Promise<Outgoing[]> {
        return await this.collection.getAll();
    }
}