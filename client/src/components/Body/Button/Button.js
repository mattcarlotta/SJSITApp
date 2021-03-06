/* eslint-disable react/button-has-type */
import React from "react";
import PropTypes from "prop-types";

const StyledButton = ({
	className,
	children,
	disabled,
	onBlur,
	onContextMenu,
	onClick,
	onMouseDown,
	onMouseEnter,
	onMouseLeave,
	onTouchStart,
	style,
	type,
}) => (
	<button
		aria-label="button"
		className={className}
		disabled={disabled}
		onBlur={onBlur}
		onClick={onClick}
		onContextMenu={onContextMenu}
		onMouseDown={onMouseDown}
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}
		onTouchStart={onTouchStart}
		style={style}
		tabIndex={0}
		type={type}
	>
		{children}
	</button>
);

StyledButton.propTypes = {
	className: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
	disabled: PropTypes.bool,
	onBlur: PropTypes.func,
	onClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	onMouseDown: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onTouchStart: PropTypes.func,
	style: PropTypes.objectOf(
		PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	),
	type: PropTypes.string,
};

StyledButton.defaultProps = {
	disabled: false,
	type: "button",
};

export default StyledButton;
/* eslint-enable react/button-has-type */
