import { observable, action, computed } from 'mobx';

class CommentStore {

    @observable comments;
    @observable hasMore;
    @observable showPic;
    @observable star;
    @observable random;
    @observable pageLoaded;
    @observable hints;
    @observable pending;
    @observable useSearch;

    constructor() {
        this.comments = [];
        this.hasMore = true;
        this.showPic = false;
        this.random = false;
        this.star = true;
        this.pageLoaded = 0;
        this.hints = [];
        this.pending = false;
        this.useSearch = false;
    }

    @action setComments = (comments) => {
        this.comments = comments;
    }

    @action	loadComments(sort='star', start=0, limit=20, callback=null, reset=false) {
        this.pending = true;
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
                this.pending = false;
            });
    }

    @action resetComments(sort='star', callback=null) {
        this.loadComments(sort, 0, 20, callback, true);
        this.useSearch = false;
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
        this.setComments([]);
        this.resetComments(this.orderBy);
        this.pageLoaded = 0;
    }

    @action loadCommentsForSearch(id, type='song') {
        this.pending = true;
        this.useSearch = true;
        var data = new FormData();
        data.append('type', type);
        data.append('subject_id', id);
        fetch(`/j/search`, {
            method: 'POST',
            body: data
        })
            .then((response) => response.json())
            .then((rs) => {
                this.setComments(rs.comments);
                this.pending = false;
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
