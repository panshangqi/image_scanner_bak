import Modal from './modal';
import confirm from './confirm';
import './style.less';

Modal.info = function (props) {
    const config = {
        type: 'info',
        iconType: 'info-circle',
        okCancel: false,
        ...props,
    };
    return confirm(config);
};

Modal.success = function (props) {
    const config = {
        type: 'success',
        iconType: 'check-circle',
        okCancel: false,
        ...props,
    };
    return confirm(config);
};

Modal.error = function (props) {
    const config = {
        type: 'error',
        iconType: 'close-circle',
        okCancel: false,
        ...props,
    };
    return confirm(config);
};

Modal.warn = function (props) {
    const config = {
        type: 'warning',
        iconType: 'exclamation-circle',
        okCancel: false,
        ...props,
    };
    return confirm(config);
};

Modal.confirm = function (props) {
    const config = {
        type: 'confirm',
        okCancel: true,
        ...props,
    };
    return confirm(config);
};

export default Modal;
