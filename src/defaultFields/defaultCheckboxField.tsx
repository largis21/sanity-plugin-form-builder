import {z} from 'zod'

import {defineFormField} from '../lib/defineFormField'

export const defaultCheckboxField = defineFormField({
  name: 'checkbox',
  title: 'Checkbox',
  validationSchema: (selection) => {
    if (selection.required) {
      return z.literal(true, {errorMap: () => ({message: 'This field is required'})})
    }

    return z.boolean().nullable()
  },
  components: {
    input: (props) => (
      <label>
        <input type="checkbox" {...props.register?.(props.field.name)} />
        {props.field.title}
        {props.field.required && <span style={{color: 'red'}}>*</span>}
      </label>
    ),
    field: (props) => (
      <div>
        {props.renderInput(props.inputProps)}
        {props.renderError({error: props.error})}
      </div>
    ),
  },
})
