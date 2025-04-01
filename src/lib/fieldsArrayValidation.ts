import {ArrayRule, CustomValidator, CustomValidatorResult, ValidationBuilder} from 'sanity'

import {FieldsArrayValue, getAllFieldSlugs} from './getAllFieldSlugs'
import {TODO} from './types'

export const noFieldsDefinedValidator = (value: unknown): CustomValidatorResult => {
  if (!value) return 'No fields defined'
  if (!Array.isArray(value)) return 'Invalid field'
  if (value.length === 0) return 'No fields defined'
  return true
}

export const fieldSlugsValidator: CustomValidator<unknown> = async (value, context) => {
  if (!value || !Array.isArray(value) || !value.length) {
    return true
  }

  const slugs = await getAllFieldSlugs(
    value as TODO,
    context.getClient({apiVersion: '2021-03-25'}),
    {
      getChildren: false,
    },
  )

  const nonUniqueSlugs = slugs.filter(
    (slug) => slugs.filter((otherSlug) => otherSlug.value === slug.value).length > 1,
  )

  return (
    !nonUniqueSlugs.length || {
      paths: nonUniqueSlugs.map((slug) => slug.path),
      message: 'Slugs must be unique',
    }
  )
}
export const fieldsArrayValidator: ValidationBuilder<
  ArrayRule<FieldsArrayValue>,
  FieldsArrayValue
> = (Rule) => [Rule.custom(noFieldsDefinedValidator), Rule.custom(fieldSlugsValidator)]
