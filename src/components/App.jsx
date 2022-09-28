import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';
import styles from './App.module.css';

class App extends Component {
  state = {
    contacts: [
      { id: '9jACRmI3_jBfX8jsbptG6', name: 'Viktoria Max', number: '32-32-32' },
      {
        id: 'uwZMuVbdGS70CAwWcdA2y',
        name: 'Viacheslav Max',
        number: '57-31-86',
      },
    ],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const contactsParse = JSON.parse(contacts);

    if (contactsParse) {
      this.setState({ contacts: contactsParse });
    }
  }

  componentDidUpdate(_, prevState) {
    const nextContacts = this.state.contacts;
    const prevContacts = prevState.contacts;

    if (nextContacts !== prevContacts) {
      localStorage.setItem('contacts', JSON.stringify(nextContacts));
    }
  }

  handleNameChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value.trim() });
  };

  repeatName = newName => {
    return this.state.contacts.find(
      ({ name }) => name.toLowerCase() === newName.toLowerCase()
    );
  };

  deleteContact = contactId => {
    this.setState({
      contacts: this.state.contacts.filter(({ id }) => id !== contactId),
    });
  };

  formSubmitHandler = (name, number) => {
    if (!this.repeatName(name)) {
      const contact = {
        id: nanoid(),
        name,
        number,
      };
      this.setState(prevState => ({
        contacts: [contact, ...prevState.contacts],
      }));
    } else {
      alert(`${name} is already in contacts`);
    }
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const { filter } = this.state;

    const visibleContacts = this.getVisibleContacts();
    return (
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Phonebook</h1>
        <ContactForm onSubmit={this.formSubmitHandler} />
        <h2 className={styles.titleContacts}>Contacts</h2>
        <Filter filter={filter} onInputChange={this.handleNameChange} />
        {visibleContacts.length > 0 && (
          <ContactList
            contacts={visibleContacts}
            onDeleteContact={this.deleteContact}
          />
        )}
      </div>
    );
  }
}

export default App;
