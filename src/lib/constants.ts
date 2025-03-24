export const PLUGIN_SCOPE = 'form-plugin'

export const withPluginScope = (name: string) => `${PLUGIN_SCOPE}.${name}`

export const schemaTypeNames = {
  formBuilder: withPluginScope('builder'),
  submission: withPluginScope('submission'),
} as const

export function getFormFieldName(name: string) {
  return `${schemaTypeNames.formBuilder}.field.${name}`
}
