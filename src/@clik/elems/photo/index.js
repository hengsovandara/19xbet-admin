import { Component } from 'react'
import Photo from './photo'
import { ElemPopup } from '../../comps/fillers'

export default class extends Component {
  render() {
    const { cameraMode, isFullscreen, isLoading, show } = this.state
    const { popup, single, light, user } = this.props

    if (!show) return null

    const elemPhoto = <Photo 
      light={light} 
      single={single} 
      onClose={this.handleToggleShow.bind(this)} 
      onFullscreen={this.handleFullscreen.bind(this)} 
      cameraMode={cameraMode} 
      handleCameraModeToggle={this.handleCameraModeToggle.bind(this)} 
      dragEnterOver={this.dragEnterOver} 
      handleDrop={this.handleDrop} 
      handleClick={id => this.handleClick(id)} 
      triggerUpload={id => this.triggerUpload(id)} 
      uploadImages={files => this.uploadImages(files)} />

    if (!popup) return elemPhoto

    return (
      <ElemPopup isFullscreen={isFullscreen} isLoading={isLoading} onClose={this.handleToggleShow.bind(this)}>
        {elemPhoto}
      </ElemPopup>
    )
  }

  state = {
    cameraMode: false,
    isFullscreen: false,
    loading: false,
    show: false
  }

  componentDidMount() {
    this.props.getMethods &&
      this.props.getMethods({
        handleToggleShow: this.handleToggleShow.bind(this)
      })
  }

  uploadImages = files => {
    if (files.length < 1) return console.warn('no files selected')

    if (!(files instanceof Array) && !(files instanceof FileList)) files = [files]

    // if(this.props.single)
    //   files = files[0] ? [files[0]] : [files];

    const id = this.props.user && this.props.user.id

    this.handleChangeLoading();
    // this.props.handleUserProfile ? this.props.handleUserProfile(files[0], id).then(() => this.handleToggleShow && this.handleToggleShow()) : console.warn('missing handleUserProfile function inside photo component')
    this.props.handleUserProfile(files[0], id);
    this.handleToggleShow();
  }

  dragEnterOver = e => {
    e.stopPropagation()
    e.preventDefault()
  }

  handleDrop = e => {
    this.dragEnterOver(e)
    this.uploadImages(e.dataTransfer.files)
  }

  handleClick = id => document.getElementById(id) !== null && this.triggerUpload(id)

  triggerUpload = id => {
    document.getElementById(id).click()
  }

  handleCameraModeToggle = () => {
    this.setState({ cameraMode: !this.state.cameraMode })
  }

  handleChangeLoading = () => {
    this.setState({ isLoading: true })
  }

  handleFullscreen() {
    this.setState({ isFullscreen: !this.state.isFullscreen })
  }

  handleToggleShow() {
    let isLoading = this.state.isLoading
    if (this.state.show) isLoading = false

    this.setState({ show: !this.state.show, isLoading })
  }
}
