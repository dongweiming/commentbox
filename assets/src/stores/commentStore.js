import { observable, action } from 'mobx';

class CommentStore {

    @observable comments;

    constructor() {
        this.comments = [];
    }

    @action setComments = (comments) => {
        this.comments = comments;
    }
}

const commentStore = new CommentStore();

export default commentStore;
