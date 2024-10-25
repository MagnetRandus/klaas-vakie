import OpenAI from 'openai';
import { APIPromise } from 'openai/core';
import { ChatCompletionMessageParam } from 'openai/resources';
import { IConfig } from 'src/types';

type aiSelect = 'gpt-3.5-turbo' | 'gpt-4-turbo-preview';

export class oai {
  private ai: OpenAI;
  constructor(model: aiSelect, config: IConfig) {
    this.ai = new OpenAI({ apiKey: config.server.openaikey[model] });
  }
  /**
   * {
        role: 'system',
        content: 'Your name is Klasie and you are a helpful assistant that speaks Afrikaans.',
      }
   * @param txMsg Must be initialized with an instruction for the AI
   * @returns Array<ChatCompletionMessageParam>
   */
  public async sendMessage(txMsg: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    let errInf = '';

    try {
      if (txMsg && txMsg[0].content) {
        const content = String(txMsg[0].content);
        if (content.indexOf('test') == -1) {
          const response: OpenAI.Chat.Completions.ChatCompletion = await this.ai.chat.completions.create({
            messages: txMsg,
            model: 'gpt-3.5-turbo',
          });
          const reply = response.choices.map((h) => h.message);
          txMsg = [...txMsg, { role: 'assistant', content: reply[0].content }];
        } //ELSE WOULD JUST ECHO THE ORIGINAL MESSAGE
      }
    } catch (err) {
      if (err instanceof Error) errInf = err.message;
    }

    return new Promise<Array<ChatCompletionMessageParam>>((resolve, reject) => {
      if (errInf == '') resolve(txMsg);
    });
  }
}
