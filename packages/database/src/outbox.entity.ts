import { validateId } from "@utils/UUID"

export class OutboxMessage {
    messageId: string
    eventType: string
    payload: any[]
    sentAt: string | undefined

    constructor(messageId: string, eventType: string, payload: any[]){
        if(!validateId(messageId)) throw Error('Invalid task id')

        this.messageId = messageId
        this.eventType = eventType
        this.payload = payload
    }

    sent(){
        this.sentAt = new Date().toISOString()
    }
}