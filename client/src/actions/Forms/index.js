import isEmpty from "lodash/isEmpty";
import * as types from "types";

/**
 * Creates a new form.
 *
 * @function createForm
 * @param {object} props - props contain seasonId, begin/end month dates and an expiration date.
 * @returns {object}
 */
export const createForm = props => ({
	type: types.FORMS_CREATE,
	props,
});

/**
 * Deletes a new event.
 *
 * @function deleteForm
 * @param {string} formId
 * @returns {object}
 */
export const deleteForm = formId => ({
	type: types.FORMS_DELETE,
	formId,
});

/**
 * Fetches a single event.
 *
 * @function fetchForm
 * @param {string} formId
 * @returns {object}
 */
export const fetchForm = formId => ({
	type: types.FORMS_EDIT,
	formId,
});

/**
 * Fetches all forms.
 *
 * @function fetchForms
 * @returns {object}
 */
export const fetchForms = () => ({
	type: types.FORMS_FETCH,
});

/**
 * Sets any members from API to redux state
 *
 * @function setForms
 * @param {array} data - contains events data ([_id, seasonId, startMonth, startDate, expirationDate]).
 * @returns {object}
 */
export const setForms = data => ({
	type: types.FORMS_SET,
	payload: !isEmpty(data) ? data : [],
});

/**
 * Sets a single season to redux state for editing.
 *
 * @function setFormToEdit
 * @param {object} data - contains event data ([_id, seasonId, startMonth, startDate, expirationDate]).
 * @returns {object}
 */
export const setFormToEdit = data => ({
	type: types.FORMS_SET_EDIT,
	payload: !isEmpty(data) ? data : {},
});

/**
 * Updates a single form.
 *
 * @function updateForm
 * @param {object} data - contains event data ([_id, seasonId, startMonth, startDate, expirationDate])
 * @returns {object}
 */
export const updateForm = props => ({
	type: types.FORMS_UPDATE,
	props,
});
