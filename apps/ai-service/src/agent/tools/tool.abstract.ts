export abstract class Tool {
    abstract execute(userId: string, text: string): Promise<{ message: string; data?: unknown }>;
}