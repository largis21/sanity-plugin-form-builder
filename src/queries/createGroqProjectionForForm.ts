import {FormFieldDefinition} from '../lib/defineFormField'
import {createGroqProjectionForFields, FormFields} from './createGroqProjectForFields'

export const createGroqProjectionForForm = (formFields: FormFieldDefinition[]) => `
_id,
title,
ingress,
'fields': fields[]{
  ${createGroqProjectionForFields(formFields)}
}
`

export type Form = {
  _id: string
  title?: string
  ingres?: string
  fields?: FormFields
}
