import {Path, SanityClient, SlugValue} from 'sanity'

import {getFormFieldName, isFormFieldName, schemaTypeNames} from './constants'

export type FieldsArrayValue = ({_key: string} & (
  | {_type: ReturnType<typeof getFormFieldName>; slug?: SlugValue; title: string}
  | {
      _type: typeof schemaTypeNames.fieldset
      slug?: SlugValue
      title: string
      fields: FieldsArrayValue
    }
  | {_type: 'reference'; _ref: string} // in this case we need to fetch the document and validate the slug
))[]

export async function getAllFieldSlugs(
  fields: FieldsArrayValue,
  client: SanityClient,
  options: {
    getChildren?: boolean
    getOnlyFieldSlugs?: boolean
    path?: Path
    pathTitle?: string
  } = {},
) {
  const {getChildren = true, getOnlyFieldSlugs = false, path = [], pathTitle} = options

  const slugs: {path: Path; value: string; title: string}[] = []
  const reusableFormPartRefs: {path: Path; _ref: string}[] = []

  for (const field of fields) {
    if (isFormFieldName(field._type) && 'slug' in field && field.slug?.current) {
      slugs.push({
        path: [...path, {_key: field._key}],
        value: field.slug.current,
        title: `${pathTitle ? `${pathTitle}.` : ''}${field.title}`,
      })

      continue
    }

    if (field._type === 'reference') {
      reusableFormPartRefs.push({
        path: [...path, {_key: field._key}],
        _ref: field._ref,
      })
    }

    if (getOnlyFieldSlugs) continue

    if (field._type === schemaTypeNames.fieldset && field.slug?.current) {
      slugs.push(
        {
          path: [...path, {_key: field._key}],
          value: field.slug.current,
          title: `${pathTitle ? `${pathTitle}.` : ''}${field.title}`,
        },
        ...(await getAllFieldSlugs(field.fields, client, {
          getChildren,
          getOnlyFieldSlugs,
          path: [...path, {_key: field._key}, 'fields'],
          pathTitle: `${pathTitle ? `${pathTitle}.` : ''}${field.title}`,
        })),
      )
    }
  }

  if (reusableFormPartRefs.length > 0) {
    const reusableFormParts = await Promise.all(
      reusableFormPartRefs.map((ref) =>
        (async () => {
          const reusableFormPart = await client.fetch<{
            slug?: SlugValue
            title?: string
            fields?: FieldsArrayValue
          }>(`*[_id == $id][0] { slug, title, fields }`, {
            id: ref._ref,
          })

          if (!reusableFormPart.slug?.current) {
            console.warn(`This document does not have a slug:`, reusableFormPart)
            return []
          }

          return [
            {
              path: [...ref.path, 'fields'],
              value: reusableFormPart.slug.current,
              title: `${pathTitle ? `${pathTitle}.` : ''}${reusableFormPart.title}`,
            },
            ...(getChildren && reusableFormPart.fields?.length
              ? await getAllFieldSlugs(reusableFormPart.fields, client, {
                  getChildren,
                  path: [...ref.path, 'fields'],
                  pathTitle: `${pathTitle ? `${pathTitle}.` : ''}${reusableFormPart.title}`,
                })
              : []),
          ]
        })(),
      ),
    )

    reusableFormParts.forEach((fieldset) => {
      slugs.push(...fieldset)
    })
  }

  return slugs
}
