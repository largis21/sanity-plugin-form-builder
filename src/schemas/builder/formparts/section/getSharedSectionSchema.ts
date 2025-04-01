import {defineArrayMember, defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../../../lib/constants'
import {FormFieldDefinition} from '../../../../lib/defineFormField'
import {fieldsArrayValidator} from '../../../../lib/fieldsArrayValidation'

export const _getSharedSectionSchema = (
  options: {
    name: string
    title: string
    type: 'document' | 'object'
  },
  fieldDefs: FormFieldDefinition[],
) =>
  defineType({
    name: options.name,
    title: options.title,
    type: options.type,
    fieldsets: [{name: 'title', title: '', options: {columns: 2, collapsible: false}}],
    preview: {
      select: {
        title: 'title',
        fields: 'fields',
      },
      prepare({title, fields}) {
        return {
          title: title,
          subtitle: `Section with ${fields?.length || 0} field${fields?.length === 1 ? '' : 's'}`,
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
        name: 'slug',
        title: 'Name',
        type: 'slug',
        options: {
          source: (value, context) => (context.parent as Record<string, unknown>).title as string,
          // Validation of slugs is handled by the fieldsArrayValidator
          isUnique: () => true,
        },
        fieldset: 'title',
        validation: (Rule) => Rule.required(),
      }),

      defineField({
        name: 'fields',
        title: 'Fields',
        type: 'array',
        of: [
          defineArrayMember({type: schemaTypeNames.fieldset}),
          defineArrayMember({type: 'reference', to: [{type: 'reusableFieldset'}]}),
          ...fieldDefs.map((field) => ({type: field.schema.name})),
        ],
        validation: fieldsArrayValidator,
      }),
    ],
  })
