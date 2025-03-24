import {SanityClient} from 'sanity'
import {v4 as uuid} from 'uuid'

import {schemaTypeNames} from './constants'

// Each submission is sent to a sanity document,
// each document can be 32MB in size
// If a submission document is too large, it will be submitted to a new document
// form-plugin.submissions.<formId>.<batchNr>
export async function submitFormDataToSanity(
  _client: SanityClient,
  formId: string,
  formData: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const client = _client.withConfig({apiVersion: '2021-10-21'})
  const existingSubmissionDocument = await getExistingSubmissionDocument(client, formId)

  if (!existingSubmissionDocument) {
    return createNewSubmissionDocument(client, formId, formData)
  }
}

async function getExistingSubmissionDocument(client: SanityClient, formId: string) {
  // 2MB buffer
  return await client.fetch(
    `
    *[
      _type == "${schemaTypeNames.submission}" &&
      form._ref == $formId &&
      documentBytes < 30000000
    ][0]
  `,
    {formId},
  )
}

function createNewSubmissionDocument(
  client: SanityClient,
  formId: string,
  formData: Record<string, unknown>,
) {
  const documentData = {
    _id: uuid(),
    _type: schemaTypeNames.submission,
    submissionVersion: 1,
    form: {_type: 'reference', _ref: formId},
    submissions: [{submittedAt: new Date().toISOString(), data: formData}],
  }

  return client.create({
    ...documentData,
    documentBytes: JSON.stringify(formData).length,
  })
}
