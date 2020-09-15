import { Component, Fragment } from 'react'
import Button from '../button'
import Form from './form'

export default class extends Component {
  render() {
    const { fields, data, action, ids, noSpace, done, hideModeToggler, light } = this.props
    const { edit } = this.state

    return (
      <Fragment>
        <Form edit={edit} fields={fields} light={light} data={data} action={action} ids={ids} noSpace={noSpace} />
        {!hideModeToggler && done && <ElemEdit edit={edit} action={this.handleToggleEdit.bind(this)} done={done} />}
      </Fragment>
    )
  }

  constructor(props) {
    super(props)
    this.state = { edit: props.edit !== undefined ? props.edit : true }
  }

  handleToggleEdit() {
    this.setState({ edit: !this.state.edit })
  }
}

const ElemEdit = ({ edit, action, done }) => (
  <div key="edit" className="ps:fx b,r:0 p:20px z:10">
    <Button href={done} small circle icon={!edit ? 'feather' : 'check'} color={edit && 'green'} action={(!done && action) || null} />
  </div>
)
