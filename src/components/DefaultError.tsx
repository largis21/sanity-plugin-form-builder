import {ErrorComponentProps} from '../lib/defineFormField'

export function DefaultError(props: ErrorComponentProps) {
  return (
    <div style={{color: 'red', fontSize: '12px'}} aria-hidden={!props.error}>
      {props.error || '.'}
    </div>
  )
}
