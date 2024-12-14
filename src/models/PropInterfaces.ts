export interface ToggleOption {
    label: string,
    value: string,
    icon?: string
}

export interface Expense {
    user: string,
    type: string,
    price: number,
    date: Date
}