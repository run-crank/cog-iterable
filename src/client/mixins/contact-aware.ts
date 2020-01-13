
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

  public async getContactByEmail(email): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.client.users.get(email).then((response) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
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
