import { __awaiter } from "tslib";
import { moment } from "obsidian";
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
/**
 * Gets the dates in the entire week that the date is in.
 *
 * @param {moment.Moment} date - The date to get dates for.
 * @returns {moment.Moment[]} Returns the dates in the week.
 */
export function getDatesInWeekByDate(date) {
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
export function getDateFromFileName(basename, dateFormat) {
    return moment(basename, dateFormat, true);
}
/**
 * Hides all children in element.
 *
 * @param {HTMLElement} el - The parent element which children to hide.
 */
export function hideChildren(el) {
    for (let k = 0; k < el.children.length; k++) {
        el.children[k].addClass("daily-note-navbar__hidden");
    }
}
/**
 * Shows all children in element.
 *
 * @param {HTMLElement} el - The parent element which children to show.
 */
export function showChildren(el) {
    for (let k = 0; k < el.children.length; k++) {
        el.children[k].removeClass("daily-note-navbar__hidden");
    }
}
/**
 * Gets the daily note file for the given date.
 *
 * @note This creates the daily note if it doesn't aldready exist.
 * @param {moment.Moment} date - The date to get file for.
 * @return {TFile} Returns the daily note file.
 */
export function getDailyNoteFile(date) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return (_a = getDailyNote(date, getAllDailyNotes())) !== null && _a !== void 0 ? _a : yield createDailyNote(date);
    });
}
/**
 * Get navbar id from view if it exists.
 *
 * @param {MarkdownView} view - The view to select the navbar from.
 * @return {string | null} The navbar id or null.
 */
