import { App, PluginSettingTab, Setting } from "obsidian";
import DailyNoteBarPlugin from "./main";

export interface DailyNoteNavbarSettings {
	tooltipDateFormat: string;
	dailyNoteDateFormat: string;
}

/**
 * The plugins default settings.
 */
export const DEFAULT_SETTINGS: DailyNoteNavbarSettings = {
	tooltipDateFormat: "YYYY-MM-DD",
	dailyNoteDateFormat: "YYYY-MM-DD",
}

/**
 * This class is the plugins settings tab.
 */
export class DailyNoteNavbarSettingTab extends PluginSettingTab {
	plugin: DailyNoteBarPlugin;

	constructor(app: App, plugin: DailyNoteBarPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		// Daily note name format
		new Setting(containerEl)  
			.setName('Daily note date format')
			.setDesc('Date format for daily notes.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.dailyNoteDateFormat)
				.setValue(this.plugin.settings.dailyNoteDateFormat)
				.onChange(async (value) => {
					if (value.trim() === "") {
						value = DEFAULT_SETTINGS.dailyNoteDateFormat;
					}
					this.plugin.settings.dailyNoteDateFormat = value;
					await this.plugin.saveSettings();
					
					await this.plugin.addDailyNoteNavbar();  
				}));

		// Tooltip date format
		new Setting(containerEl)
			.setName('Tooltip date format')
			.setDesc('Date format for tooltips.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.tooltipDateFormat)
				.setValue(this.plugin.settings.tooltipDateFormat)
				.onChange(async (value) => {
					if (value.trim() === "") {
						value = DEFAULT_SETTINGS.tooltipDateFormat;
					}
					this.plugin.settings.tooltipDateFormat = value;
					await this.plugin.saveSettings();
					await this.plugin.addDailyNoteNavbar();
				}));
	}
}
