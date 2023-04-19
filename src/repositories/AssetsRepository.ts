import { Asset } from "@/models/Asset";
import { Collection } from "./Collection";
import { IndexedDBCollection } from "./IndexedDBCollection";

export class AssetsRepository {
    private static instance: AssetsRepository;
    private collection: Collection<Asset>;
    private constructor() {
        this.collection = new IndexedDBCollection('money-hub-db', 'assets');
    }

    static getInstance() {
        if (!AssetsRepository.instance) {
            AssetsRepository.instance = new AssetsRepository();
        }
        return AssetsRepository.instance;
    }

    public async add(assets: Asset[]) {
        return await this.collection.add(assets);
    }

    public async get(id: string): Promise<Asset> {
        return await this.collection.get(id);
    }

    public async getAll(): Promise<Asset[]> {
        return await this.collection.getAll();
    }
}