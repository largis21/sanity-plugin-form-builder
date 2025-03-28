import {ArrayRule, SlugValue, ValidationBuilder} from 'sanity'

import {getFormFieldName, schemaTypeNames} from './constants'

type FieldsArrayValue = ({_key: string} & (
  | {_type: ReturnType<typeof getFormFieldName>; name?: SlugValue}
  | {_type: typeof schemaTypeNames.group; name?: SlugValue}
  | {_type: typeof schemaTypeNames.reusableGroup; _ref: string}
))[]

export const fieldsArrayValidator: ValidationBuilder<
  ArrayRule<FieldsArrayValue>,
  FieldsArrayValue
> = (Rule) =>
  Rule.custom(async (value, context) => {
    const slugs: {_key: string; value: string}[] = []
    const reusableGroupRefs: {_key: string; _ref: string}[] = []

    // First pass: collect slugs and references
    value?.forEach((field) => {
      if ('name' in field && field.name?.current) {
        slugs.push({_key: field._key, value: field.name.current})
      }

      if ('_ref' in field) {
        reusableGroupRefs.push({_key: field._key, _ref: field._ref})
      }
    })

    // Fetch all reusable groups at once
    if (reusableGroupRefs.length > 0) {
      const client = context.getClient({apiVersion: '2021-03-25'})
      const groups = await Promise.all(
        reusableGroupRefs.map((ref) =>
          client.fetch<{name?: SlugValue; _key: string}>(
            `*[_id == $id][0] { name, "_key": $key }`,
            {id: ref._ref, key: ref._key},
          ),
        ),
      )

      // Process the fetched groups
      groups.forEach((group) => {
        if (group && group.name?.current) {
          slugs.push({_key: group._key, value: group.name.current})
        }
      })
    }

    const nonUniqueSlugs = slugs.filter(
      (slug) => slugs.filter((otherSlug) => otherSlug.value === slug.value).length > 1,
    )

    const returns = !nonUniqueSlugs.length || {
      paths: nonUniqueSlugs.flatMap((slug) => [[{_key: slug._key}], [{_key: slug._key}, 'name']]),
      message: 'Slugs must be unique',
    }

    return returns
  })
