import * as chai from 'chai';
import { default as sinon } from 'ts-sinon';
import * as sinonChai from 'sinon-chai';
import 'mocha';

import { ClientWrapper } from '../../src/client/client-wrapper';
import { Metadata } from 'grpc';

chai.use(sinonChai);

describe('ClientWrapper', () => {
  const expect = chai.expect;
  let iterableClientStub: any;
  let iterableClientConstructorStub: any;
  let metadata: Metadata;
  let clientWrapperUnderTest: ClientWrapper;

  beforeEach(() => {
    iterableClientStub = sinon.stub();
    iterableClientStub.users = sinon.stub();
    iterableClientStub.users.update = sinon.stub();
    iterableClientStub.users.get = sinon.stub();
    iterableClientStub.users.delete = sinon.stub();
    iterableClientConstructorStub = sinon.stub();
    iterableClientConstructorStub.create = sinon.stub();

    iterableClientConstructorStub.create.returns(iterableClientStub);
  });

  // @todo write authentication and client mixin tests
  it('authenticates', () => {
    const apiKey = 'someApiKey';
    metadata = new Metadata();
    metadata.add('apiKey', apiKey);
    clientWrapperUnderTest = new ClientWrapper(metadata, iterableClientConstructorStub);
    expect(iterableClientConstructorStub.create).to.have.been.calledWith(apiKey);
  });

  // it('createOrUpdateContact', async () => {
  //   const email = {
  //     email: 'someEmail',
  //   };
  //   // Set up test instance.
  //   iterableClientStub.users.update.returns(Promise.resolve());
  //   clientWrapperUnderTest = new ClientWrapper(metadata, iterableClientConstructorStub);
  //   // Call the method and make assertions.
  //   await clientWrapperUnderTest.getContactByEmail(email);
  //   expect(iterableClientStub.users.update).to.have.been.calledWith(email);
  // });

  // it('getContactByEmail', async () => {
  //   const email = 'someEmail';
  //   const expectedResult = {
  //     email: 'someEmail',
  //   };
  //   // Set up test instance.
  //   clientWrapperUnderTest = new ClientWrapper(metadata, iterableClientConstructorStub);
  //   // Call the method and make assertions.
  //   const actualResult = await clientWrapperUnderTest.getContactByEmail(email);
  //   expect(iterableClientStub.users.get).to.have.been.calledWith(email);
  //   expect(actualResult).to.equal(expectedResult);
  // });

  // it('deleteContactByEmail', async () => {
  //   const email = 'someEmail';
  //   // Set up test instance.
  //   clientWrapperUnderTest = new ClientWrapper(metadata, iterableClientConstructorStub);
  //   // Call the method and make assertions.
  //   await clientWrapperUnderTest.getContactByEmail(email);
  //   expect(iterableClientStub.users.delete).to.have.been.calledWith(email);
  // });
});
