import { BaseStep, Field, StepInterface, ExpectedRecord } from '../../core/base-step';
import { FieldDefinition, RunStepResponse, Step, StepDefinition, StepRecord, RecordDefinition } from '../../proto/cog_pb';
import { isNullOrUndefined, isString } from 'util';

/**
 * Note: the class name here becomes this step's stepId.
 @see BaseStep.getId()
 */
export class CreateOrUpdateContact extends BaseStep implements StepInterface {

  protected stepName: string = 'Create or update an Iterable Contact';

  protected stepType: StepDefinition.Type = StepDefinition.Type.ACTION;

  protected stepExpression: string = 'create or update an iterable contact';

  protected expectedFields: Field[] = [{
    field: 'contact',
    type: FieldDefinition.Type.MAP,
    description: 'Where keys represent contact profile field names as represented in the Iterable API (including email).',
  }];

  protected expectedRecords: ExpectedRecord[] = [{
    id: 'contact',
    type: RecordDefinition.Type.KEYVALUE,
    fields: [{
      field: 'email',
      type: FieldDefinition.Type.EMAIL,
      description: "Contact's Email Address",
    }, {
      field: 'signupDate',
      type: FieldDefinition.Type.DATETIME,
      description: 'The date/time the Contact was created',
    }, {
      field: 'profileUpdatedAt',
      type: FieldDefinition.Type.DATETIME,
      description: 'The date/time the Contact was updated',
    }],
    dynamicFields: true,
  }];

  async executeStep(step: Step): Promise<RunStepResponse> {
    let apiRes: any;
    const stepData: any = step.getData().toJavaScript();
    const contact: string = stepData.contact;
    const contactEmail: string = contact['email'];
    delete contact['email'];

    if (isNullOrUndefined(contactEmail)) {
      return this.error('An email address must be provided in order to create an Iterable Contact');
    }

    const data = {
      email: contactEmail,
      dataFields: contact,
    };

    try {
      const contact = await this.client.getContactByEmail(contactEmail);
      apiRes = await this.client.createOrUpdateContact(data);
      if (apiRes.code == 'Success') {
        const contactExist = contact.hasOwnProperty('user');
        const record = await this.client.getContactByEmail(contactEmail);
        const contactRecord = this.createRecord(record.user.dataFields, contactExist);
        return contactExist ? this.pass('Successfully updated contact', [], [contactRecord]) : this.pass('Successfully created contact', [], [contactRecord]);
      } else {
        return this.fail('Failed to create contact: %s', [apiRes.params.toString()]);
      }
    } catch (e) {
      if (e.response.status == 401) {
        return this.error('Credentials are invalid. Please check them and try again.');
      }
      return this.error('There was an error creating the Contact: %s', [e.toString()]);
    }
  }

  public createRecord(contact, contactExist): StepRecord {
    const obj = {};
    Object.keys(contact).forEach((key: string) => {
      if (isString(contact[key])) {
        obj[key] = contact[key];
      }
    });
    const record = contactExist ? this.keyValue('contact', 'Updated Contact', obj) : this.keyValue('contact', 'Created Contact', obj);
    return record;
  }
}

// Exports a duplicate of this class, aliased as "Step"
// See the constructor in src/core/cog.ts to understand why.
export { CreateOrUpdateContact as Step };
