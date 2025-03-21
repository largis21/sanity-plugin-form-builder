import {defineField} from 'sanity'
import {z} from 'zod'

import {defineFormField} from 'sanity-plugin-form-builder'

export default defineFormField({
  name: 'string',
  title: 'Text',
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
    fieldSets: [{name: 'advanced', title: 'Advanced', options: {collapsed: true}}],
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
        description: (
          <>
            For example: &quot;email&quot;, &quot;given-name&quot;, &quot;family-name&quot;{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values">
              Complete list here
            </a>
          </>
        ),
        fieldset: 'advanced',
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
  render: ({field, register, error}) => {
    return (
      <div>
        <label style={{display: 'flex', flexDirection: 'column', fontSize: '14px'}}>
          {field.title}
          <input
            type="text"
            placeholder={field.placeholder as string | undefined}
            required={field.required}
            minLength={field.minLength as number | undefined}
            maxLength={field.maxLength as number | undefined}
            style={{
              marginTop: '4px',
              padding: '8px',
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: 'transparent',
              border: '1px solid #ccc',
              color: '#000',
              borderRadius: '4px',
            }}
            {...register(field.name)}
          />
          {error && <span style={{color: 'red', marginTop: '2px', fontSize: '12px'}}>{error}</span>}
        </label>
      </div>
    )
  },
})
