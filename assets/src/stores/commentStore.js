import { observable, action } from 'mobx';

class CommentStore {

    @observable comments;
    @observable hasMore;

    constructor() {
        this.comments = [];
        this.hasMore = true;
    }

    @action setComments = (comments) => {
        this.comments = comments;
    }

    @action	loadComments(sort='star', start=0, limit=20, callback=null) {
        fetch(`/j/comments?sort=${sort}&start=${start}&limit=${limit}`)
            .then((response) => response.json())
            .then((rs) => {
                let comments = this.comments.concat(rs.comments);
                this.setComments(comments);
                this.hasMore = rs.has_more;
                if (callback) {
                    callback();
                }
            });
    }
}

const commentStore = new CommentStore();

export default commentStore;
