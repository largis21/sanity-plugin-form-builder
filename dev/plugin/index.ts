import {configureFormPlugin} from 'sanity-plugin-form-builder'
import stringField from './fields/stringField'

const formPluginReturns = configureFormPlugin({
  fields: [stringField],
})

export const formPlugin = formPluginReturns.formPlugin
export const defaultDocumentNodeResolver = formPluginReturns.defaultDocumentNodeResolver
