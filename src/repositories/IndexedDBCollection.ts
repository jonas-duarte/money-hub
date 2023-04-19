import { Collection } from "./Collection";

export class IndexedDBCollection<T> implements Collection<T> {
    constructor(private dbName: string, private storeName: string) { }

    private async getDb(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const dbRequest = indexedDB.open(`${this.dbName} ${this.storeName}`, 1);
            dbRequest.onerror = () => {
                reject(new Error('Failed to open database'));
            };
            dbRequest.onsuccess = (event) => {
                const db = (event.target as IDBRequest<IDBDatabase>).result;
                resolve(db);
            };
            dbRequest.onupgradeneeded = (event) => {
                const db = (event.target as IDBRequest<IDBDatabase>).result;
                const store = db.createObjectStore(this.storeName);
                store.createIndex('id', 'id', { unique: true });
            };
        });
    }

    private async getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.getDb();

        const transaction = db.transaction(this.storeName, mode);
        const store = transaction.objectStore(this.storeName);

        return store;
    }

    public async add(items: T[]): Promise<void> {
        const store = await this.getStore('readwrite');

        for (const item of items) {
            store.put(item, (item as any).id);
        }
    }

    public async get(id: string): Promise<T> {
        const store = await this.getStore('readonly');

        const request = store.get(id);
        return new Promise<T>((resolve, reject) => {
            request.onerror = () => {
                reject(new Error('Failed to get item'));
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }

    public async getAll(): Promise<T[]> {
        const store = await this.getStore('readonly');

        const request = store.getAll();
        return new Promise<T[]>((resolve, reject) => {
            request.onerror = () => {
                reject(new Error('Failed to get all items'));
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }


}