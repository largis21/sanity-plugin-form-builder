import {configureFormPlugin, defaultStringField} from 'sanity-plugin-form-builder'

const formPluginReturns = configureFormPlugin({
  fields: [defaultStringField],
})

export const {
  formPlugin,
  RenderForm,
  defaultDocumentNodeResolver,
  groqProjection: formGroqProjection,
} = formPluginReturns
