import DailyNoteNavbar from 'dailyNoteNavbar/dailyNoteNavbar';
import { MarkdownView, Notice, Plugin, TFile, WorkspaceLeaf } from 'obsidian';
import { DailyNoteNavbarSettings, DailyNoteNavbarSettingTab, DEFAULT_SETTINGS } from 'settings';
import { FileOpenType } from 'types';
import { getDailyNoteFile, getDateFromFileName, hideChildren, selectNavbarFromView, showChildren } from 'utils';

declare type moment = typeof import('moment');

export default class DailyNoteVavigationPlugin extends Plugin {
	settings: DailyNoteNavbarSettings;
	navbars: Record<string, DailyNoteNavbar> = {};
	nextNavbarId = 0;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new DailyNoteNavbarSettingTab(this.app, this));
		
		this.registerEvent(this.app.workspace.on("active-leaf-change", async (leaf: WorkspaceLeaf) => {
			await this.addDailyNoteNavbar(leaf);
		}));
		this.registerEvent(this.app.workspace.on("css-change", () => this.rerenderNavbars()));
		this.registerEvent(this.app.vault.on("create", () => this.rerenderNavbars()));
		this.registerEvent(this.app.vault.on("rename", () => this.rerenderNavbars()));
		this.registerEvent(this.app.vault.on("delete", () => this.rerenderNavbars()));
	}

	async addDailyNoteNavbar(leaf?: WorkspaceLeaf): Promise<void> {
		if (!this.hasDependencies()) {
			return;
		}

		// Check for markdown view and file
		const markdownLeaves = this.app.workspace.getLeavesOfType("markdown");
		if (!markdownLeaves.includes(leaf as WorkspaceLeaf)) {
			return;
		}

		const view = (leaf as WorkspaceLeaf).view as MarkdownView;
		const activeFile = view.file;
		if (!activeFile) {
			return;
		}

		// Get view header title container
		const viewHeaderTitleContainers = view.containerEl.getElementsByClassName("view-header-title-container");
		if (viewHeaderTitleContainers.length !== 1) {
			return;
		}
		const titleContainerEl = viewHeaderTitleContainers[0] as HTMLElement;

		// Get navbar if one is attached to the view
		const navbarId = selectNavbarFromView(view);
		const navbar = navbarId ? this.getNavbar(navbarId) : null;

		// Check if file is a daily note file or a normal file
		const fileDate = getDateFromFileName(activeFile.basename, this.settings.dailyNoteDateFormat);
		if (!fileDate.isValid()) {
			if (navbar) {
				this.removeNavbar(navbar.id);
				showChildren(titleContainerEl);
			}
			return;
		}
		
		if (navbar) {    
			// Reuse navbar for new file
			navbar.rerender();
		} else {
			hideChildren(titleContainerEl);
			this.createNavbar(view, titleContainerEl, fileDate);
		}
	}

	createNavbar(view: MarkdownView, parentEl: HTMLElement, fileDate: moment.Moment): DailyNoteNavbar {
		const navbarId = `${this.nextNavbarId++}`;
		const navbar = new DailyNoteNavbar(this, navbarId, view, parentEl, fileDate);
		this.navbars[navbarId] = navbar;
		return navbar;
	}

	removeNavbar(id: string) {
		const navbar = this.navbars[id];


		if (!navbar) {
			throw new Error(`Navbar with id ${id} not found`);
		}
		
		navbar.parentEl.removeChild(navbar.containerEl);
		delete this.navbars[id];
	}

	getNavbar(id: string): DailyNoteNavbar | undefined {
		return this.navbars[id];
	}

	rerenderNavbars() {
		for (const navbar of Object.values(this.navbars)) {
			navbar.rerender();
		}
	}

	async openDailyNote(date: moment.Moment, openType: FileOpenType) {
		const dailyNote = await getDailyNoteFile(date);

		await this.openFile(dailyNote, openType);
	}

	async openFile(file: TFile, openType: FileOpenType) {
		switch (openType) {
			case "New window":
				await this.app.workspace
					.getLeaf("window")
					.openFile(file, { active: true });
				return;
			case "New tab":
				await this.app.workspace
					.getLeaf("tab")
					.openFile(file, { active: true });
				return;
			case "Split right":
				await this.app.workspace
					.getLeaf("split", "vertical")
					.openFile(file, { active: true });
				return;
			case "Split down":
				await this.app.workspace
					.getLeaf("split", "horizontal")
					.openFile(file, { active: true });
				return;
			case "Active":
				await this.app.workspace
					.getLeaf()
					.openFile(file, { active: true });
				break;
		}
	}

	hasDependencies() {
		const dailyNotesPlugin = (this.app as unknown as  {
			internalPlugins: {
				plugins: {
					"daily-notes": Plugin & { enabled: boolean };
				}
			}
		}).internalPlugins.plugins["daily-notes"];
		const periodicNotes = (this.app as unknown as {
			plugins: {
				getPlugin: (name: string) => (Plugin & { settings: { daily: { enabled: boolean } } }) | undefined;
			}
		}).plugins.getPlugin("periodic-notes");

		if (!dailyNotesPlugin && !periodicNotes) {
			new Notice("Install periodic notes or daily notes");
			return false;
		}

		if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
			return true;
		} else if (periodicNotes && periodicNotes.settings?.daily?.enabled) {
			return true;
		}

		new Notice("Enable periodic notes or daily notes");
		return false;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()) as DailyNoteNavbarSettings;
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