export function selectNavbarFromView(view) {
    const navbars = view.containerEl.getElementsByClassName("daily-note-navbar");
    if (navbars.length > 0) {
        const navbarEl = navbars[0];
        return navbarEl.getAttribute("daily-note-navbar-id");
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFRLE1BQU0sRUFBUyxNQUFNLFVBQVUsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRWpHOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLG9CQUFvQixDQUFDLElBQW1CO0lBQ3ZELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFbEQsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM1QixVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELE9BQU8sVUFBVSxDQUFDO0FBQ25CLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsUUFBZ0IsRUFBRSxVQUFrQjtJQUN2RSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxFQUFlO0lBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDdkQsQ0FBQztBQUNGLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxFQUFlO0lBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsV0FBVyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDMUQsQ0FBQztBQUNGLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQWdCLGdCQUFnQixDQUFDLElBQW1COzs7UUFDekQsT0FBTyxNQUFBLFlBQVksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxtQ0FBSSxNQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5RSxDQUFDO0NBQUE7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxJQUFVO0lBQzlDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM3RSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDeEIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDO1FBQzdCLE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWaWV3LCBtb21lbnQsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjcmVhdGVEYWlseU5vdGUsIGdldEFsbERhaWx5Tm90ZXMsIGdldERhaWx5Tm90ZSB9IGZyb20gJ29ic2lkaWFuLWRhaWx5LW5vdGVzLWludGVyZmFjZSc7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0ZXMgaW4gdGhlIGVudGlyZSB3ZWVrIHRoYXQgdGhlIGRhdGUgaXMgaW4uXG4gKlxuICogQHBhcmFtIHttb21lbnQuTW9tZW50fSBkYXRlIC0gVGhlIGRhdGUgdG8gZ2V0IGRhdGVzIGZvci5cbiAqIEByZXR1cm5zIHttb21lbnQuTW9tZW50W119IFJldHVybnMgdGhlIGRhdGVzIGluIHRoZSB3ZWVrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0ZXNJbldlZWtCeURhdGUoZGF0ZTogbW9tZW50Lk1vbWVudCk6IG1vbWVudC5Nb21lbnRbXSB7XG5cdGxldCBzdGFydE9mV2VlayA9IGRhdGUuY2xvbmUoKS5zdGFydE9mKCdpc29XZWVrJyk7XG5cblx0Y29uc3QgZGF5c0luV2VlayA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuXHRcdGRheXNJbldlZWsucHVzaChzdGFydE9mV2Vlay5jbG9uZSgpLmFkZChpLCAnZGF5cycpKTtcblx0fVxuXG5cdHJldHVybiBkYXlzSW5XZWVrO1xufVxuXG4vKipcbiAqIEdldHMgZGF0ZSBiYXNlZCBvbiBnaXZlbiBiYXNlbmFtZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZW5hbWUgLSBUaGUgYmFzZW5hbWUgb2YgdGhlIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCAtIFRoZSBkYXRlIGZvcm1hdCBvZiB0aGUgZmlsZW5hbWUuXG4gKiBAcmV0dXJucyB7bW9tZW50Lk1vbWVudH0gUmV0dXJucyB0aGUgZGF0ZSBvciBudWxsIGlmIHRoZXJlIGlzIG5vIGRhdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRlRnJvbUZpbGVOYW1lKGJhc2VuYW1lOiBzdHJpbmcsIGRhdGVGb3JtYXQ6IHN0cmluZyk6IG1vbWVudC5Nb21lbnQge1xuXHRyZXR1cm4gbW9tZW50KGJhc2VuYW1lLCBkYXRlRm9ybWF0LCB0cnVlKTtcbn1cblxuLyoqXG4gKiBIaWRlcyBhbGwgY2hpbGRyZW4gaW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBwYXJlbnQgZWxlbWVudCB3aGljaCBjaGlsZHJlbiB0byBoaWRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGlkZUNoaWxkcmVuKGVsOiBIVE1MRWxlbWVudCkge1xuXHRmb3IgKGxldCBrID0gMDsgayA8IGVsLmNoaWxkcmVuLmxlbmd0aDsgaysrKSB7XG5cdFx0ZWwuY2hpbGRyZW5ba10hLmFkZENsYXNzKFwiZGFpbHktbm90ZS1uYXZiYXJfX2hpZGRlblwiKTtcblx0fVxufVxuXG4vKipcbiAqIFNob3dzIGFsbCBjaGlsZHJlbiBpbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIHBhcmVudCBlbGVtZW50IHdoaWNoIGNoaWxkcmVuIHRvIHNob3cuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG93Q2hpbGRyZW4oZWw6IEhUTUxFbGVtZW50KSB7XG5cdGZvciAobGV0IGsgPSAwOyBrIDwgZWwuY2hpbGRyZW4ubGVuZ3RoOyBrKyspIHtcblx0XHRlbC5jaGlsZHJlbltrXSEucmVtb3ZlQ2xhc3MoXCJkYWlseS1ub3RlLW5hdmJhcl9faGlkZGVuXCIpO1xuXHR9XG59XG5cbi8qKlxuICogR2V0cyB0aGUgZGFpbHkgbm90ZSBmaWxlIGZvciB0aGUgZ2l2ZW4gZGF0ZS5cbiAqXG4gKiBAbm90ZSBUaGlzIGNyZWF0ZXMgdGhlIGRhaWx5IG5vdGUgaWYgaXQgZG9lc24ndCBhbGRyZWFkeSBleGlzdC5cbiAqIEBwYXJhbSB7bW9tZW50Lk1vbWVudH0gZGF0ZSAtIFRoZSBkYXRlIHRvIGdldCBmaWxlIGZvci5cbiAqIEByZXR1cm4ge1RGaWxlfSBSZXR1cm5zIHRoZSBkYWlseSBub3RlIGZpbGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREYWlseU5vdGVGaWxlKGRhdGU6IG1vbWVudC5Nb21lbnQpOiBQcm9taXNlPFRGaWxlPiB7XG5cdHJldHVybiBnZXREYWlseU5vdGUoZGF0ZSwgZ2V0QWxsRGFpbHlOb3RlcygpKSA/PyBhd2FpdCBjcmVhdGVEYWlseU5vdGUoZGF0ZSk7XG59XG5cbi8qKlxuICogR2V0IG5hdmJhciBpZCBmcm9tIHZpZXcgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7TWFya2Rvd25WaWV3fSB2aWV3IC0gVGhlIHZpZXcgdG8gc2VsZWN0IHRoZSBuYXZiYXIgZnJvbS5cbiAqIEByZXR1cm4ge3N0cmluZyB8IG51bGx9IFRoZSBuYXZiYXIgaWQgb3IgbnVsbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE5hdmJhckZyb21WaWV3KHZpZXc6IFZpZXcpOiBzdHJpbmcgfCBudWxsIHtcblx0Y29uc3QgbmF2YmFycyA9IHZpZXcuY29udGFpbmVyRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImRhaWx5LW5vdGUtbmF2YmFyXCIpO1xuXHRpZiAobmF2YmFycy5sZW5ndGggPiAwKSB7XG5cdFx0Y29uc3QgbmF2YmFyRWwgPSBuYXZiYXJzWzBdITtcblx0XHRyZXR1cm4gbmF2YmFyRWwuZ2V0QXR0cmlidXRlKFwiZGFpbHktbm90ZS1uYXZiYXItaWRcIik7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59XG4iXX0=