import { handler } from '../calculator/calculator';

export class Comparator {
    static compare(a: DataHandler<string>, b: DataHandler<string>): number {
        return this.score(a, b) / this.total(a);
    }

    private static score(a: DataHandler<string>, b: DataHandler<string>): number {
        return Object.keys(a).map((key) => handler[key].result(a, b)).reduce((a, b) => a + b, 0);
    }

    private static total(a: DataHandler<string>): number {
        return this.score(a, a);
    }
}