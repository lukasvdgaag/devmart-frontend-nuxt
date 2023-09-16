export default interface InputRequirement {
    type: "min" | "max" | "regex" | "type",
    value: string | number | RegExp,
}