import {DefaultDocumentNodeResolver} from 'sanity/structure'

import {GetFormPreviewComponent} from '../components/FormPreview'
import {RenderForm as iRenderFOrm} from '../components/RenderForm'

export const defaultDocumentNodeResolver =
  (groqProjection: string, RenderForm: iRenderFOrm): DefaultDocumentNodeResolver =>
  (S) =>
    S.document().views([
      S.view.form(),
      S.view.component(GetFormPreviewComponent(groqProjection, RenderForm)).title('Form Preview'),
    ])
