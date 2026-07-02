import { Container } from "react-bootstrap";
import { PostList } from "../components/PostList";

function Feed() {
  return (
    <Container className="mt-4">
      <h2>Muro de publicaciones</h2>
      <PostList />
    </Container>
  );
}

export default Feed;