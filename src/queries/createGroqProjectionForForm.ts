import {FormFieldDefinition} from '../lib/defineFormField'
import {createGroqProjectionForFields, FormFields} from './createGroqProjectForFields'

export const createGroqProjectionForForm = (formFields: FormFieldDefinition[]) => `
_id,
title,
submitter,
'fields': fields[]{
  ${createGroqProjectionForFields(formFields)}
}
`

export type Form = {
  _id: string
  title?: string
  fields?: FormFields
}
