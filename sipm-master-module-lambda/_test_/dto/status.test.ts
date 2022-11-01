import { Status } from '../../src/dto/status';
import { Message } from '../../src/dto/message';

var status = new Status();
describe('handler', () => {
    test('handler test', () => {
        status.getCode();
    });
    test('handler test', () => {
        status.getMessages();
    });
    test('handler test', () => {
        status.setCode("a");
    });
    test('handler test', () => {
        var array = new Array<Message>();
        var msg = new Message();
        array.push(msg);
        status.setMessages(array);
    });
});

