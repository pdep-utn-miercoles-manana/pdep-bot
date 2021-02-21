const MockDiscord = require('../factories/discord');

const Message = requireSrc('./models/message');
const MessageHandler = requireSrc('./handlers/message-handler');

suite('MessageHandler', (mocks) => {
  
  let discord;
  let message;
  let promise;
  
  afterEach(() => discord && discord.destroy && discord.destroy());

  describe('#eventName', () => {
    spec(() => expect(MessageHandler.eventName).to.equal('message'));
  });  
  
  describe('#handle', () => {
    
    function setUp(content) {
      discord = new MockDiscord(content);
      message = discord.getMessage();
      mocks.reply = sinon.stub(message, 'reply');
      promise = MessageHandler.handle(message);
    }
  
    describe('when command does not start with correct prefix', () => {
      beforeEach(() => setUp('$foo bar'));

      spec(() => promise.then(() => expect(mocks.reply).to.not.have.been.called));
    });

    describe('when command starts with correct prefix', () => {
      
      describe('and command does not exist', () => {
        beforeEach(() => setUp('!foo bar'));

        spec(() => promise.then(() => expect(mocks.reply).to.have.been.calledWith('El comando **foo** no existe.')));
      });
      
      describe('and command exists', () => {
        beforeEach(() => setUp('!echo bar'));

        spec(() => promise.then(() => expect(mocks.reply).to.have.been.calledWith('bar')));
      });
      
    });

  });

  describe('instance methods', () => {

    let handler;
  
    function setUp(content) {
      discord = new MockDiscord(content);
      message = new Message(discord.getMessage());
    }

    beforeEach(() => handler = new MessageHandler());
  
    describe('#echo', () => {
      beforeEach(() => setUp('!echo hello world'));

      spec(() => expect(handler.dispatch(message)).to.eventually.equal('hello world'));
    });
  
    describe('#ping', () => {
      beforeEach(() => setUp('!ping hello world'));

      spec(() => expect(handler.dispatch(message)).to.eventually.equal(':ping_pong: hello world'));
    });
  
    describe('#mail', () => {

      describe('if argument is not a valid mail', () => {
        beforeEach(() => setUp('!mail hello world'));
    
        spec(() => expect(handler.dispatch(message)).to.eventually.be.rejectedWith('El email ingresado no es válido.'));
      });

      describe('if argument is a valid mail', () => {

        describe('but user already has the rol', () => {
          beforeEach(() => setUp('!mail testing@gmail.com'));
          beforeEach(() => mocks.hasRole = sinon.stub(message, 'hasRole').returns(true));
      
          spec(() => expect(handler.dispatch(message)).to.eventually.be.rejectedWith('La persona ya tiene el rol estudiante asignado.'));
        });

        describe('and user has not got the rol but does not exists in db', () => {
          beforeEach(() => setUp('!mail testing@gmail.com'));
          beforeEach(() => mocks.hasRole = sinon.stub(message, 'hasRole').returns(false));
      
          spec(() => expect(handler.dispatch(message)).to.eventually.be.rejectedWith('El mail ingresado no se encuentra en la base de datos.'));
        });

      });

    });

  });

});