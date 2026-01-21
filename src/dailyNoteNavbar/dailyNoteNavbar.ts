import { App, ButtonComponent, Keymap, MarkdownView, Menu, moment, Notice, TFile } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import DailyNoteNavbarPlugin from "../main";
import { FileOpenType } from "../types";
import { getDailyNoteFile, getDateFromFileName, getDatesInWeekByDate } from "../utils";
import { FILE_OPEN_TYPES_MAPPING, FILE_OPEN_TYPES_TO_PANE_TYPE } from "./consts";

export async function getNumberOfRemainingTasks(note: TFile, app: App): Promise<number> {
	const fileContents = await app.vault.cachedRead(note);
	return (fileContents.match(/(-|\*) \[ \]/g) || []).length;
  } 
  

export async function checkRemainingTasksExistance(
	dailyNote: TFile,
	app: App
  ): Promise<boolean> {
	return await getNumberOfRemainingTasks(dailyNote, app) > 0;
  }
  

export default class DailyNoteNavbar {
	id: string;
	
	date: moment.Moment;
	fileDate: moment.Moment;

	weekOffset = 0;
	plugin: DailyNoteNavbarPlugin;
	containerEl: HTMLElement;
	headerEl: HTMLElement;
	contentEl: HTMLElement;
	parentEl: HTMLElement;
	view: MarkdownView;

	constructor(plugin: DailyNoteNavbarPlugin, id: string, view: MarkdownView, parentEl: HTMLElement, fileDate: moment.Moment) {
		this.id = id;


		this.date = fileDate.clone();
		this.fileDate = fileDate.clone();

		this.weekOffset = 0;
		this.plugin = plugin;
		this.view = view;

		this.containerEl = document.createElement("div");
		this.containerEl.addClass("daily-note-navbar");
		this.containerEl.setAttribute("daily-note-navbar-id", this.id);

		this.headerEl = document.createElement("div");
		this.headerEl.addClass("daily-note-navbar__header");
		this.headerEl.addEventListener("click", () => {
			this.weekOffset = 0;
			this.plugin.openDailyNote(moment(), "Active").then(() => {
				this.rerender();
			})
			.catch((error) => {
				console.error(`obsidian-daily-note-navbar-v2 error for file=[${this.date.format("YYYY-MM-DD")}]`, error);
			});
		});        

		this.containerEl.appendChild(this.headerEl);
		
		this.contentEl = document.createElement("div");
		this.contentEl.addClass("daily-note-navbar__content");
		this.containerEl.appendChild(this.contentEl);

		this.parentEl = parentEl;
		this.parentEl.appendChild(this.containerEl);  
		    
		// Remove navbar when view unloads
		this.view.onunload = () => this.plugin.removeNavbar(this.id);

		this.rerender();
	}

	renderHeader(headerEl: HTMLElement, date: moment.Moment) {
		headerEl.replaceChildren();

		const monthText = date.format("MMMM");
		const yearText = date.format("YYYY");

		const month = document.createElement("span");
		month.innerText = monthText;
		month.addClass("daily-note-navbar__header__month");
		headerEl.appendChild(month);

		const spacer = document.createElement("span");
		spacer.innerText = "\u00A0";
		headerEl.appendChild(spacer);

		const year = document.createElement("span");
		year.innerText = yearText;
		year.addClass("daily-note-navbar__header__year");
		headerEl.appendChild(year);
	}

