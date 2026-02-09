export class TelegramId {
    private readonly _value: number 

    constructor(value){
        if(typeof value != 'number') throw new Error('TelegramId must be a number')

        if(value <= 0 || !Number.isInteger(value)) throw new Error('TelegramId must be a positive integer')
        this._value = value
    }

    get(): number{
        return this._value
    }

    equals(other: TelegramId): boolean { 
        if(!(other instanceof TelegramId)) return false
        return this._value === other._value
    }
}