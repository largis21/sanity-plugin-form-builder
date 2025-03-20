import {standardSchemaResolver} from '@hookform/resolvers/standard-schema'
import {ComponentType, DetailedHTMLProps, FormHTMLAttributes} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

import {FormFieldDefinition} from '../lib/defineFormField'
import {getFormValidationSchema} from '../lib/getFormValidationSchema'
import {Form as iForm} from '../queries/createGroqProjectionForForm'
import {FormField} from './FormField'

export type RenderForm = ComponentType<
  {
    form: iForm
  } & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
>

export function getRenderForm(formFields: FormFieldDefinition[]): RenderForm {
  return function Form(props) {
    const schema = getFormValidationSchema(formFields, props.form)

    const {
      register,
      handleSubmit,
      formState: {errors},
    } = useForm<Record<string, unknown>>({
      resolver: standardSchemaResolver(schema),
    })

    const handleSuccessfulSubmit: SubmitHandler<Record<string, unknown>> = (formData) => {
      // eslint-disable-next-line no-console
      console.log('SUCCESS', formData)
    }

    return (
      <form
        onSubmit={handleSubmit(handleSuccessfulSubmit)}
        style={{
          maxWidth: '500px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem'}}>
          {props.form.fields?.map((field) => {
            if (!field.name) return null
            const fieldDefinition = formFields.find((f) => f.schema.name === field._type)

            if (!fieldDefinition) {
              console.warn(`Could not find field definition for fieldType: '${field._type}'`)
              return null
            }
            return (
              <FormField field={field} key={field._key}>
                <fieldDefinition.render
                  field={field}
                  register={register}
                  error={errors[field.name!]?.message}
                />
              </FormField>
            )
          })}
        </div>
        <div style={{marginTop: '1rem'}}>
          <button type="submit">Submit</button>
        </div>
      </form>
    )
  }
}
