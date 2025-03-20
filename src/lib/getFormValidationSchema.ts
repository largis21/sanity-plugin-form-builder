import {z} from 'zod'

import {Form} from '../queries/createGroqProjectionForForm'
import {FormFieldDefinition} from './defineFormField'

export function getFormValidationSchema(formFields: FormFieldDefinition[], form: Form) {
  return z.object(
    form.fields?.reduce((acc, field) => {
      if (!field.name) return acc
      const fieldDefinition = formFields.find((f) => f.schema.name === field._type)

      if (!fieldDefinition) return acc

      const fieldSchema = fieldDefinition.validationSchema(field)

      return {
        ...acc,
        [field.name]: fieldSchema,
      }
    }, {}) || {},
  )
}
