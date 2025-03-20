import {FormFieldDefinition} from '../lib/defineFormField'
import {createGroqProjectionForFieldDefinition} from './createGroqProjectionForFieldDefinition'

export const createGroqProjectionForFields = (fields: FormFieldDefinition[]) =>
  fields
    .map(
      (field) => `
        _key,
        _type,
        "required": coalesce(required, false),
        "name": name.name,
        "title": name.title,
        (_type == "${field.schema.name}") => {
          ${createGroqProjectionForFieldDefinition(field)} 
        }
      `,
    )
    .join(',')

export type BaseFormField = {
  _type: string
  _key: string
  name?: string
  title?: string
  required?: boolean
}

export type FormField = BaseFormField & {
  [key: string]: unknown
}
