export const PLUGIN_SCOPE = 'form-plugin' as const

export const withPluginScope = (name: string) => `${PLUGIN_SCOPE}.${name}` as const

const formBuilderTypeName = 'builder' as const

export const schemaTypeNames = {
  formBuilder: withPluginScope(formBuilderTypeName),
  submission: withPluginScope(`submission`),
  logic: withPluginScope(`${formBuilderTypeName}.logic`),
  fieldSelect: withPluginScope(`${formBuilderTypeName}.fieldSelect`),
  group: withPluginScope(`${formBuilderTypeName}.group`),
  reusableGroup: withPluginScope(`${formBuilderTypeName}.reusableGroup`),
} as const

export function getFormFieldName(name: string) {
  return `${schemaTypeNames.formBuilder}.field.${name}` as const
}
