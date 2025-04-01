import {defineArrayMember, defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../lib/constants'
import {FormFieldDefinition} from '../../lib/defineFormField'
import {fieldsArrayValidator} from '../../lib/fieldsArrayValidation'

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
        type: 'string',
        validation: (Rule) => Rule.required(),
        group: 'builder',
      }),

      defineField({
        name: 'formType',
        type: 'string',
        options: {
          list: [
            {title: 'Simple', value: 'simple'},
            {title: 'Multiple Sections', value: 'multiSection'},
          ],
        },
        initialValue: 'form',
        group: 'builder',
      }),

      defineField({
        name: 'fields',
        type: 'array',
        of: [
          defineArrayMember({type: schemaTypeNames.fieldset}),
          defineArrayMember({type: 'reference', to: [{type: schemaTypeNames.reusableFieldset}]}),
          ...formFields.map((field) => ({type: field.schema.name})),
        ],
        group: 'builder',
        validation: fieldsArrayValidator,
        hidden: ({document}) => document?.formType !== 'simple',
      }),

      // defineField({
      //   name: 'sections',
      //   type: 'array',
      //   of: [
      //     defineArrayMember({type: schemaTypeNames.section}),
      //     defineArrayMember({type: schemaTypeNames.reusableSection}),
      //   ],
      //   hidden: ({document}) => document?.formType !== 'simple',
      // }),

      defineField({
        name: 'logic',
        group: 'builder',
        type: 'array',
        of: [defineArrayMember({type: schemaTypeNames.logic})],
      }),
    ],
  })
