import {
  configureFormPlugin,
  defaultStringField,
  defaultTextField,
  defaultCheckboxField,
} from 'sanity-plugin-form-builder'

const formPluginReturns = configureFormPlugin({
  fields: [defaultStringField, defaultTextField, defaultCheckboxField],
})

export const {
  formPlugin,
  defaultDocumentNodeResolver,
  groqProjection: formGroqProjection,
} = formPluginReturns
