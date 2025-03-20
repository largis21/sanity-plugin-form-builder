export const PLUGIN_SCOPE = 'form-builder'

export const withPluginScope = (name: string) => `${PLUGIN_SCOPE}.${name}`

export const schemaTypeNames = {
  formBuilder: withPluginScope('formBuilder'),
} as const
