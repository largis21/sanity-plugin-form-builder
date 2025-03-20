import {ReactNode} from 'react'

import {FormField as iFormField} from '../queries/createGroqProjectForFields'

export function FormField(props: {field: iFormField; children: ReactNode}) {
  return (
    <div
      style={{
        gridColumn: `span ${props.field.width}`,
      }}
    >
      {props.children}
    </div>
  )
}
