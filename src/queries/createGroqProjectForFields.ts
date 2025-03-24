import {FormFieldDefinition} from '../lib/defineFormField'
import {
  createGroqProjectionForFieldDefinition,
  FormFieldProjectionResult,
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

export type FormFieldsProjectionResult = FormFieldProjectionResult[]
