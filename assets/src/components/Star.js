import { observer, inject } from 'mobx-react';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';

import CommentList from './CommentList';
import commentStore from '../stores/commentStore';
import fetchComments from '../actions/comment';

const CommentContainer = inject('commentStore')(observer(({commentStore}) => {
    return (
            <CommentList
                title={'Test'}
                comments={commentStore.comments}
                fetchComments={fetchComments}
            />
    );
}));


export default withWidth()(CommentContainer);


