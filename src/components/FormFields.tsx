import {ComponentType, DetailedHTMLProps, HTMLAttributes} from 'react'
import {UseFormReturn} from 'react-hook-form'

import {FieldComponentProps, FormFieldDefinition} from '../lib/defineFormField'
import {FormProjectionResult as iForm} from '../queries/createGroqProjectionForForm'
import {DefaultError} from './DefaultError'
import {DefaultField} from './DefaultField'
import {FormFieldWrapper} from './FormFieldWrapper'

export type FormFieldsComponent = ComponentType<
  {
    form: iForm
    hook?: UseFormReturn
  } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>

/*
 * const useFormReturn = useForm<Record<string, unknown>>({
 *   resolver: standardSchemaResolver(getFormValidationSchema(formFields, form)),
 * })
 *
 * return (
 *   <form onSubmit={handleSubmit(onSubmit)}>
 *     <FormFields form={form} hook={useFormReturn} />
 *     <button type="submit">Submit</button>
 *   </form>
 * )
 */
export function getFormFieldsComponent(formFields: FormFieldDefinition[]): FormFieldsComponent {
  return function FormFields({form, hook, ...restProps}) {
    return (
      <div
        style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem'}}
        {...restProps}
      >
        {form.fields?.map((field) => {
          if (!field.name) return null
          const fieldDefinition = formFields.find((f) => f.schema.name === field._type)

          if (!fieldDefinition) {
            console.warn(`Could not find field definition for fieldType: '${field._type}'`)
            return null
          }

          const error = hook?.formState.errors[field.name]?.message

          const fieldProps: FieldComponentProps = {
            field: {...field, name: field.name},
            error: typeof error === 'string' ? error : undefined,
            inputProps: {field: {...field, name: field.name}, register: hook?.register},
            renderInput: fieldDefinition.components.input,
            renderError: fieldDefinition.components.error || DefaultError,
          }

          const renderField = fieldDefinition.components.field || DefaultField

          return (
            <FormFieldWrapper field={field} key={field._key}>
              {renderField(fieldProps)}
            </FormFieldWrapper>
          )
        })}
      </div>
    )
  }
}
