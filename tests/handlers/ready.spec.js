const ReadyHandler = requireSrc('./handlers/ready');

suite('Ready', (mocks) => {

  let handler;

  beforeEach(() => handler = new ReadyHandler());

  describe('#eventName', () => {
    spec(() => expect(handler.eventName).to.equal('ready'));
  })

  describe('#eventName', () => {
    beforeEach(() => mocks.console = sinon.stub(console, 'info'));
    beforeEach(() => handler.handle());

    spec(() => expect(console.info).to.have.been.calledOnceWith('Bot is ready'));
  })

})