import React from 'react';
import {observer} from 'mobx-react';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';

import CommentList from './CommentList';
import commentStore from '../stores/commentStore';

@observer
class Star extends React.Component {
  render() {
    return (
      <CommentList
        title={'Test'}
        commentStore={commentStore}
        sort={'star'}
        perPage={20}
      />
    );
  }
}


export default withWidth()(Star);


