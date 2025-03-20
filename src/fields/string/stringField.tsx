import {defineField} from 'sanity'
import {z} from 'zod'

import {defineFormField} from '../../lib/defineFormField'

export default defineFormField({
  name: 'string',
  title: 'Text',
  select: {
    _type: '_type',
    placeholder: 'placeholder',
    autocomplete: 'autocomplete',
    required: 'required',
    minLength: 'minLength',
    maxLength: 'maxLength',
  },
  validationSchema: (selection) => {
    const schema = z.string().min(selection.minLength).max(selection.maxLength)

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
  render: ({field}) => {
    return <input type="text" placeholder={field.placeholder} required={field.required} />
  },
})
