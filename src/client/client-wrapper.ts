import { ContactAwareMixin } from './mixins/contact-aware';
import * as grpc from 'grpc';
import { Field } from '../core/base-step';
import { FieldDefinition } from '../proto/cog_pb';
import * as iterableApi from 'node-iterable-api';

class ClientWrapper {

  public static expectedAuthFields: Field[] = [{
    field: 'apiKey',
    type: FieldDefinition.Type.STRING,
    description: 'Api Key',
  }];

  public client: any;

  constructor (auth: grpc.Metadata, clientConstructor = iterableApi) {
    this.client = clientConstructor.create(auth.get('apiKey')[0]);
  }

}

interface ClientWrapper extends ContactAwareMixin {}
applyMixins(ClientWrapper, [ContactAwareMixin]);

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
          // tslint:disable-next-line:max-line-length
      Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
    });
  });
}

export { ClientWrapper as ClientWrapper };
