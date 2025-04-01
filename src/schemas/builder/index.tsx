import {Card, Text} from '@sanity/ui'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../lib/constants'
import {FormFieldDefinition} from '../../lib/defineFormField'
import {fieldSlugsValidator, noFieldsDefinedValidator} from '../../lib/fieldsArrayValidation'
import {unknownHasProperty} from '../../lib/unknownHasProperty'

export const getFormBuilderSchema = (formFields: FormFieldDefinition[]) =>
  defineType({
    name: schemaTypeNames.formBuilder,
    title: 'Form Builder',
    type: 'document',
    groups: [
      {default: true, name: 'builder', title: 'Form builder'},
      {name: 'instructions', title: 'Instructions'},
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
            {title: 'Multiple Sections', value: 'sections'},
          ],
        },
        initialValue: 'form',
        group: 'builder',
        validation: (Rule) => Rule.required(),
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
        validation: (Rule) => [
          Rule.custom((value, context) => {
            if (!unknownHasProperty(context.parent, 'formType')) return true
            if (context.parent.formType !== 'simple') return true

            return noFieldsDefinedValidator(value)
          }).warning(),
          Rule.custom(async (value, context) => {
            if (!unknownHasProperty(context.parent, 'formType')) return true
            if (context.parent.formType !== 'simple') return true

            return await fieldSlugsValidator(value, context)
          }),
        ],
        hidden: ({document}) => document?.formType !== 'simple',
      }),

      defineField({
        name: 'sections',
        type: 'array',
        of: [
          defineArrayMember({type: schemaTypeNames.section}),
          defineArrayMember({type: 'reference', to: [{type: schemaTypeNames.reusableSection}]}),
        ],
        group: 'builder',
        validation: (Rule) =>
          Rule.custom((value, context) => {
            if (!unknownHasProperty(context.parent, 'formType')) return true
            if (context.parent.formType !== 'sections') return true

            if (!value) return 'No sections defined'
            if (value.length === 0) return 'No sections defined'
            return true
          }).warning(),
        hidden: ({document}) => document?.formType !== 'sections',
      }),

      defineField({
        name: 'logic',
        group: 'builder',
        type: 'array',
        of: [defineArrayMember({type: schemaTypeNames.logic})],
      }),

      defineField({
        name: 'instructions',
        type: 'string',
        group: 'instructions',
        components: {
          field: () => (
            <Card tone="primary" padding={4} radius={2} border>
              <Text size={4}>Form builder</Text>

              <Text size={3} style={{marginTop: '24px'}}>
                Usage
              </Text>
              <Text size={2} style={{marginTop: '12px'}}>
                To create a form, add fields or sections to the form builder. You can preview the
                form as you&apos;re defining fields with the &apos;Form Preview&apos; button on the
                top right.
              </Text>

              <Text size={3} style={{marginTop: '24px'}}>
                Validation
              </Text>
              <Text size={2} style={{marginTop: '12px'}}>
                Each field-type has its own validation logic. This is used on the frontend where the
                user fills out the form, and also on the backend where the form is sent. It should
                therefore be impossible for invalid data to be saved (Depends on implementation).
                <br /> <br />
                Fields which are hidden by logic will not be validated. The validation process will
                run the form-logic before validating to remove fields that are hidden
              </Text>
            </Card>
          ),
        },
      }),
    ],
  })
