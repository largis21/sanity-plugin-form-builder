import {ErrorComponentProps} from '../lib/defineFormField'

export function DefaultError(props: ErrorComponentProps) {
  return <div style={{color: 'red'}}>{props.error}</div>
}
