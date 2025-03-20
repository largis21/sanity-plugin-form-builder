import {configureFormPlugin} from 'sanity-plugin-form-builder'

const formPluginReturns = configureFormPlugin()

console.log(formPluginReturns)

export const formPlugin = formPluginReturns.formPlugin
export const defaultDocumentNodeResolver = formPluginReturns.defaultDocumentNodeResolver
