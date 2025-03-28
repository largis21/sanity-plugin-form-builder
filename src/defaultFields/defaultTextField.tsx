import {defineField} from 'sanity'
import {z} from 'zod'

import {autocompleteAttribute} from '../lib/autocompleteAttribute'
import {defineFormField} from '../lib/defineFormField'

export const defaultTextField = defineFormField({
  name: 'text',
  title: 'Multiline Text',
  select: {
    _type: '_type',
    placeholder: 'placeholder',
    autocomplete: 'autocomplete',
    minLength: 'minLength',
    maxLength: 'maxLength',
  },
  validationSchema: (selection) => {
    const schema = z
      .string({
        errorMap: (data) => {
          switch (data.code) {
            case 'too_small':
              if (selection.required && data.minimum === 1) {
                return {message: 'This field is required'}
              }

              return {
                message: `This field must be at least ${data.minimum} characters`,
              }
            case 'too_big':
              return {message: `This field must be at most ${data.maximum} characters`}
            default:
              return {message: 'Invalid value'}
          }
        },
      })
      .min(
        selection.required ? (selection.minLength as number) || 1 : (selection.minLength as number),
      )
      .max((selection.maxLength as number) || Infinity)

    if (selection.required) {
      return schema
    }

    return schema.nullable()
  },
  schema: {
    fields: [
      defineField({
        name: 'placeholder',
        title: 'Placeholder',
        type: 'string',
      }),

      defineField({
        name: 'autocomplete',
        title: 'Autocomplete',
        type: 'string',
        options: {list: autocompleteAttribute},
      }),

      defineField({
        name: 'minLength',
        title: 'Minimum Length',
        type: 'number',
        group: 'validation',
      }),

      defineField({
        name: 'maxLength',
        title: 'Maximum Length',
        type: 'number',
        group: 'validation',
      }),
    ],
  },
  components: {
    input: (props) => (
      <textarea
        placeholder={props.field.placeholder as string | undefined}
        required={props.field.required}
        minLength={props.field.minLength as number | undefined}
        maxLength={props.field.maxLength as number | undefined}
        style={{
          marginTop: '4px',
          padding: '8px',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'transparent',
          border: '1px solid #ccc',
          color: '#000',
          borderRadius: '4px',
          resize: 'vertical',
        }}
        {...props.register?.(props.field.name)}
      />
    ),
  },
})
