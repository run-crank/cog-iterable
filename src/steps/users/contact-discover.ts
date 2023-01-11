import { BaseStep, Field, StepInterface, ExpectedRecord } from '../../core/base-step';
import { FieldDefinition, RunStepResponse, Step, StepDefinition, StepRecord, RecordDefinition } from '../../proto/cog_pb';

/**
 * Note: the class name here becomes this step's stepId.
 @see BaseStep.getId()
 */
export class DiscoverContact extends BaseStep implements StepInterface {
  protected stepName: string = 'Discover fields on an Iterable contact';
  protected stepType: StepDefinition.Type = StepDefinition.Type.ACTION;
  protected actionList: string[] = ['discover'];
  protected targetObject: string = 'Contact';
  protected stepExpression: string = 'discover fields on iterable contact (?<email>.+)';
  protected expectedFields: Field[] = [{
    field: 'email',
    type: FieldDefinition.Type.EMAIL,
    description: "Contact's email address",
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
    const email: string = stepData.email;

    try {
      apiRes = await this.client.getContactByEmail(email);
      if (!apiRes.user) {
        return this.fail('No contact found for email %s', [email]);
      }

      const contactRecord = this.createRecord(apiRes.user.dataFields);
      return this.pass('Successfully discovered fields on contact', [], [contactRecord]);

    } catch (e) {
      if (e.response.status == 401) {
        return this.fail('Credentials are invalid. Please check them and try again.');
      }
      return this.error('There was an error checking the contact: %s', [e.message]);
    }
  }

  public createRecord(contact): StepRecord {
    const obj = {};
    const dateFormat = /[0-9]+-[0-9]+-[0-9]+ [0-9]+:[0-9]+:[0-9]+ [+0-9]+:[0-9]+/;
    Object.keys(contact).forEach((key: string) => {
      if (typeof contact[key] !== 'object') {
        obj[key] = contact[key];
      }
      if (dateFormat.test(obj[key])) {
        obj[key] = (new Date(obj[key])).toISOString();
      }
    });
    const record = this.keyValue('discoverContact', 'Discovered Contact', obj);
    return record;
  }
}

// Exports a duplicate of this class, aliased as "Step"
// See the constructor in src/core/cog.ts to understand why.
export { DiscoverContact as Step };
