import {defineField, FieldDefinition} from 'sanity'

export const baseFormFields: FieldDefinition[] = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    group: 'field',
    fieldset: 'title',
    validation: (Rule) => Rule.required(),
  }),

  defineField({
    name: 'name',
    title: 'Name',
    type: 'slug',
    options: {
      source: (value, context) => (context.parent as Record<string, unknown>).title as string,
      isUnique: (value, context) => {
        const fields = context.document?.fields
        if (!Array.isArray(fields)) return true

        return fields.filter((field) => field.name.current === value).length === 1
      },
    },
    group: 'field',
    fieldset: 'title',
    validation: (Rule) => Rule.required(),
  }),

  defineField({
    name: 'width',
    title: 'Width',
    type: 'string',
    initialValue: '12',
    validation: (Rule) => Rule.required(),
    group: 'field',
    options: {
      list: [
        {title: 'Full width', value: '12'},
        {title: 'Half width', value: '6'},
        {title: 'Third width', value: '4'},
        {title: 'Quarter width', value: '3'},
      ],
    },
  }),

  defineField({
    name: 'required',
    title: 'Required',
    type: 'boolean',
    group: 'validation',
    initialValue: false,
  }),
]

export const baseFieldSelection = {
  title: 'title',
  name: 'name.current',
  width: 'coalesce(width, "12")',
  required: 'coalesce(required, false)',
}

export type BaseFieldSelection = {
  title?: string
  name?: string
  width: string
  required: boolean
}
