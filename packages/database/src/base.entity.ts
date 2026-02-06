import { generateId } from "@utils/UUID"

export class BaseEntity {
    id: string
    createdAt: string
    updatedAt:string

    constructor(){
       this.id = generateId()
       this.createdAt = new Date().toISOString() 
       this.updatedAt = new Date().toISOString() 
    }

    update(){
        this.updatedAt = new Date().toISOString() 
    }
}