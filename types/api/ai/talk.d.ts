import OpenAI from 'openai';
import { IConfig } from 'src/types';
type aiSelect = 'gpt-3.5-turbo' | 'gpt-4-turbo-preview';
export declare class oai {
    private ai;
    constructor(model: aiSelect, config: IConfig);
    /**
     * {
          role: 'system',
          content: 'Your name is Klasie and you are a helpful assistant that speaks Afrikaans.',
        }
     * @param txMsg Must be initialized with an instruction for the AI
     * @returns Array<ChatCompletionMessageParam>
     */
    sendMessage(txMsg: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam[]>;
}
export {};
