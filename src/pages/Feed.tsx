import { Container } from "react-bootstrap";
import { PostList } from "../components/PostList";

function Feed() {
  return (
    <Container fluid="lg" className="px-0">
      {" "}
      <PostList />
    </Container>
  );
}

export default Feed;
