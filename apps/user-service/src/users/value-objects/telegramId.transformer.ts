import { TelegramId } from "./telegramId.value-object";

export const TelegramIdTransformer = {
    to: (value: TelegramId) => value.get(),
    from: (value: number) => new TelegramId(value)
}  