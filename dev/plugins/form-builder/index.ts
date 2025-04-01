import {
  configureFormPlugin,
  defaultCheckboxField,
  defaultTextField,
  defaultTextareaField,
} from 'sanity-plugin-form-builder'

const formPluginReturns = configureFormPlugin({
  fields: [defaultTextField, defaultTextareaField, defaultCheckboxField],
})

export const {
  formPlugin,
  defaultDocumentNodeResolver,
  groqProjection: formGroqProjection,
} = formPluginReturns
