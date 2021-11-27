type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type Year = `${"19" | "20"}${Digit}${Digit}`;

export type Category =
  | "peace"
  | "physics"
  | "medicine"
  | "chemistry"
  | "economics"
  | "literature";

interface PrizeScope {
  year: Year;
  category: Category;
}

export type PrizeAwarded = PrizeScope & {
  overallMotivation?: string;
  laureates: Array<{
    id: string;
    firstname: string;
    surname?: string;
    motivation: string;
    share: Digit;
  }>;
};

export type PrizeOmitted = PrizeScope & {
  overallMotivation: `No Nobel Prize was awarded this year. ${string}`;
};

export type Prize = PrizeAwarded | PrizeOmitted;

type PrizeId = `${Year}${Category}`;
export type PrizeRecord = Prize & {
  _id: PrizeId;
};
