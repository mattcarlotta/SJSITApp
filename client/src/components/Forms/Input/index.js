import styled from "styled-components";
import Input from "./Input";

export default styled(Input)`
	position: relative;
	display: inline-block;
	height: 117px;
	width: 100%;

	input {
		position: relative;
		padding: ${({ icon }) => `10px 0 10px ${icon ? 48 : 17}px`};
		width: 100%;
		font-size: 20px;
		background: #fff;
		color: #282c34;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		transition: border 0.2s ease-in-out;

		&:hover {
			border: 1px solid #bfbebe;
		}

		&::placeholder {
			color: #d3dce6;
		}

		&:focus {
			outline: 0;
		}
	}

	.focused {
		svg {
			color: #1e90ff;
		}

		input {
			border: 1px solid #1e90ff;
		}
	}

	.error {
		svg {
			color: #d14023 !important;
		}

		input {
			border: 1px solid #d14023 !important;
		}
	}

	.disabled {
		& .icon > svg {
			cursor: not-allowed;
			color: #7182ac;
		}

		input {
			cursor: not-allowed;
			color: #7182ac;
			background: #ebebeb;

			&:hover {
				border: 1px solid transparent;
			}
		}
	}
`;
