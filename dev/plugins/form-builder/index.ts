import {
  configureFormPlugin,
  defaultCheckboxField,
  defaultTextField,
  defaultTextareaField,
} from 'sanity-plugin-form-builder'

const options = {
  builder: {
    fields: [defaultTextField, defaultTextareaField, defaultCheckboxField],
  },
}
const formPluginReturns = configureFormPlugin(options)

export const {
  formPlugin,
  defaultDocumentNodeResolver,
  groqProjection: formGroqProjection,
} = formPluginReturns
