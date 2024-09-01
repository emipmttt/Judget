export type Item<T> = T & {
    id?: number
}

export type BudgetItem = Item<{
    id: number;
    title: string;
    amount: number;
    progress?: BudgetItem[];
    showProgress: boolean
}>

export const addItem = <T>(collection: Item<T>[], item: Item<T>): Item<T>[] => {
    collection.push({ id: Date.now(), ...item })
    return collection
}

export const updateItem = <T>(collection: Item<T>[], id: number, item: Item<T>) => {
    const index = collection.findIndex((item: Item<T>) => item.id === id)
    collection[index] = item
    return collection
}

export const deleteItem = <T>(collection: Item<T>[], id: number) => {
    const indexToDelete = collection.findIndex(item => item.id === id);
    delete collection[indexToDelete]

    return collection
}