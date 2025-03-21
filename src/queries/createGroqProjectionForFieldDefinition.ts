import {FormFieldDefinition} from '../lib/defineFormField'
import {BaseFieldSelection} from '../schemas/baseFormFields'

export const createGroqProjectionForFieldDefinition = (fieldDefinition: FormFieldDefinition) => `
_key,
_type,
${Object.entries(fieldDefinition.select)
  .map(([key, value]) => `"${key}": ${value}`)
  .join(',\n')}
`

export type FormField = BaseFieldSelection & {
  _type: string
  _key: string
  [key: string]: unknown
}
