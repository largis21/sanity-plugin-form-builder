import {ProjectsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../lib/constants'
import {FormFieldDefinition} from '../lib/defineFormField'

export const getReusableGroupSchema = (fieldDefs: FormFieldDefinition[]) =>
  defineType({
    name: schemaTypeNames.reusableGroup,
    title: 'Reusable Group',
    type: 'document',
    icon: ProjectsIcon,
    fieldsets: [{name: 'title', title: '', options: {columns: 2, collapsible: false}}],
    preview: {
      select: {
        title: 'title',
        fields: 'fields',
      },
      prepare({title, fields}) {
        return {
          title: title,
          subtitle: `Reusable group with ${fields?.length || 0} field${fields?.length === 1 ? '' : 's'}`,
        }
      },
    },
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
        fieldset: 'title',
        validation: (Rule) => Rule.required(),
      }),

      defineField({
        name: 'name',
        title: 'Name',
        type: 'slug',
        fieldset: 'title',
        validation: (Rule) => Rule.required(),
      }),

      defineField({
        name: 'fields',
        title: 'Fields',
        type: 'array',
        of: fieldDefs.map((field) => ({type: field.schema.name})),
        validation: (Rule) => Rule.required().min(1),
      }),
    ],
  })
