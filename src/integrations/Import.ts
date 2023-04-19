export interface Import<T> {
    name: string;
    fromFile: (file: File) => Promise<T>;
}