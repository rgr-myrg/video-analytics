import {LiveSegment} from "../model/LiveSegment";

export namespace LiveSegmentDTO {
	export function fromContentMetadata(data: any): LiveSegment {
		let dto: LiveSegment = {
			publisherBrand: data.name,
			stationTitle: data.channel,
			programTitle: data.feedTitle,
			episodeTitle: data.episodeTitle,
			contentGenre: data.genre,
			tmsGraceNoteId: data.noteId,
			episodeId: data.episodeId,
			digitalAirDate: data.string,
			tvAirDate: data.string,
			seasonNumber: data.number || data.season,
			episodeNumber: data.number,
			clipLength: data.number,
			adLoadFlag: data.number,
			fullEpisodeFlag: data.number
		};

		return dto;
	}
}
