import { Injectable } from "@nestjs/common";
import { Tool } from "./tool.abstract";


@Injectable()
export class OffTopTool extends Tool {

    execute(userId: string, text: string): Promise<{ message: string; data?: unknown }> {
        return Promise.resolve({ message: "Off-topic message received. No action taken." });
    }
}