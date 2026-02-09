export class BaseEntity {
    createdAt: string
    updatedAt:string

    constructor(){
       this.createdAt = new Date().toISOString() 
       this.updatedAt = new Date().toISOString() 
    }

    update(){
        this.updatedAt = new Date().toISOString() 
    }
}