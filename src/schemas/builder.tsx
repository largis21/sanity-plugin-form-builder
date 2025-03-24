import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../lib/constants'
import {FormFieldDefinition} from '../lib/defineFormField'

export const getFormBuilderSchema = (formFields: FormFieldDefinition[]) =>
  defineType({
    name: schemaTypeNames.formBuilder,
    title: 'Form Builder',
    type: 'document',
    groups: [
      {default: true, name: 'builder', title: 'Form builder'},
      {name: 'settings', title: 'Settings'},
    ],
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule) => Rule.required(),
        group: 'builder',
      }),

      defineField({
        name: 'fields',
        title: 'Fields',
        type: 'array',
        of: formFields.map((field) => ({type: field.schema.name})),
        group: 'builder',
        validation: (Rule) => Rule.required().min(1),
      }),
    ],
  })
