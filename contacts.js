const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

const getContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    error.message = 'Cannot read products file';
    throw error;
  }
};

const updateContacts = async contacts => {
  const str = JSON.stringify(contacts);
  try {
    await fs.writeFile(contactsPath, str);
  } catch (error) {
    throw error;
  }
};

async function listContacts() {
  try {
    const contacts = await getContacts();
    console.table(contacts);

    return contacts;
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getContacts();
    // const findContact = contacts.find(item => {
    //   if (item.id === contactId) {
    //     return item;
    //   }
    // });
    const findContact = contacts.find(item => item.id === contactId);
    if (!findContact) {
      console.log(new Error('incorrect id'));
    }
    console.table(findContact);
    return findContact;
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getContacts();
    const index = contacts.findIndex(item => item.id === contactId);
    if (index === -1) {
      throw new Error('id incorrect');
    }
    const filteredContacts = contacts.filter(item => item.id !== contactId);
    await updateContacts(filteredContacts);
    console.table(filteredContacts);
  } catch (error) {
    throw error;
  }
}

async function addContact(name, email, phone) {
  const newContact = { id: uuidv4(), name, email, phone };

  try {
    const contacts = await getContacts();
    const newContacts = [...contacts, newContact];
    await updateContacts(newContacts);
    console.log(newContact);
    console.table(newContacts);
    return newContact;
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
