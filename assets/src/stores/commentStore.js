import { observable, action, computed } from 'mobx';

class CommentStore {

    @observable comments;
    @observable hasMore;
    @observable showPic;
    @observable star;
    @observable random;
    @observable pageLoaded;
    @observable hints;

    constructor() {
        this.comments = [];
        this.hasMore = true;
        this.showPic = false;
        this.random = false;
        this.star = true;
        this.pageLoaded = 0;
        this.hints = [];
    }

    @action setComments = (comments) => {
        this.comments = comments;
    }

    @action	loadComments(sort='star', start=0, limit=20, callback=null, reset=false) {
        fetch(`/j/comments?sort=${sort}&start=${start}&limit=${limit}`)
            .then((response) => response.json())
            .then((rs) => {
                let comments = rs.comments;
                if (!reset) {
                    comments = this.comments.concat(comments);
                }
                this.setComments(comments);
                this.hasMore = rs.has_more;
                if (callback) {
                    callback();
                }
            });
    }

    @action resetComments(sort='star', callback=null) {
        this.loadComments(sort, 0, 20, callback, true);
    }

    @computed get orderBy() {
        return this.star ? 'star' : 'random';
    }

    @action togglePic = () => {
        this.showPic = !this.showPic;
    }

    @action toggleOrderBy = () => {
        this.star = !this.star;
        this.random = !this.random;
        this.resetComments(this.orderBy);
        this.pageLoaded = 0;
    }

    @action loadCommentsForSearch(text) {
        var data = new FormData();
        data.append('text', text);
        fetch(`/j/search`, {
            method: 'POST',
            body: data
        })
            .then((response) => response.json())
            .then((rs) => {
                this.setComments(rs.comments);
                this.hasMore = false;
            });
    }

    @action loadSuggest(text) {
        var data = new FormData();
        data.append('text', text);
        fetch(`/j/suggest`, {
            method: 'POST',
            body: data
        })
            .then((response) => response.json())
            .then((rs) => {
                this.hints = rs.items;
            });
    }
}

const commentStore = new CommentStore();

export default commentStore;
