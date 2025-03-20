import {Flex} from '@sanity/ui'
import {evaluate, parse} from 'groq-js'
import {ReactNode, useEffect, useState} from 'react'
import {UserViewComponent} from 'sanity/structure'

import {RenderForm as iRenderForm} from './RenderForm'

export const GetFormPreviewComponent = (
  groqProjection: string,
  RenderForm: iRenderForm,
): UserViewComponent => {
  const query = `*[0] { ${groqProjection} }`
  const queryAst = parse(query)

  async function documentToRenderedForm(
    document: unknown,
    setRenderedForm: (form: ReactNode) => void,
  ) {
    const form = await evaluate(queryAst, {
      dataset: [document],
    })

    const formResult = await form.get()

    setRenderedForm(<RenderForm form={formResult} />)
  }

  return function FormPreview(props) {
    const [renderedForm, setRenderedForm] = useState<ReactNode>(null)

    useEffect(() => {
      documentToRenderedForm(props.document.displayed, setRenderedForm)
    }, [props.document.displayed])

    return (
      <Flex
        justify={'center'}
        align="center"
        height={'fill'}
        style={{backgroundColor: '#FFF', color: '#000'}}
        padding={4}
      >
        {renderedForm}
      </Flex>
    )
  }
}
