import { BaseStep, Field, StepInterface } from '../../core/base-step';
import { FieldDefinition, RunStepResponse, Step, StepDefinition } from '../../proto/cog_pb';

import { baseOperators } from '../../client/constants/operators';
import * as util from '@run-crank/utilities';

/**
 * Note: the class name here becomes this step's stepId.
 @see BaseStep.getId()
 */
export class DeleteContact extends BaseStep implements StepInterface {

  protected stepName: string = 'Delete an Iterable Contact';

  protected stepType: StepDefinition.Type = StepDefinition.Type.ACTION;

  protected stepExpression: string = 'delete the (?<email>.+) iterable contact';

  protected expectedFields: Field[] = [{
    field: 'email',
    type: FieldDefinition.Type.EMAIL,
    description: 'the email address of the contact',
  }];

  async executeStep(step: Step): Promise<RunStepResponse> {
    let apiRes: any;
    const stepData: any = step.getData().toJavaScript();
    const email: string = stepData.email;

    try {
      apiRes = await this.client.deleteContactByEmail(email);
      console.log(apiRes);
      if (apiRes.code == 'Success') {
        return this.pass('Successfully deleted contact');
      } else {
        return this.error('Failed to delete contact: %s', [apiRes.params.toString()]);

      }
    } catch (e) {
      return this.error('There was a deleting the Contact: %s', [e.toString()]);
    }
  }

}

// Exports a duplicate of this class, aliased as "Step"
// See the constructor in src/core/cog.ts to understand why.
export { DeleteContact as Step };
