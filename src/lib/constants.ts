type Join<T extends string[], D extends string> = T extends [
  infer F extends string,
  ...infer R extends string[],
]
  ? R['length'] extends 0
    ? F
    : `${F}${D}${Join<R, D>}`
  : never

export const buildTypeName = <T extends [string, ...string[]]>(...scopes: T): Join<T, '.'> => {
  return scopes.join('.') as Join<T, '.'>
}

export const PLUGIN_SCOPE = 'form-plugin' as const
export const BUILDER_SCOPE = 'builder' as const
export const FIELD_SCOPE = 'field' as const
export const LOGIC_SCOPE = 'logic' as const
export const CONDITION_SCOPE = 'conditions' as const
export const ACTIONS_SCOPE = 'actions' as const
export const SUBMISSION_SCOPE = 'submission' as const

export const schemaTypeNames = {
  // prettier-ignore
  formBuilder:           buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE),
  // prettier-ignore
  formPartTarget:        buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, 'formPartTarget'),
  // prettier-ignore
  fieldset:              buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, 'fieldset'),
  // prettier-ignore
  reusableFieldset:      buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, 'reusableFieldset'),
  // prettier-ignore
  section:               buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, 'section'),
  // prettier-ignore
  reusableSection:       buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, 'reusableSection'),
  // prettier-ignore
  logic:                 buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, LOGIC_SCOPE),
  // prettier-ignore
  conditions:            buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, LOGIC_SCOPE, CONDITION_SCOPE),
  // prettier-ignore
  hasValueCondition:     buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, LOGIC_SCOPE, CONDITION_SCOPE, 'hasValue'),
  // prettier-ignore
  binaryOpCondition:     buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, LOGIC_SCOPE, CONDITION_SCOPE, 'binaryOp'),
  // prettier-ignore
  logicValue:            buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, LOGIC_SCOPE, 'value'),
  // prettier-ignore
  actions:               buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, ACTIONS_SCOPE),
  // prettier-ignore
  setFormpartVisibility: buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, ACTIONS_SCOPE, 'setFormpartVisibility'),
  // prettier-ignore
  submission:            buildTypeName(PLUGIN_SCOPE, SUBMISSION_SCOPE),
} as const

export function getFormFieldName(name: string) {
  return buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, FIELD_SCOPE, name)
}

export const isFormFieldName = (name: string): name is ReturnType<typeof getFormFieldName> =>
  name.startsWith(`${buildTypeName(PLUGIN_SCOPE, BUILDER_SCOPE, FIELD_SCOPE)}.`)
