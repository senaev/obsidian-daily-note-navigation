import { View, moment, TFile } from "obsidian";
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';

/**
 * Gets the dates in the entire week that the date is in.
 *
 * @param {moment.Moment} date - The date to get dates for.
 * @returns {moment.Moment[]} Returns the dates in the week.
 */
export function getDatesInWeekByDate(date: moment.Moment): moment.Moment[] {
	let startOfWeek = date.clone().startOf('isoWeek');

	const daysInWeek = [];
	for (let i = 0; i < 7; i++) {
		daysInWeek.push(startOfWeek.clone().add(i, 'days'));
	}

	return daysInWeek;
}

/**
 * Gets date based on given basename.
 *
 * @param {string} basename - The basename of the file.
 * @param {string} dateFormat - The date format of the filename.
 * @returns {moment.Moment} Returns the date or null if there is no date.
 */
export function getDateFromFileName(basename: string, dateFormat: string): moment.Moment {
	return moment(basename, dateFormat, true);
}

/**
 * Hides all children in element.
 *
 * @param {HTMLElement} el - The parent element which children to hide.
 */
export function hideChildren(el: HTMLElement) {
	for (let k = 0; k < el.children.length; k++) {
		el.children[k]!.addClass("daily-note-navbar__hidden");
	}
}

/**
 * Shows all children in element.
 *
 * @param {HTMLElement} el - The parent element which children to show.
 */
export function showChildren(el: HTMLElement) {
	for (let k = 0; k < el.children.length; k++) {
		el.children[k]!.removeClass("daily-note-navbar__hidden");
	}
}

/**
 * Gets the daily note file for the given date.
 *
 * @note This creates the daily note if it doesn't aldready exist.
 * @param {moment.Moment} date - The date to get file for.
 * @return {TFile} Returns the daily note file.
 */
export async function getDailyNoteFile(date: moment.Moment): Promise<TFile> {
	return getDailyNote(date, getAllDailyNotes()) ?? await createDailyNote(date);
}

/**
 * Get navbar id from view if it exists.
 *
 * @param {MarkdownView} view - The view to select the navbar from.
 * @return {string | null} The navbar id or null.
 */
export function selectNavbarFromView(view: View): string | null {
	const navbars = view.containerEl.getElementsByClassName("daily-note-navbar");
	if (navbars.length > 0) {
		const navbarEl = navbars[0]!;
		return navbarEl.getAttribute("daily-note-navbar-id");
	}
	return null;
}
