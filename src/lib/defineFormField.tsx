import {StandardSchemaV1} from '@standard-schema/spec'
import {ComponentType, ReactNode} from 'react'
import {UseFormRegister} from 'react-hook-form'
import {
  defineType,
  FieldDefinition,
  FieldGroupDefinition,
  FieldsetDefinition,
  SchemaTypeDefinition,
} from 'sanity'

import {BaseFieldSelection, baseFieldSelection, baseFormFields} from '../schemas/baseFormFields'
import {getFormFieldName} from './constants'

type SharedFormComponentProps<
  TSelect extends Record<string, string> = Record<string, string>,
  TSelection extends Record<keyof TSelect, unknown> & BaseFieldSelection = Record<
    keyof TSelect,
    unknown
  > &
    BaseFieldSelection,
> = {
  field: TSelection & {name: string}
  error?: string
}

export type ErrorComponentProps = {
  error: string
}

export type InputComponentProps<
  TSelect extends Record<string, string> = Record<string, string>,
  TSelection extends Record<keyof TSelect, unknown> & BaseFieldSelection = Record<
    keyof TSelect,
    unknown
  > &
    BaseFieldSelection,
> = SharedFormComponentProps<TSelect, TSelection> & {
  register?: UseFormRegister<Record<string, unknown>>
}

export type FieldComponentProps<
  TSelect extends Record<string, string> = Record<string, string>,
  TSelection extends Record<keyof TSelect, unknown> & BaseFieldSelection = Record<
    keyof TSelect,
    unknown
  > &
    BaseFieldSelection,
> = SharedFormComponentProps<TSelect, TSelection> & {
  inputProps: InputComponentProps
  renderInput: (props: InputComponentProps) => ReactNode
  renderError: (props: ErrorComponentProps) => ReactNode
}

export type FormFieldDefinitionInput<
  TSelect extends Record<string, string> = Record<string, string>,
  TSelection extends Record<keyof TSelect, unknown> & BaseFieldSelection = Record<
    keyof TSelect,
    unknown
  > &
    BaseFieldSelection,
> = {
  name: string
  title?: string
  schema?: {
    groups?: FieldGroupDefinition[]
    fieldSets?: FieldsetDefinition[]
    icon?: ComponentType | ReactNode

    /**
     * Each field can have a group of either 'field' or 'validation'
     * If there is no group, it will default to 'field'
     * You can also extend the groups by adding more groups
     */
    fields?: FieldDefinition[]

    /**
     * Use this for complete control over the field schema
     *
     * Remember to use baseFormFields which is exported from this plugin
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DANGER_overrideSchemaProperties?: Record<any, any>
  }
  select: TSelect
  validationSchema: (selection: TSelection) => StandardSchemaV1
  components: {
    field?: (props: FieldComponentProps<TSelect, TSelection>) => ReactNode
    error?: (props: ErrorComponentProps) => ReactNode
    input: (props: InputComponentProps<TSelect, TSelection>) => ReactNode
  }
}

export type FormFieldDefinition = FormFieldDefinitionInput & {
  schema: SchemaTypeDefinition
}
export function defineFormField<
  TSelect extends Record<string, string> = Record<string, string>,
  TSelection extends Record<keyof TSelect, unknown> & BaseFieldSelection = Record<
    keyof TSelect,
    unknown
  > &
    BaseFieldSelection,
>(definition: FormFieldDefinitionInput<TSelect, TSelection>) {
  return definition
}

export function convertToInternalFormFieldDefinition(
  definition: FormFieldDefinitionInput,
): FormFieldDefinition {
  return {
    ...definition,
    select: {...baseFieldSelection, ...definition.select},
    schema: defineType({
      name: getFormFieldName(definition.name),
      title: definition.title,
      type: 'object',
      icon: definition.schema?.icon,
      groups: [
        {title: 'Field', name: 'field', default: true},
        {title: 'Validation', name: 'validation'},
        ...(definition.schema?.groups || []),
      ],
      fieldsets: [
        {name: 'title', title: '', options: {columns: 2, collapsible: false}},
        ...(definition.schema?.fieldSets || []),
      ],
      fields: [
        ...baseFormFields,
        ...(definition?.schema?.fields?.map((e) => ({...e, group: e.group || 'field'})) || []),
      ],
      preview: {
        select: {
          title: 'title',
        },
        prepare({title, name}) {
          return {
            title: title || name,
            subtitle: definition.title,
          }
        },
      },
      ...(definition.schema?.DANGER_overrideSchemaProperties || {}),
    }),
  }
}
