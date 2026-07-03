import { Container } from "react-bootstrap";
import { PostList } from "../components/PostList";

function Feed() {
  return (
    <Container className="mt-4">
  
      <PostList />
    </Container>
  );
}

export default Feed;