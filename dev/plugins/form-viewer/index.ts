import {definePlugin} from 'sanity'
import {FormViewComponent} from './Component'

export const formViewer = definePlugin({
  name: 'form-viewer',
  tools: [{name: 'form-viewer', title: 'Form viewer', component: FormViewComponent}],
})
