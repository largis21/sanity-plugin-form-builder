import {StandardSchemaV1} from '@standard-schema/spec'
import {ComponentType, ReactNode} from 'react'
import {
  defineType,
  FieldDefinition,
  FieldGroupDefinition,
  FieldsetDefinition,
  SchemaTypeDefinition,
} from 'sanity'

import {BaseFieldSelection, baseFormFields} from '../schemas/baseFormFields'
import {withPluginScope} from './constants'

export type FormFieldDefinitionInput<
  TSelect extends Record<string, string> = Record<string, string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TSelection extends Record<keyof TSelect | keyof BaseFieldSelection, any> = Record<
    keyof TSelect | keyof BaseFieldSelection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
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
  validationSchema: (fieldValue: TSelection) => StandardSchemaV1
  render: ComponentType<{field: TSelection}>
}

export type FormFieldDefinition = FormFieldDefinitionInput & {
  schema: SchemaTypeDefinition
}

export function defineFormField<
  TSelect extends Record<string, string> = Record<string, string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TSelection extends Record<keyof TSelect | keyof BaseFieldSelection, any> = Record<
    keyof TSelect | keyof BaseFieldSelection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
>(definition: FormFieldDefinitionInput<TSelect, TSelection>): FormFieldDefinition {
  // @ts-expect-error feel free to fix the type if you want
  return {
    ...definition,
    schema: defineType({
      name: withPluginScope(`field.${definition.name}`),
      title: definition.title,
      type: 'object',
      icon: definition.schema?.icon,
      groups: [
        {title: 'Field', name: 'field', default: true},
        {title: 'Validation', name: 'validation'},
        ...(definition.schema?.groups || []),
      ],
      fieldsets: definition.schema?.fieldSets || [],
      fields: [
        ...baseFormFields,
        ...(definition?.schema?.fields?.map((e) => ({...e, group: e.group || 'field'})) || []),
      ],
      preview: {
        select: {
          title: 'name.title',
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
