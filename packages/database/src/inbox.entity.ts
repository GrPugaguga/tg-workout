import { validateId } from "@utils/UUID"

export class InboxMessage {
    messageId: string
    type: boolean
    payload: any[]
    processedAt: string | undefined

    constructor(messageId: string, service:string, payload: any[]){
        if(!validateId(messageId)) throw Error('Invalid task id')

        this.messageId = messageId
        this.type = false
        this.payload = payload
    }

    process(){
        this.type = true
        this.processedAt = new Date().toISOString()
    }
}