import {Path, SanityClient, SlugValue} from 'sanity'

import {getFormFieldName, isFormFieldName, schemaTypeNames} from './constants'

export type FieldsArrayValue =
  | ({_key: string} & (
      | {_type: ReturnType<typeof getFormFieldName>; slug?: SlugValue; title: string}
      | {
          _type: typeof schemaTypeNames.fieldset
          slug?: SlugValue
          title: string
          fields: FieldsArrayValue
        }
      | {
          _type: typeof schemaTypeNames.section
          slug?: SlugValue
          title: string
          fields: FieldsArrayValue
        }
      | {_type: 'reference'; _ref: string} // in this case we need to fetch the document and validate the slug
    ))[]
  | undefined

type SlugsResult = {formPartType: string; path: Path; value: string; title: string}[]

type Options = {
  getChildren?: boolean
  getOnlyFieldSlugs?: boolean
  path?: Path
  pathTitle?: string
}

export async function getAllFieldSlugs(
  fields: FieldsArrayValue,
  client: SanityClient,
  _options: Options = {},
): Promise<SlugsResult> {
  const options = {
    getChildren: true,
    getOnlyFieldSlugs: false,
    path: [],
    pathTitle: '',
    ..._options,
  }

  const slugs: SlugsResult = []
  const reusableFormPartRefs: {path: Path; _ref: string}[] = []

  for (const field of fields || []) {
    if (isFormFieldName(field._type) && 'slug' in field && field.slug?.current) {
      slugs.push({
        formPartType: 'Field',
        path: [...options.path, {_key: field._key}],
        value: field.slug.current,
        title: `${options.pathTitle ? `${options.pathTitle}.` : ''}${field.title}`,
      })

      continue
    }

    if (field._type === 'reference') {
      reusableFormPartRefs.push({
        path: [...options.path, {_key: field._key}, '->'],
        _ref: field._ref,
      })
    }

    if (field._type === schemaTypeNames.fieldset && field.slug?.current) {
      slugs.push(
        ...(options.getOnlyFieldSlugs
          ? []
          : [
              {
                formPartType: 'Fieldset',
                path: [...options.path, {_key: field._key}],
                value: field.slug.current,
                title: `${options.pathTitle ? `${options.pathTitle}.` : ''}${field.title}`,
              },
            ]),
        ...(await getAllFieldSlugs(field.fields, client, {
          ...options,
          path: [...options.path, {_key: field._key}],
          pathTitle: `${options.pathTitle ? `${options.pathTitle}.` : ''}${field.title}`,
        })),
      )
    }
  }

  if (!reusableFormPartRefs.length) {
    return slugs
  }

  const reusableFormParts = await Promise.all(
    reusableFormPartRefs.map((ref) => getReusableFormPartSlug(ref, client, options)),
  )

  reusableFormParts.forEach((formPart) => {
    slugs.push(...formPart)
  })

  return slugs
}

async function getReusableFormPartSlug(
  ref: {path: Path; _ref: string},
  client: SanityClient,
  options: Options,
) {
  const reusableFormPart = await client.fetch<{
    _type: string
    slug?: SlugValue
    title?: string
    fields?: FieldsArrayValue
  }>(`*[_id == $id][0] { _type, slug, title, fields }`, {
    id: ref._ref,
  })

  if (!reusableFormPart.slug?.current) {
    console.warn(`This document does not have a slug:`, reusableFormPart)
    return []
  }

  return [
    ...(options.getOnlyFieldSlugs
      ? []
      : [
          {
            formPartType:
              reusableFormPart._type === schemaTypeNames.reusableFieldset
                ? 'Reusable Fieldset'
                : 'Unknown',
            path: ref.path,
            value: reusableFormPart.slug.current,
            title: `${options.pathTitle ? `${options.pathTitle}.` : ''}${reusableFormPart.title}`,
          },
        ]),
    ...(options.getChildren && reusableFormPart.fields?.length
      ? await getAllFieldSlugs(reusableFormPart.fields, client, {
          ...options,
          path: [...ref.path, 'fields'],
          pathTitle: `${options.pathTitle ? `${options.pathTitle}.` : ''}${reusableFormPart.title}`,
        })
      : []),
  ]
}
