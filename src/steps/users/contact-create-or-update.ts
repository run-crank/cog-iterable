import { BaseStep, Field, StepInterface, ExpectedRecord } from '../../core/base-step';
import { FieldDefinition, RunStepResponse, Step, StepDefinition, StepRecord, RecordDefinition } from '../../proto/cog_pb';
import { isNullOrUndefined, isString } from 'util';

/**
 * Note: the class name here becomes this step's stepId.
 @see BaseStep.getId()
 */
export class CreateOrUpdateContact extends BaseStep implements StepInterface {

  protected stepName: string = 'Create or update an Iterable contact';

  protected stepType: StepDefinition.Type = StepDefinition.Type.ACTION;
  protected actionList: string[] = ['create', 'update'];
  protected targetObject: string = 'Contact';

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
    const contact: Record<string, any> = stepData.contact;
    const contactEmail: string = contact['email'];
    delete contact['email'];

    if (isNullOrUndefined(contactEmail)) {
      return this.fail('An email address must be provided in order to create an Iterable Contact');
    }

    const data = {
      email: contactEmail,
      dataFields: contact,
    };

    try {
      apiRes = await this.client.createOrUpdateContact(data);
      if (apiRes.code == 'Success') {
        const data = await this.client.getContactByEmail(contactEmail, true);
        const record = this.createRecord(data);
        const orderedRecord = this.createOrderedRecord(data, stepData['__stepOrder']);
        return this.pass('Successfully created or updated contact', [], [record, orderedRecord]);
      } else {
        return this.fail('Failed to create contact: %s', [apiRes.params.toString()]);
      }
    } catch (e) {
      if (e && e.response && e.response.status && e.response.status == 401) {
        return this.fail('Credentials are invalid. Please check them and try again.');
      }
      return this.error('There was an error creating the Contact: %s', [e.toString()]);
    }
  }

  public createRecord(contact): StepRecord {
    const obj = {};
    Object.keys(contact.user.dataFields).forEach((key: string) => {
      if (isString(contact.user.dataFields[key])) {
        obj[key] = contact.user.dataFields[key];
      }
    });
    const record = this.keyValue('contact', 'Created or Updated Contact', obj);
    return record;
  }

  public createPassingRecord(data, fields): StepRecord {
    const obj = {};
    Object.keys(data.user.dataFields).forEach((key: string) => {
      if (isString(data.user.dataFields[key])) {
        obj[key] = data.user.dataFields[key];
      }
    });

    const filteredData = {};
    if (obj) {
      Object.keys(obj).forEach((key) => {
        if (fields.includes(key)) {
          filteredData[key] = obj[key];
        }
      });
    }
    return this.keyValue('exposeOnPass:contact', 'Created or Updated Contact', filteredData);
  }

  public createOrderedRecord(contact, stepOrder = 1): StepRecord {
    const obj = {};
    Object.keys(contact.user.dataFields).forEach((key: string) => {
      if (isString(contact.user.dataFields[key])) {
        obj[key] = contact.user.dataFields[key];
      }
    });
    const record = this.keyValue(`contact.${stepOrder}`, `Created or Updated Contact from Step ${stepOrder}`, obj);
    return record;
  }
}

// Exports a duplicate of this class, aliased as "Step"
// See the constructor in src/core/cog.ts to understand why.
export { CreateOrUpdateContact as Step };
