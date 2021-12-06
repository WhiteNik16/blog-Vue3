import {computed, ref} from "vue";
import {api} from "@/api/config";
import {error} from "@/composable/useUser";

const comments = ref(null)
const commentsAuthor = ref(null)


export function useComments(postId) {

    const loadComment = async function () {
        error.value = null
        const res = await api.get(`/comments/post/${postId}`)
        if (res.status === 200) {
            let arr = res.data
            const commentsObject = {}

            arr.forEach((comment) => {
                if (!comment.followedCommentID) {
                    const existingComment = commentsObject[comment._id]
                    existingComment
                        ? (commentsObject[comment._id] = {...existingComment, ...comment,}) : (commentsObject[comment._id] = {
                            ...comment, children: {},
                        })
                }
                if (comment.followedCommentID) {

                    const parentComment = commentsObject[comment.followedCommentID]
                    if (!parentComment) {
                        commentsObject[comment.followedCommentID] = {

                            _id: comment.followedCommentID,
                            children: {},
                        }
                    }
                    commentsObject[comment.followedCommentID].children[comment._id] = comment
                }
            })
            comments.value = commentsObject
            if (commentsObject) {
                await getUsersName(arr)
            }
        }

    }
    const deleteComment = ({id, postID}) => {
        error.value = null
        try {
            api.delete(`/comments/${id}`)
            console.log('succesful deletyte')

            loadComment(postID)
        } catch (e) {
            error.value = e
        }
    }

    const getUsersName = async function (arr) {
        error.value = null
        let name = arr.map((item) => {
            return item.commentedBy
        })

        function unique(arr) {
            let result = []

            for (let str of arr) {
                if (!result.includes(str)) {
                    result.push(str)
                }
            }

            return result
        }
        let uniqueName = unique(name)
        let Uniqarr = uniqueName.filter(function (e) {
            return e
        })
        const authorsResponse = await Promise.allSettled(
            Uniqarr.map((id) => api.get(`/users/${id}`)),
        )
        let authorsComment = authorsResponse.map((item) => {
            if (item.status === 'fulfilled') {
                return item.value.data
            }
        })
            .filter(function (e) {
                return e
            })
        commentsAuthor.value = authorsComment
    }
    const createNewComment = async function ({text, idPost, followedCommentID}) {
        error.value = null
        try {
            await api.post(`/comments/post/${idPost}`, {text, followedCommentID})
            await loadComment()
        } catch (e) {
            error.value = e
        }


    }
    const setLikeForComment = async function ({idComment, idPost}) {
        error.value = null
        try {
            await api.put(`/comments/like/${idComment}`)
            await loadComment(idPost)
        } catch (e) {
            error.value = e
        }
    }
    const updateComment = async ({id, postID, text}) => {
        error.value = null
        try {
            await api.patch(`/comments/${id}`, {text})
            console.log('succesful deletyte')
            await loadComment(postID)
        } catch (e) {
            error.value = e
        }
    }
    return {
        comments: computed(() => comments.value),
        authorComments: computed(() => commentsAuthor.value),
        createNewComment,
        loadComment,
        setLikeForComment,
        updateComment,
        deleteComment
    }
}