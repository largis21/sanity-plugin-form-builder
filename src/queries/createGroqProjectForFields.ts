import {FormFieldDefinition} from '../lib/defineFormField'
import {
  BaseFormField,
  createGroqProjectionForFieldDefinition,
} from './createGroqProjectionForFieldDefinition'

export const createGroqProjectionForFields = (fields: FormFieldDefinition[]) =>
  fields
    .map(
      (field) => `
        (_type == "${field.schema.name}") => {
          ${createGroqProjectionForFieldDefinition(field)} 
        }
      `,
    )
    .join(',')

export type FormField = BaseFormField & {
  [key: string]: unknown
}
