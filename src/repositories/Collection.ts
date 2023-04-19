export interface Collection<T> {
    add: (items: T[]) => Promise<void>;
    get: (id: string) => Promise<T>;
    getAll: () => Promise<T[]>;
}
