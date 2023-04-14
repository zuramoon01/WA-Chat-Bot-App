var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import WAWebJS from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { downloadVideo } from './utils/index.js';
const { Client, LocalAuth } = WAWebJS;
const client = new Client({
    authStrategy: new LocalAuth(),
});
const verifiedNumber = ['6282115846645', '6282166981595', '6283198889526'];
client.initialize();
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});
client.on('ready', () => {
    console.log('Client WA chat bot siap digunakan!');
});
client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('ok2');
    if (message.body.startsWith('/download')) {
        const contact = yield message.getContact();
        if (verifiedNumber.includes(contact.number)) {
            downloadVideo(message);
        }
        else {
            message.reply('Nomor anda belum terverifikasi untuk melakukan perintah tersebut');
        }
    }
}));
client.on('message_create', (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('ok1');
    if (message.fromMe) {
        if (message.body.startsWith('/download')) {
            const contact = yield message.getContact();
            if (verifiedNumber.includes(contact.number)) {
                downloadVideo(message);
            }
            else {
                message.reply('Nomor anda belum terverifikasi untuk melakukan perintah tersebut');
            }
        }
        else if (message.body === 'test') {
            message.reply('ok');
        }
    }
}));
