var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ytdl from 'ytdl-core';
import fs from 'node:fs';
import { sendVideo } from './sendVideo.js';
export const downloadVideo = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const [_, YOUTUBE_URL, RESOLUTION] = message.body.split(' ');
    const VIDEO_ID = ytdl.getVideoID(YOUTUBE_URL);
    const VIDEO_META_INFO = yield ytdl.getBasicInfo(VIDEO_ID);
    const VIDEO_TITLE = VIDEO_META_INFO.videoDetails.title;
    const video = ytdl(YOUTUBE_URL, {
        filter: (format) => format.container === 'mp4',
        quality: RESOLUTION || 'highest',
    });
    video.pipe(fs.createWriteStream(`${VIDEO_TITLE}.mp4`));
    let startTime;
    video.once('response', () => {
        startTime = Date.now();
    });
    video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - startTime) / 1000 / 60;
        const estimatedDownloadTime = downloadedMinutes / percent - downloadedMinutes;
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total /
            1024 /
            1024).toFixed(2)}MB)\n`);
        process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
        process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
    });
    video.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        process.stdout.write('\n\n');
        sendVideo(message, VIDEO_TITLE);
    }));
});
