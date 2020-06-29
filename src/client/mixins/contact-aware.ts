const promiseRetry = require('promise-retry');

export class ContactAwareMixin {
  client: any;

  public async createOrUpdateContact(contact): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.client.users.update(contact).then((response) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getContactByEmail(email, attemptRetries = false): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (attemptRetries) {
          promiseRetry((retry: Function) => {
            return this.client.users.get(email).catch(retry).then((resp) => {
              // If the response didn't actually resolve a user, retry.
              if (!resp.user || !resp.user.dataFields) {
                return retry(Error('Contact may not be available yet due to eventual consistency.'));
              }
              return resp;
            });
          }).then(resolve);
        } else {
          this.client.users.get(email).then(resolve).catch(reject);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async deleteContactByEmail(email): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.client.users.delete(email).then((response) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
