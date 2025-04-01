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

type FormPart = {
  _type: string
  slug?: SlugValue
}

type Result = {path: Path; value: FormPart; titleCache: string}[]

type Options = {
  getChildren?: boolean
  getOnlyFields?: boolean
  path?: Path
  pathTitle?: string
}

export async function getAllFormparts(
  fields: FieldsArrayValue,
  client: SanityClient,
  _options: Options = {},
): Promise<Result> {
  const options = {
    getChildren: true,
    getOnlyFields: false,
    path: [],
    pathTitle: '',
    ..._options,
  }

  const formparts: Result = []
  const reusableFormPartRefs: {path: Path; _ref: string}[] = []

  for (const field of fields || []) {
    if (isFormFieldName(field._type) && 'slug' in field && field.slug?.current) {
      formparts.push({
        path: [...options.path, {_key: field._key}],
        value: field,
        titleCache: `${options.pathTitle ? `${options.pathTitle}.` : ''}${field.title}`,
      })

      continue
    }

    if (field._type === 'reference') {
      reusableFormPartRefs.push({
        path: [...options.path, {_key: field._key}, '->'],
        _ref: field._ref,
      })
    }

    if (
      (field._type === schemaTypeNames.fieldset || field._type === schemaTypeNames.section) &&
      field.slug?.current
    ) {
      if (!options.getOnlyFields) {
        formparts.push({
          path: [...options.path, {_key: field._key}],
          value: field,
          titleCache: `${options.pathTitle ? `${options.pathTitle}.` : ''}${field.title}`,
        })
      }
      formparts.push(
        ...(await getAllFormparts(field.fields, client, {
          ...options,
          path: [...options.path, {_key: field._key}],
          pathTitle: `${options.pathTitle ? `${options.pathTitle}.` : ''}${field.title}`,
        })),
      )
    }
  }

  if (!reusableFormPartRefs.length) {
    return formparts
  }

  const reusableFormParts = await Promise.all(
    reusableFormPartRefs.map((ref) => getReusableFormPartSlug(ref, client, options)),
  )

  reusableFormParts.forEach((formPart) => {
    formparts.push(...formPart)
  })

  return formparts
}

async function getReusableFormPartSlug(
  ref: {path: Path; _ref: string},
  client: SanityClient,
  options: Options,
): Promise<Result> {
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
    ...(options.getOnlyFields
      ? []
      : [
          {
            path: ref.path,
            value: reusableFormPart,
            titleCache: `${options.pathTitle ? `${options.pathTitle}.` : ''}${reusableFormPart.title}`,
          },
        ]),
    ...(options.getChildren && reusableFormPart.fields?.length
      ? await getAllFormparts(reusableFormPart.fields, client, {
          ...options,
          path: [...ref.path, 'fields'],
          pathTitle: `${options.pathTitle ? `${options.pathTitle}.` : ''}${reusableFormPart.title}`,
        })
      : []),
  ]
}
