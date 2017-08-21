import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {style} from 'typestyle';
import * as Firebase from 'firebase';
import {em} from 'csx';

const lists = [
  {type: 'top'},
  {type: 'new'},
  // { type: 'best' },
  {type: 'ask'},
  {type: 'show'},
  {type: 'job'},
];

const PAGE_SIZE = 15;

Firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com',
});

const db = Firebase.database().ref('v0');

interface S {
  data: any[],
}

class Page extends React.Component<{}, S> {
  constructor() {
    super();
    this.state = {data: []};
  }

  componentDidMount() {
    lists.slice(0, 1).forEach(list => {
      db.child(`${list.type}stories`).on('value', snapshot => {
        snapshot.val().slice(0, PAGE_SIZE).forEach((id: any) => {
          db.child(`/item/${id}`).once('value', snapshot => {
            this.setState(oldState => ({
              ...oldState,
              data: [...oldState.data, snapshot.val().title],
            }));
          });
        });
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Mjello</h1>
        <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
      </div>
    );
  }
}

const mjelloStyle = style({
  fontFamily: 'monospace',
  margin: em(1),
});

ReactDOM.render(<Page />, document.getElementById('app'));
