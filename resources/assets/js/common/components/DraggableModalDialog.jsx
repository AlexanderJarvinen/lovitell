import React from 'react';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

export default class DraggableModalDialog extends React.Component {
  render() {
    return <Draggable handle=".modal-title"><ModalDialog
      backdrop={false}
      enforceFocus={false}
      {...this.props} /></Draggable>
  }
}