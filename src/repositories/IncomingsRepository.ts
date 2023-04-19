import { Incoming } from "@/models/Incoming";
import { Collection } from "./Collection";
import { IndexedDBCollection } from "./IndexedDBCollection";

export class IncomingsRepository {
    private static instance: IncomingsRepository;
    private collection: Collection<Incoming>;
    private constructor() {
        this.collection = new IndexedDBCollection('money-hub-db', 'incomings');
    }

    static getInstance() {
        if (!IncomingsRepository.instance) {
            IncomingsRepository.instance = new IncomingsRepository();
        }
        return IncomingsRepository.instance;
    }

    public async add(incomings: Incoming[]) {
        return await this.collection.add(incomings);
    }

    public async get(id: string): Promise<Incoming> {
        return await this.collection.get(id);
    }

    public async getAll(): Promise<Incoming[]> {
        return await this.collection.getAll();
    }
}