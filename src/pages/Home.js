import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      {/* Main part */}
      <Row className="text-center py-5">
        <Col>
          <h1 className="display-4 fw-bold mb-3">Create Your Tier Lists</h1>
          <p className="lead mb-4">
            Rank anything from games to movies with our simple tier list maker.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button 
              size="lg" 
              variant="primary"
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline-secondary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </Col>
      </Row>

      {/* Descriptions */}
      <Row className="my-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <div className="fs-1 mb-3">⚒️</div>
              <Card.Title>Create Templates</Card.Title>
              <Card.Text>
                Upload images and create reusable templates for your tier lists.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <div className="fs-1 mb-3">↕️</div>
              <Card.Title>Drag & Drop</Card.Title>
              <Card.Text>
                Easily rank items with drag and drop interface.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <div className="fs-1 mb-3">📤</div>
              <Card.Title>Export & Share</Card.Title>
              <Card.Text>
                Export your tier lists as images and share them with your friends.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;