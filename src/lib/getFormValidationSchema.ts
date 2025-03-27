import {StandardSchemaV1} from '@standard-schema/spec'

import {FormProjectionResult} from '../queries/createGroqProjectionForForm'
import {FormFieldDefinition} from './defineFormField'

export function getFormValidationSchema(
  formFields: FormFieldDefinition[],
  form: FormProjectionResult,
) {
  const schema: StandardSchemaV1<Record<string, unknown>> = {
    '~standard': {
      version: 1,
      vendor: 'sanity-plugin-form-builder',
      validate: async (value) => {
        if (typeof value !== 'object' || value === null) {
          return {issues: [{path: [], message: 'Value must be an object'}]}
        }

        const result: Record<string, unknown> = {}
        const issues: StandardSchemaV1.Issue[] = []

        for (const fieldSelection of form.fields || []) {
          if (!fieldSelection.name) continue

          const fieldDefinition = formFields.find((f) => f.schema.name === fieldSelection._type)
          if (!fieldDefinition) continue

          const fieldSchema = fieldDefinition.validationSchema(fieldSelection)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let fieldResult = fieldSchema['~standard'].validate((value as any)[fieldSelection.name])
          if (fieldResult instanceof Promise) fieldResult = await fieldResult

          if (fieldResult.issues) {
            issues.push(
              ...fieldResult.issues.map((issue) => ({
                ...issue,
                path: [fieldSelection.name!],
              })),
            )
            continue
          }

          result[fieldSelection.name] = fieldResult.value
        }

        return issues.length > 0
          ? ({issues} as StandardSchemaV1.FailureResult)
          : ({value: result} as StandardSchemaV1.SuccessResult<Record<string, unknown>>)
      },
    },
  }

  return schema
}
