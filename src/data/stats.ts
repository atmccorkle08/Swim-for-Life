export interface Stat {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  {
    value: "50+",
    numericValue: 50,
    suffix: "+",
    label: "Children Taught",
  },
  {
    value: "200+",
    numericValue: 200,
    suffix: "+",
    label: "Lessons Given",
  },
  {
    value: "3",
    numericValue: 3,
    suffix: "",
    label: "Seasons Completed",
  },
  {
    value: "100%",
    numericValue: 100,
    suffix: "%",
    label: "Free of Charge",
  },
];
