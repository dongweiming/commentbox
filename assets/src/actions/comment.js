import commentStore from '../stores/commentStore';


function fetchComments(token, sort='star') {
    request.get(`/j/comments?sort=${sort}&token=${token}`)
        .then((response) => response.json())
        .then((comments) => {
            commentStore.setComments(comments);
        });
}
