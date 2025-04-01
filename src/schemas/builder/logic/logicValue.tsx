import {CustomValidatorResult, defineField, defineType, ValidationContext} from 'sanity'

import {schemaTypeNames} from '../../../lib/constants'
import {unknownHasProperty} from '../../../lib/unknownHasProperty'
import {formPartTargetValidation, FormPartTargetValue} from '../formPartTarget'

type PreviewValue =
  | {type?: 'field'; field?: FormPartTargetValue}
  | {type?: 'stringLiteral'; stringLiteral?: string}
  | {type?: 'numberLiteral'; numberLiteral?: number}
  | {type?: 'booleanLiteral'; booleanLiteral?: boolean}

export function getPrettyLogicValue(value?: PreviewValue): string {
  switch (value?.type) {
    case 'field':
      return `Field: "${value.field?.titleCache || '[Invalid field]'}"`
    case 'stringLiteral':
      return `"${value.stringLiteral}"`
    case 'numberLiteral':
      return `${value.numberLiteral}`
    case 'booleanLiteral':
      return `${value.booleanLiteral}`
    default:
      return '[Invalid value]'
  }
}

export default defineType({
  name: schemaTypeNames.logicValue,
  type: 'object',
  preview: {
    select: {
      type: 'type',
      field: 'field',
      stringLiteral: 'stringLiteral',
      numberLiteral: 'numberLiteral',
      booleanLiteral: 'booleanLiteral',
    },
    prepare(selection) {
      return {
        title: selection.type || '[Invalid value]',
        subtitle: getPrettyLogicValue(selection),
      }
    },
  },
  validation: (Rule) => Rule.custom((value, context) => logicValueValidator(value, context)),
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Field-value', value: 'field'},
          {title: 'String', value: 'stringLiteral'},
          {title: 'Number', value: 'numberLiteral'},
          {title: 'Boolean', value: 'booleanLiteral'},
        ],
      },
    }),

    defineField({
      name: 'field',
      title: 'Target',
      hidden: ({parent}) => parent?.type !== 'field',
      type: schemaTypeNames.formPartTarget,
      options: {getOnlyFields: true},
    }),

    defineField({
      name: 'stringLiteral',
      title: 'String',
      hidden: ({parent}) => parent?.type !== 'stringLiteral',
      type: 'string',
    }),

    defineField({
      name: 'numberLiteral',
      title: 'Number',
      hidden: ({parent}) => parent?.type !== 'numberLiteral',
      type: 'number',
    }),

    defineField({
      name: 'booleanLiteral',
      title: 'Boolean',
      hidden: ({parent}) => parent?.type !== 'booleanLiteral',
      type: 'boolean',
    }),
  ],
})

export async function logicValueValidator(
  value: unknown,
  context: ValidationContext,
): Promise<CustomValidatorResult> {
  if (!unknownHasProperty(value, 'type')) {
    return {message: 'Type is required', path: ['type']}
  }

  const type = value.type

  if (typeof type !== 'string') {
    return {message: 'Type must be a string', path: ['type']}
  }

  switch (type) {
    case 'field': {
      if (!unknownHasProperty(value, 'field')) {
        return {message: 'Field is required', path: ['field']}
      }
      if (!unknownHasProperty(value.field, 'path')) {
        return {message: 'Field is required', path: ['field', 'path']}
      }
      if (!value.field.path) {
        return {message: 'Field is required', path: ['field', 'path']}
      }

      const fieldValidatorContext: ValidationContext = {
        ...context,
        parent: value,
        path: context.path && [...context.path, 'field'],
      }

      return await formPartTargetValidation(value.field, fieldValidatorContext)
    }
    case 'stringLiteral': {
      if (!unknownHasProperty(value, 'stringLiteral')) {
        return {message: 'This field is required', path: ['stringLiteral']}
      }
      if (typeof value.stringLiteral !== 'string') {
        return {message: 'This field is required', path: ['stringLiteral']}
      }
      break
    }
    case 'numberLiteral': {
      if (!unknownHasProperty(value, 'numberLiteral')) {
        return {message: 'This field is required', path: ['numberLiteral']}
      }
      if (typeof value.numberLiteral !== 'number') {
        return {message: 'This field is required', path: ['numberLiteral']}
      }
      break
    }
    case 'booleanLiteral': {
      if (!unknownHasProperty(value, 'booleanLiteral')) {
        return {message: 'This field is required', path: ['booleanLiteral']}
      }
      if (typeof value.booleanLiteral !== 'boolean') {
        return {message: 'This field is required', path: ['booleanLiteral']}
      }
      break
    }
    default: {
      console.warn('Got unknown type in condition value', type)
      return true
    }
  }

  return true
}
