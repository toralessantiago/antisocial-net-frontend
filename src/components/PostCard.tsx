import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import type { Post } from "../data/Post";
import type { User } from "../data/users";

type CardProps = {
    post: Post,
    user: User 
};


function PostCard({ post, user }: CardProps) {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
            <Card.Body>
                <Card.Title>{user.nickname}</Card.Title>
                <Card.Text>
                    {post.description}
                </Card.Text>
            </Card.Body>
            <Card.Body>
                <Link to={`/posts/${post.id}`}>
                <Button variant="primary" className="mt-2">
                    Ver más
                </Button>
                </Link>
            </Card.Body>
        </Card>
    );
}

export default PostCard;