import * as types from "types";

export const initialState = {
	data: [],
	editMail: {},
};

/**
 * @function mailReducer
 * @param {object} state - an object containing data and isLoading state.
 * @param {object} action - type and payload to be reduced.
 * @returns {object} - seasons state.
 */
const mailReducer = (state = initialState, { payload, type }) => {
	switch (type) {
		case types.MAIL_EDIT:
		case types.MAIL_FETCH: {
			return initialState;
		}
		case types.MAIL_SET: {
			return { ...state, data: payload.mail };
		}
		case types.MAIL_SET_EDIT: {
			return { ...state, editMail: payload.mail };
		}
		default: {
			return state;
		}
	}
};

export default mailReducer;
