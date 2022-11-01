import { Message } from '../../src/dto/message';



describe('message Test ', () => {
    test('Setters and getters ', () => {
        var message: Message = new Message();
        message.setCode("1")
        message.setDescription("hello");
        message.getCode();
        message.getDescription();
    })
})