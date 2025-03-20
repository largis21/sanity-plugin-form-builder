import {ComponentType} from 'react'

import {FormFieldDefinition} from '../lib/defineFormField'
import {Form as iForm} from '../queries/createGroqProjectionForForm'

export type RenderForm = ComponentType<{form: iForm}>

export function getRenderForm(formFields: FormFieldDefinition[]) {
  return function Form(props: {form: iForm}) {
    return (
      <form>
        {props.form.title && <h1>{props.form.title}</h1>}
        {props.form.fields?.map((field) => {
          const fieldDefinition = formFields.find((f) => f.name === field._type)

          if (!fieldDefinition) {
            console.warn(`Could not find field definition for fieldType: '${field._type}'`)
            return null
          }

          return <fieldDefinition.render key={field._key} field={field} />
        })}
      </form>
    )
  }
}
