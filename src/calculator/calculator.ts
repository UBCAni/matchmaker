interface Calculator {
    result: (a: DataHandler<string>, b: DataHandler<string>) => number
}

abstract class BaseCalculator implements Calculator {
    constructor(private weight: number = 1) {
        this.weight = weight;
    }

    abstract calculate(a: DataHandler<string>, b: DataHandler<string>): number;

    result(a: DataHandler<string>, b: DataHandler<string>) {
        return this.weight * this.calculate(a, b);
    }
}

// Primary Comparison Calculator for simple answers
class ComparisonCalculator extends BaseCalculator {

    constructor(private field: string, weight?: number) {
        super(weight);
    }

    calculate(a: DataHandler<string>, b: DataHandler<string>): number {
        const x = a[this.field];
        const y = b[this.field];

        if (x === undefined || !y === undefined) {
            throw new Error(`Invalid header "${this.field}"!`);
        }

        return +(x == y);
    }
}

// Simple range comparison
class RangeCalculator extends BaseCalculator {
    private ranges: { [id: string]: number };

    constructor(private field: string, ranges: string[], weight?: number) {
        super(weight);

        this.ranges = Object.assign({}, ...ranges.map((value, i) => ({ [value]: i })));
    }

    calculate(a: DataHandler<string>, b: DataHandler<string>): number {
        const x = this.ranges[a[this.field]];
        const y = this.ranges[b[this.field]];
        if (x === undefined || y === undefined) {
            throw new Error(`Invalid header "${this.field}"!`);
        }

        return Object.keys(this.ranges).length - Math.abs(x - y);
    }
}

class TimeCalculator extends RangeCalculator {
    constructor() {
        super("How much of your time do you spend watching anime?", [
            "I don't watch anime",
            "Barely any time",
            "Only occasionally",
            "Quite a lot",
            "All my time is spent watching anime"
        ]);
    }
}

class IntersectCalculator extends BaseCalculator {
    constructor(private field: string, weight?: number) {
        super(weight);
    }

    calculate(a: DataHandler<string>, b: DataHandler<string>): number {
        const selection = a[this.field].split(`,`).map((s) => s.trim());
        const other = b[this.field].split(`,`).map((s) => s.trim());

        return selection.map((elem) => +other.includes(elem)).reduce((a, b) => a + b, 0);
    }
}

class PersonalityCalculator extends BaseCalculator {
    constructor(weight?: number) {
        super(weight);
    }

    calculate(a: DataHandler<string>, b: DataHandler<string>): number {
        const me = a["What are your preferred personality traits in your partner?"].split(`,`).map((s) => s.trim().toLowerCase());
        const other = b["How would your friends describe your personality?"].split(`,`).map((s) => s.trim().toLowerCase());

        if (a.Nickname == b.Nickname) {
            return me.length;
        }

        return other.map((elem) => +me.includes(elem)).reduce((a, b) => a + b, 0);
    }
}

class NoCalculator extends BaseCalculator {
    constructor(weight?: number) {
        super(weight);
    }

    calculate(a: DataHandler<string>, b: DataHandler<string>) {
        return 0;
    }
}

export const handler: DataHandler<Calculator> = {
    "Timestamp": new NoCalculator(),
    "Nickname": new NoCalculator(),
    "How would your friends describe your personality?": new PersonalityCalculator(),
    "Cats or dogs?": new ComparisonCalculator("Cats or dogs?"),
    "What's your favourite type of drink?": new ComparisonCalculator("What's your favourite type of drink?"),
    "Which RPG class would you want to be?": new ComparisonCalculator("Which RPG class would you want to be?"),
    "What is your musical preference?": new IntersectCalculator("What is your musical preference?"),
    "What's the most important quality that they should have?": new ComparisonCalculator("What's the most important quality that they should have?"),
    "What's your ideal first date?": new ComparisonCalculator("What's your ideal first date?"),
    "What are your preferred personality traits in your partner?": new PersonalityCalculator(),
    "Sweets?": new ComparisonCalculator("Sweets?"),
    "Favourite genres": new IntersectCalculator("Favourite genres"),
    "Do you prefer watching anime, reading manga, or something else?": new ComparisonCalculator("Do you prefer watching anime, reading manga, or something else?"),
    "Do you prefer watching anime with others or on your own?": new ComparisonCalculator("Do you prefer watching anime with others or on your own?"),
    "How much of your time do you spend watching anime?": new TimeCalculator(),
    "What's your favourite dere?": new ComparisonCalculator("What's your favourite dere?"),
    "Who would you want as a love interest?": new ComparisonCalculator("Who would you want as a love interest?"),
    "What would you do after school as a high-schooler in Japan?": new ComparisonCalculator("What would you do after school as a high-schooler in Japan?"),
    "You're in Japan. What do you do first?": new ComparisonCalculator("You're in Japan. What do you do first?")
};
