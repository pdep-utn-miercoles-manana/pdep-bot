const exec = require('child_process');
const Promise = require('bluebird');

const MockDiscord = require('../factories/discord');

const Student = requireSrc('./models/student');
const Message = requireSrc('./models/message');
const MessageHandler = requireSrc('./handlers/message-handler');

suite('MessageHandler', (mocks) => {

  let discord;
  let message;
  let promise;

  afterEach(() => discord && discord.destroy && discord.destroy());

  it('#eventName', () => {
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
        let mail = 'testing@gmail.com';

        describe('but user already has the rol', () => {
          beforeEach(() => setUp(`!mail ${mail}`));
          beforeEach(() => mocks.hasRole = sinon.stub(message, 'hasRole').returns(true));

          spec(() => expect(handler.dispatch(message)).to.eventually.be.rejectedWith('La persona ya tiene el rol validada asignado.'));
        });

        describe('and user has not got the rol', () => {
          beforeEach(() => setUp(`!mail ${mail}`));
          beforeEach(() => mocks.hasRole = sinon.stub(message, 'hasRole').returns(false));

          describe('but does not exists in db', () => {
            spec(() => expect(handler.dispatch(message)).to.eventually.be.rejectedWith('El mail ingresado no se encuentra en la base de datos.'));
          });

          describe('and exists in db', () => {

            function student(isVerified) {
              return Student.create({ email: mail, isVerified: isVerified, firstName: 'Jane', lastName: 'Doe' });
            }

            describe('but is already verificated', () => {
              beforeEach(() => student(true));
              beforeEach(() => mocks.setRole = sinon.mock(message).expects('setRole').never());
              beforeEach(() => mocks.setNickname = sinon.mock(message).expects('setNickname').never());

              spec(() => expect(handler.dispatch(message)).to.eventually.be.rejectedWith('El mail ya fue verificado.'));
            });

            describe('and is not verificated', () => {
              beforeEach(() => student(false));
              beforeEach(() => mocks.setRole = sinon.mock(message).expects('setRole').once().withArgs('validada'));
              beforeEach(() => mocks.setNickname = sinon.mock(message).expects('setNickname').once().withArgs('Jane Doe'));

              spec(() => expect(handler.dispatch(message)).to.eventually.be.equal('Rol **validada** asignado a **Jane Doe** con *mail* verificado correctamente.'));

              describe('should update isVerified student field' , () => {
                let studentPromise;

                beforeEach(() => handler.dispatch(message));
                beforeEach(() => studentPromise = Student.findOne({ email: mail}).exec());

                spec(() => expect(studentPromise).to.eventually.have.property('isVerified').equal(true));
              });
            });
          });
        });
      });
    });

    describe('#ghci', () => {

      function stubExpression(expression, promise) {
        setUp(`!ghci ${expression}`);
        mocks.exec = sinon
          .stub(exec, 'execFileAsync')
          .withArgs('docker', ['exec', '-i', 'haskell', 'bash', '-c', 'timeout 5 ghci prettify.hs <<< $0', `pp $ ${expression}`])
          .returns(promise);
      }

      afterEach(() => exec.execFileAsync.restore());

      describe('when expression is valid', () => {
        beforeEach(() => stubExpression('2 + 2', Promise.resolve(['GHCi...\nCompiling...\nLoaded\n*Main> 4\nLeaving GHCi...', ''])));

        spec(() => expect(handler.dispatch(message)).to.eventually.be.equal('Expresión evaluada:\n```haskell\n *Main> 4```'));
      });

      describe('when expression is invalid', () => {
        beforeEach(() => stubExpression('2 +', Promise.resolve(['GHCi...\nCompiling...\nLoaded\n*Main> Leaving GHCi...', '<interactive>:2:8:...'])));

        spec(() => expect(handler.dispatch(message)).to.eventually.be.equal('Expresión evaluada:\n```haskell\n <interactive>:2:8:...```'));
      });

      describe('when command fails', () => {
        beforeEach(() => stubExpression('2 + 2', Promise.reject(new Error('No such container'))));

        spec(() => expect(handler.dispatch(message)).to.eventually.be.rejectedWith('No such container'));
      });
    })
  });
});
