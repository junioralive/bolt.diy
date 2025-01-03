import { BaseProvider, getOpenAILikeModel } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';

export default class GlhfProvider extends BaseProvider {
  name = 'GLHF';
  getApiKeyLink = undefined;

  config = {
    baseUrlKey: 'https://glhf.chat/api/openai/v1',
    apiTokenKey: 'GLHF_API_KEY',
  };

  staticModels: ModelInfo[] = [
    { name: 'hf:Qwen/Qwen2.5-Coder-32B-Instruct', label: 'Qwen 2.5 Coder 32B Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:meta-llama/Llama-3.1-405B-Instruct', label: 'Llama 3.1 405B Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:meta-llama/Llama-3.1-70B-Instruct', label: 'Llama 3.1 70B Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:meta-llama/Llama-3.1-8B-Instruct', label: 'Llama 3.1 8B Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:meta-llama/Llama-3.2-3B-Instruct', label: 'Llama 3.2 3B Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:meta-llama/Llama-3.2-11B-Vision-Instruct', label: 'Llama 3.2 11B Vision Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:meta-llama/Llama-3.2-90B-Vision-Instruct', label: 'Llama 3.2 90B Vision Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:Qwen/Qwen2.5-72B-Instruct', label: 'Qwen 2.5 72B Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:meta-llama/Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:google/gemma-2-9b-it', label: 'Gemma 2 9B IT', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:google/gemma-2-27b-it', label: 'Gemma 2 27B IT', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:mistralai/Mistral-7B-Instruct-v0.3', label: 'Mistral 7B Instruct v0.3', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:mistralai/Mixtral-8x7B-Instruct-v0.1', label: 'Mixtral 8x7B Instruct v0.1', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:mistralai/Mixtral-8x22B-Instruct-v0.1', label: 'Mixtral 8x22B Instruct v0.1', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO', label: 'Nous Hermes 2 Mixtral 8x7B DPO', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:Qwen/Qwen2.5-7B-Instruct', label: 'Qwen 2.5 7B Instruct', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:upstage/SOLAR-10.7B-Instruct-v1.0', label: 'SOLAR 10.7B Instruct v1.0', provider: 'HF', maxTokenAllowed: 8000 },
    { name: 'hf:nvidia/Llama-3.1-Nemotron-70B-Instruct-HF', label: 'Llama 3.1 Nemotron 70B Instruct', provider: 'HF', maxTokenAllowed: 8000 }
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv: Record<string, string> = {},
  ): Promise<ModelInfo[]> {
    try {
      const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
        apiKeys,
        providerSettings: settings,
        serverEnv,
        defaultBaseUrlKey: 'https://glhf.chat/api/openai/v1',
        defaultApiTokenKey: 'GLHF_API_KEY',
      });

      if (!baseUrl || !apiKey) {
        return [];
      }

      const response = await fetch(`${baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const res = (await response.json()) as any;

      return res.data.map((model: any) => ({
        name: model.id,
        label: model.id,
        provider: this.name,
        maxTokenAllowed: 8000,
      }));
    } catch (error) {
      console.error('Error getting OpenAILike models:', error);
      return [];
    }
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'https://glhf.chat/api/openai/v1',
      defaultApiTokenKey: 'GLHF_API_KEY',
    });

    if (!baseUrl || !apiKey) {
      throw new Error(`Missing configuration for ${this.name} provider`);
    }

    return getOpenAILikeModel(baseUrl, apiKey, model);
  }
}