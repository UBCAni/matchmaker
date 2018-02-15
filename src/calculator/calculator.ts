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

class CatsOrDogsCalculator extends ComparisonCalculator {
    constructor() {
        super("Cats or dogs?");
    }
}

class DrinkCalculator extends ComparisonCalculator {
    constructor() {
        super("What's your favourite type of drink?");
    }
}

class RPGCalculator extends ComparisonCalculator {
    constructor() {
        super("Which RPG class would you want to be?")
    }
}

class QualityCalculator extends ComparisonCalculator {
    constructor() {
        super("What's the most important quality that they should have?");
    }
}

class FirstDateCalculator extends ComparisonCalculator {
    constructor() {
        super("What's your ideal first date?");
    }
}

class SweetsCalculator extends ComparisonCalculator {
    constructor() {
        super("Sweets?");
    }
}

class MediaPreferenceCalculator extends ComparisonCalculator {
    constructor() {
        super("Do you prefer watching anime, reading manga, or something else?");
    }
}

class ViewingPreferenceCalculator extends ComparisonCalculator {
    constructor() {
        super("Do you prefer watching anime with others or on your own?");
    }
}

class DereCalculator extends ComparisonCalculator {
    constructor() {
        super("What's your favourite dere?");
    }
}

class LoveInterestCalculator extends ComparisonCalculator {
    constructor() {
        super("Who would you want as a love interest?");
    }
}

class HighSchoolCalculator extends ComparisonCalculator {
    constructor() {
        super("What would you do after school as a high-schooler in Japan?");
    }
}

class JapanCalculator extends ComparisonCalculator {
    constructor() {
        super("You're in Japan. What do you do first?");
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

class MusicalCalculator extends IntersectCalculator {
    constructor() {
        super("What is your musical preference?");
    }
}

class GenreCalculator extends IntersectCalculator {
    constructor() {
        super("Favourite genres");
    }
}

class PersonalityCalculator extends BaseCalculator {
    constructor(weight?: number) {
        super(weight);
    }

    calculate(a: DataHandler<string>, b: DataHandler<string>): number {
        const me = a["What are your preferred personality traits in your partner?"].split(`,`).map((s) => s.trim().toLowerCase());
        const other = b["How would your friends describe your personality?"].split(`,`).map((s) => s.trim().toLowerCase());

        return other.map((elem) => +me.includes(elem)).reduce((a, b) => a + b, 0);
    }
}

export const handler: DataHandler<Calculator> = {
    "How would your friends describe your personality?": new PersonalityCalculator(),
    "Cats or dogs?": new CatsOrDogsCalculator(),
    "What's your favourite type of drink?": new DrinkCalculator(),
    "Which RPG class would you want to be?": new RPGCalculator(),
    "What is your musical preference?": new MusicalCalculator(),
    "What's the most important quality that they should have?": new QualityCalculator(),
    "What's your ideal first date?": new FirstDateCalculator(),
    "What are your preferred personality traits in your partner?": new PersonalityCalculator(),
    "Sweets?": new SweetsCalculator(),
    "Favourite genres": new GenreCalculator(),
    "Do you prefer watching anime, reading manga, or something else?": new MediaPreferenceCalculator(),
    "Do you prefer watching anime with others or on your own?": new ViewingPreferenceCalculator(),
    "How much of your time do you spend watching anime?": new TimeCalculator(),
    "What's your favourite dere?": new DereCalculator(),
    "Who would you want as a love interest?": new LoveInterestCalculator(),
    "What would you do after school as a high-schooler in Japan?": new HighSchoolCalculator(),
    "You're in Japan. What do you do first?": new JapanCalculator()
}