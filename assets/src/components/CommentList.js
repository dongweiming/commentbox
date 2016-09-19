import React, {Component, PropTypes} from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';

class Comment extends Component {

  render() {
    <ListItem
      leftAvatar={<Avatar src={this.props.user.pictureUrl} />}
      primaryText={<a href={this.props.song.url}>{this.props.song.name}</a>}
      secondaryText={
        <p>
          <span style={{color: darkBlack}}>${this.props.user.name}</span> --
                      {this.props.content}
        </p>
      }
      secondaryTextLines={2}
    />
    <Divider inset={true} />
  }
}

@observer
class CommentList extends Component {

  render() {
    const {comments, title} = this.props;
    <List>
      <Subheader>${title}</Subheader>
    {
      comments.map((comment) => {
        <Comment user={comment.user} song={comment.song} content={comment.content}>
      });
    }
    <DevTools />
  }
}

export default CommentList;
