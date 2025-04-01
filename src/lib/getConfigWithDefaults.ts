import {FormPluginConfig} from '../configureFormPlugin'

export function getConfigWithDefaults(config: FormPluginConfig) {
  return {
    builder: {
      enabled: true,
      fields: [],
      ...config.builder,
    },
    submissionsTool: {
      enabled: true,
      ...config.submissionsTool,
    },
  }
}
