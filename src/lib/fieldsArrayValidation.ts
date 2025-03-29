import {ArrayRule, ValidationBuilder} from 'sanity'

import {FieldsArrayValue, getAllFieldSlugs} from './getAllFieldSlugs'

export const fieldsArrayValidator: ValidationBuilder<
  ArrayRule<FieldsArrayValue>,
  FieldsArrayValue
> = (Rule) =>
  Rule.custom(async (value, context) => {
    if (!value || !value.length) {
      return true
    }

    const slugs = await getAllFieldSlugs(value, context.getClient({apiVersion: '2021-03-25'}), {
      getChildren: false,
    })

    const nonUniqueSlugs = slugs.filter(
      (slug) => slugs.filter((otherSlug) => otherSlug.value === slug.value).length > 1,
    )

    return (
      !nonUniqueSlugs.length || {
        paths: nonUniqueSlugs.map((slug) => slug.path),
        message: 'Slugs must be unique',
      }
    )
  })
