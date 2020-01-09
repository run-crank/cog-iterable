import { BaseStep, Field, StepInterface } from '../../core/base-step';
import { FieldDefinition, RunStepResponse, Step, StepDefinition } from '../../proto/cog_pb';

import { baseOperators } from '../../client/constants/operators';
import * as util from '@run-crank/utilities';

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
    description: 'Where keys represent contact profile field names as represented in the Iterable API (including email, which is not technically a profile field).',
  }];

  async executeStep(step: Step): Promise<RunStepResponse> {
    let apiRes: any;
    const stepData: any = step.getData().toJavaScript();
    const contact: string = stepData.contact;

    if (!contact.hasOwnProperty('email')) {
      return this.error('An email address must be provided in order to create an Iterable Contact');
    }

    const data = {
      email: contact['email'],
      dataFields: contact,
    };

    try {
      apiRes = await this.client.createOrUpdateContact(data);
      if (apiRes.code == 'Success') {
        return this.pass('Successfully created contact');
      } else {
        return this.error('Failed to created contact: %s', [apiRes.params.toString()]);

      }
    } catch (e) {
      return this.error('There was a creating the Contact: %s', [e.toString()]);
    }
  }

}

// Exports a duplicate of this class, aliased as "Step"
// See the constructor in src/core/cog.ts to understand why.
export { CreateOrUpdateContact as Step };