	rerender() {
		// Update date from view if it has changed
		const activeFile = this.view.file;
		const fileDate = activeFile ? getDateFromFileName(activeFile.basename, this.plugin.settings.dailyNoteDateFormat) : null;
		if (fileDate && fileDate.format("YYYY-MM-DD") !== this.date.format("YYYY-MM-DD")) {
			this.date = fileDate;
			this.weekOffset = 0;
		}

		this.contentEl.replaceChildren();

		const currentDate = moment();
		const dates = getDatesInWeekByDate(this.date.clone().add(this.weekOffset, "week"));

		this.renderHeader(this.headerEl, dates[3]!);

		// Previous week button
		new ButtonComponent(this.contentEl)
			.setClass("daily-note-navbar__change-week")
			.setIcon("left-arrow")
			.setTooltip("Previous week")
			.onClick(() => {
				this.weekOffset--;
				this.rerender();
			});

		// Daily note buttons
		for (const date of dates) {
			const dateString = date.format("YYYY-MM-DD");
			const isActive = this.date.format("YYYY-MM-DD") === dateString;
			const isCurrent = currentDate.format("YYYY-MM-DD") === dateString;
			const dailyNoteFile = getDailyNote(date, getAllDailyNotes());
			const stateClass = isActive
				? "daily-note-navbar__active"
				: dailyNoteFile
					? "daily-note-navbar__default"
					: "daily-note-navbar__not-exists";

			const button = new ButtonComponent(this.contentEl)
				.setButtonText(date.format("DD"))
				.setClass("daily-note-navbar__date")
				.setClass(stateClass)
				.setTooltip(`${date.format(this.plugin.settings.tooltipDateFormat)}`);


			if (dailyNoteFile) {
				checkRemainingTasksExistance(dailyNoteFile, this.plugin.app)
					.then((remainingTasks) => {
						if (remainingTasks) {
							button.setClass("daily-note-navbar__undone");
						} else {
							button.setClass("daily-note-navbar__done");
						}
					})
					.catch((error) => {
						console.error(`obsidian-daily-note-navbar-v2 error for file=[${dateString}]`, error);
					});
			} else {
				button.setClass("daily-note-navbar__not-exists");
			}
			
			if (isCurrent) {
				button.setClass("daily-note-navbar__current");
			}

			// Add context menu
			button.buttonEl.onClickEvent(async (event: MouseEvent) => {
				const paneType = Keymap.isModEvent(event);
				if (paneType && paneType !== true) {
					const openType = FILE_OPEN_TYPES_TO_PANE_TYPE[paneType];
					await this.plugin.openDailyNote(date, openType);
				} else if (event.type === "click") {
					const openType = event.ctrlKey ? "New tab" : "Active";
					// Skip as it is already open
					const isActive = this.date.format("YYYY-MM-DD") === date.format("YYYY-MM-DD");
					if (isActive && openType === "Active") {
						return;
					}

					await this.plugin.openDailyNote(date, openType);
				} else if (event.type === "auxclick") {
					this.createContextMenu(event, date);
				}
			});
		}

		// Next week button
		new ButtonComponent(this.contentEl)
			.setClass("daily-note-navbar__change-week")
			.setIcon("right-arrow")
			.setTooltip("Next week")
			.onClick(() => {
				this.weekOffset++;
				this.rerender();
			});
	}

	createContextMenu(event: MouseEvent, date: moment.Moment) {
		const menu = new Menu()

		for (const [openType, itemValues] of Object.entries(FILE_OPEN_TYPES_MAPPING)) {
			menu.addItem(item => item
				.setIcon(itemValues.icon)
				.setTitle(itemValues.title)
				.onClick(async () => {
					await this.plugin.openDailyNote(date, openType as FileOpenType);
				}))
		}

		menu.addSeparator();

		menu.addItem(item => item
			.setIcon("copy")
			.setTitle("Copy Obsidian URL")
			.onClick(async () => {
				const dailyNote = await getDailyNoteFile(date);
				const extensionLength = dailyNote.extension.length > 0 ? dailyNote.extension.length + 1 : 0;
				const fileName = encodeURIComponent(dailyNote.path.slice(0, -extensionLength));
				const vaultName = this.plugin.app.vault.getName();
				const url = `obsidian://open?vault=${vaultName}&file=${fileName}`;
					await navigator.clipboard.writeText(url);
				new Notice("URL copied to your clipboard");
			}));

		menu.showAtMouseEvent(event)
	}
}
