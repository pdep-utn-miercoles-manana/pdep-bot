const ReadyHandler = requireSrc('./handlers/ready-handler');

suite('Ready', (mocks) => {

  describe('#eventName', () => {
    spec(() => expect(ReadyHandler.eventName).to.equal('ready'));
  })

  describe('#handle', () => {
    beforeEach(() => mocks.console = sinon.stub(console, 'info'));
    beforeEach(() => ReadyHandler.handle());

    spec(() => expect(console.info).to.have.been.calledOnceWith('Bot is ready'));
  })

})