'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _placements = require('./placements');

var _rcTrigger = require('rc-trigger');

var _rcTrigger2 = _interopRequireDefault(_rcTrigger);

var Tooltip = _react2['default'].createClass({
  displayName: 'Tooltip',

  propTypes: {
    trigger: _react.PropTypes.any,
    children: _react.PropTypes.any,
    defaultVisible: _react.PropTypes.bool,
    visible: _react.PropTypes.bool,
    placement: _react.PropTypes.string,
    transitionName: _react.PropTypes.string,
    animation: _react.PropTypes.any,
    onVisibleChange: _react.PropTypes.func,
    afterVisibleChange: _react.PropTypes.func,
    overlay: _react.PropTypes.node.isRequired,
    overlayStyle: _react.PropTypes.object,
    overlayClassName: _react.PropTypes.string,
    prefixCls: _react.PropTypes.string,
    mouseEnterDelay: _react.PropTypes.number,
    mouseLeaveDelay: _react.PropTypes.number,
    getTooltipContainer: _react.PropTypes.func,
    destroyTooltipOnHide: _react.PropTypes.bool,
    align: _react.PropTypes.shape({
      offset: _react.PropTypes.array,
      targetOffset: _react.PropTypes.array
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'rc-tooltip',
      mouseEnterDelay: 0,
      destroyTooltipOnHide: false,
      mouseLeaveDelay: 0.1,
      align: {},
      placement: 'right',
      trigger: ['hover']
    };
  },

  getPopupElement: function getPopupElement() {
    var _props = this.props;
    var overlay = _props.overlay;
    var prefixCls = _props.prefixCls;

    return [_react2['default'].createElement('div', { className: prefixCls + '-arrow', key: 'arrow' }), _react2['default'].createElement(
      'div',
      { className: prefixCls + '-inner', key: 'content' },
      overlay
    )];
  },

  getPopupDomNode: function getPopupDomNode() {
    return this.refs.trigger.popupDomNode;
  },

  render: function render() {
    var _props2 = this.props;
    var overlayClassName = _props2.overlayClassName;
    var trigger = _props2.trigger;
    var mouseEnterDelay = _props2.mouseEnterDelay;
    var mouseLeaveDelay = _props2.mouseLeaveDelay;
    var overlayStyle = _props2.overlayStyle;
    var prefixCls = _props2.prefixCls;
    var children = _props2.children;
    var onVisibleChange = _props2.onVisibleChange;
    var transitionName = _props2.transitionName;
    var animation = _props2.animation;
    var placement = _props2.placement;
    var align = _props2.align;
    var destroyTooltipOnHide = _props2.destroyTooltipOnHide;
    var defaultVisible = _props2.defaultVisible;
    var getTooltipContainer = _props2.getTooltipContainer;

    var extraProps = {};
    if ('visible' in this.props) {
      extraProps.popupVisible = this.props.visible;
    }
    return _react2['default'].createElement(
      _rcTrigger2['default'],
      _extends({ popupClassName: overlayClassName,
        ref: 'trigger',
        prefixCls: prefixCls,
        popup: this.getPopupElement(),
        action: trigger,
        builtinPlacements: _placements.placements,
        popupPlacement: placement,
        popupAlign: align,
        getPopupContainer: getTooltipContainer,
        onPopupVisibleChange: onVisibleChange,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        defaultPopupVisible: defaultVisible,
        destroyPopupOnHide: destroyTooltipOnHide,
        mouseLeaveDelay: mouseLeaveDelay,
        popupStyle: overlayStyle,
        mouseEnterDelay: mouseEnterDelay
      }, extraProps),
      children
    );
  }
});

exports['default'] = Tooltip;
module.exports = exports['default'];