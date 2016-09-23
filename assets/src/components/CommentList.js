import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import {List, ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import spacing from 'material-ui/styles/spacing';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';

function getBodyHeight() {
  let height;
  if( typeof( window.innerWidth ) == 'number' ) {
    height = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    height = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    height = document.body.clientHeight;
  }
  return height
}

class Comment extends Component {

  render() {
    return (
      <div>
        <ListItem
          leftAvatar={<Avatar src={this.props.user.pictureUrl} />}
          primaryText={<a href={this.props.song.url}>{this.props.song.name}</a>}
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>{this.props.user.name}</span> --
                          {this.props.content}
            </p>
                        }
          secondaryTextLines={2}
        />
        <Divider inset={true} />
      </div>
    )
  }
}

@observer
class CommentList extends Component {

  static defaultProps = {
    threshold: 250,
    perPage: 20,
    pageStart: 0
  }

  componentDidMount () {
    this.pageLoaded = this.props.pageStart;
    this.pending = false;
    this.attachScrollListener();
  }

  scrollListener = () => {

    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (getBodyHeight() - scrollTop - window.innerHeight < Number(650)) {
       if (this.pending) {
         return
       }
      this.pending = true;
      this.props.commentStore.loadComments(this.props.sort, this.pageLoaded, this.props.perPage, () =>(
        this.pending = false
      ));
      this.pageLoaded += this.props.perPage;
    }
  }

  attachScrollListener () {
    if (!this.props.commentStore.hasMore) {
      return;
    }
    window.addEventListener('scroll', this.scrollListener, false);
    window.addEventListener('resize', this.scrollListener, false);
    this.scrollListener();
  }

  detachScrollListener () {
    window.removeEventListener('scroll', this.scrollListener, false);
    window.removeEventListener('resize', this.scrollListener, false);
  }

  componentWillUnmount () {
    this.detachScrollListener();
  }

  render() {
    const style = {
      textAlign: 'center',
      height: 600
    };
    const {commentStore, title} = this.props;
    const {comments} = commentStore;
    if (!comments.length) {
      return <div style={style}><CircularProgress size={1.5}/></div>
    }
    return (
      <div className="comment-list">
        <List>
          <Subheader>{title}</Subheader>
          {
              comments.map((comment, index) => {
                return <Comment user={comment.user} song={comment.song} content={comment.content} key={index}/>
              })
          }
        </List>
        <button onClick={this.onReset}>
          Change
        </button>
        <DevTools />
      </div>
    )
  }

  onReset = () => {
    this.props.commentStore.loadComments();
  }
}

export default withWidth()(CommentList);
