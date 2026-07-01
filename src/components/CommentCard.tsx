import { Card } from "react-bootstrap";

import type { Comment } from "../data/comments";
import type { User } from "../data/users";

type CardProps = {
    comment: Comment,
    user: User
};


function CommentCard({ comment, user }: CardProps) {


    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{user.nickname}</Card.Title>
                <Card.Text>
                    {comment.content}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default CommentCard;